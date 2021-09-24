import { ThreeUtils } from "../../helpers/three-utils";
import {
  RULE_MODULE_MONGO_COLLECTION_NAME,
  RuleModel,
  RuleModuleBaseModel,
  RuleModuleExtract,
  RuleModuleExtractTypeOptions,
  RuleModuleIORef,
  RuleModuleIOType,
  RuleModuleIOTypeOptions,
  RuleModuleType,
  RuleModuleTypeOptions,
  ThreeExtractType,
} from "../checkers/checker-internals";
import {
  AppModel,
  io,
  model,
  mongo,
  ObjectId,
  query,
  type,
  validate,
} from "@bim/deco-api";
import * as THREE from "three";

let debug = require("debug")("app:models:three:checker:module-extract");

@model(RULE_MODULE_MONGO_COLLECTION_NAME)
export class RuleModuleExtractModel
  extends RuleModuleBaseModel
  implements RuleModuleExtract
{
  @type.id
  public _id: ObjectId;

  @type.model({ model: AppModel })
  @io.input
  @io.toDocument
  @query.filterable()
  @validate.required
  @mongo.index({ type: "single" })
  public appId: ObjectId;

  @type.select({ options: RuleModuleIOTypeOptions, multiple: true })
  @io.toDocument
  @io.output
  public allowedInputTypes: Array<RuleModuleIOType> = [
    "three-objects",
    "scene",
    "three-object",
  ];

  @type.select({ options: RuleModuleTypeOptions })
  @io.toDocument
  @io.output
  @validate.required
  public moduleType: RuleModuleType = "extract";

  @type.string
  @io.all
  @validate.required
  public name: string = "";

  @type.string
  @io.all
  public description: string = "";

  @type.string
  @io.all
  @validate.required
  public inputVarName?: string;

  @type.string
  @io.all
  @validate.required
  public outputVarName: string;

  @type.select({ options: RuleModuleIOTypeOptions, multiple: false })
  @io.toDocument
  @io.output
  public outputType: RuleModuleIOType;

  public outputValue: RuleModuleIOType;

  @type.string
  @io.toDocument
  @io.output
  public outputSummary: string;

  @type.select({ options: RuleModuleExtractTypeOptions })
  @io.all
  public extractType: ThreeExtractType;

  @type.any
  @io.all
  public value: any;

  @type.boolean
  @io.all
  public forceOutputAsNumber: boolean;

  private inputObjects: Array<THREE.Object3D> = [];
  private multiple = true;

  public async process(flow: RuleModel): Promise<void> {
    super.process(flow);
    this.multiple = true;
    if (this.currentInput && this.currentInputType === "three-objects") {
      this.inputObjects = this.currentInput as THREE.Object3D[];
    } else if (this.currentInput && this.currentInputType === "scene") {
      this.inputObjects = [];
      flow.scene.traverse((obj) => {
        this.inputObjects.push(obj);
      });
    } else if (this.currentInput && this.currentInputType === "three-object") {
      this.inputObjects = [this.currentInput as THREE.Object3D];
      this.multiple = false;
    } else {
      throw new Error("Invalid extract input");
    }

    const output: any[] = [];
    const refs: RuleModuleIORef[] = [];
    for (const object of this.inputObjects) {
      if (this.extractType === "property") {
        let value = flow.fetchProp(object, this.value);
        if (this.forceOutputAsNumber && typeof value !== "number") {
          value = parseFloat(value);
        }
        output.push(value);
        refs.push(object);
      } else if (this.extractType === "faces") {
        const faces = this.extractFaces(object);
        output.push(...faces);
        const refsForFaces: RuleModuleIORef[] = Array(faces.length).fill(
          object
        );
        refs.push(...refsForFaces);
        this.outputType = "triangles";
      } else if (this.extractType === "edges") {
        const edges = this.extractEdges(object);
        output.push(...edges);
        const refForEdges: RuleModuleIORef[] = Array(edges.length).fill(object);
        refs.push(...refForEdges);
        this.outputType = "line3s";
      } else if (this.extractType === "wireframe") {
        const wireframes = this.extractWireframe(object);
        output.push(...wireframes);
        const refForWireframes: RuleModuleIORef[] = Array(
          wireframes.length
        ).fill(object);
        refs.push(...refForWireframes);
        this.outputType = "line3s";
      } else if (this.extractType === "vertices") {
        const vertices = this.extractVertices(object);
        output.push(...vertices);
        const refForVertices: RuleModuleIORef[] = Array(vertices.length).fill(
          object
        );
        refs.push(...refForVertices);
        this.outputType = "vector3s";
      }
    }

    if (typeof output[0] === "boolean") {
      this.outputType = this.multiple ? "booleans" : "boolean";
    } else if (typeof output[0] === "number") {
      this.outputType = this.multiple ? "numbers" : "number";
    } else if (typeof output[0] === "string") {
      this.outputType = this.multiple ? "strings" : "string";
    }

    this.outputValue = this.multiple ? output : output[0];
    this.outputReference = this.multiple ? refs : refs[0];
  }

  public async summary(): Promise<void> {
    if (this.extractType !== "property" && Array.isArray(this.outputValue)) {
      this.outputSummary = `${this.outputValue.length} ${this.extractType}`;
    } else if (Array.isArray(this.outputValue)) {
      const firstValues = (
        this.outputValue as boolean[] | number[] | string[]
      ).slice(0, 3);
      this.outputSummary = firstValues.join(", ");
    } else {
      this.outputSummary = "";
    }
    await this.update(["outputSummary"]);
  }

  private extractFaces(object: THREE.Object3D): THREE.Triangle[] {
    const triangles: THREE.Triangle[] = [];
    if (object instanceof THREE.Mesh) {
      const geometry = object.geometry;
      if (geometry instanceof THREE.Geometry) {
        for (let face of geometry.faces) {
          triangles.push(
            new THREE.Triangle(
              geometry.vertices[face.a],
              geometry.vertices[face.b],
              geometry.vertices[face.c]
            )
          );
        }
      } else {
        var tempGeo = new THREE.Geometry().fromBufferGeometry(geometry);
        for (let face of tempGeo.faces) {
          triangles.push(
            new THREE.Triangle(
              tempGeo.vertices[face.a] /*.applyMatrix4(object.matrix)*/,
              tempGeo.vertices[face.b] /*.applyMatrix4(object.matrix)*/,
              tempGeo.vertices[face.c] /*.applyMatrix4(object.matrix)*/
            )
          );
        }
      }
    }
    return triangles;
  }

  private extractWireframe(object: THREE.Object3D): THREE.Line3[] {
    const edgeIndexPairs: { [key: string]: boolean } = {};
    const edges: THREE.Line3[] = [];
    if (object instanceof THREE.Mesh) {
      const geometry = object.geometry;
      if (geometry instanceof THREE.Geometry) {
        for (let face of geometry.faces) {
          if (!edgeIndexPairs[`${face.a}-${face.b}`]) {
            edges.push(
              new THREE.Line3(
                geometry.vertices[face.a],
                geometry.vertices[face.b]
              )
            );
            edgeIndexPairs[`${face.a}-${face.b}`] = true;
            edgeIndexPairs[`${face.b}-${face.a}`] = true;
          }
          if (!edgeIndexPairs[`${face.a}-${face.c}`]) {
            edges.push(
              new THREE.Line3(
                geometry.vertices[face.a],
                geometry.vertices[face.c]
              )
            );
            edgeIndexPairs[`${face.a}-${face.c}`] = true;
            edgeIndexPairs[`${face.c}-${face.a}`] = true;
          }
          if (!edgeIndexPairs[`${face.c}-${face.b}`]) {
            edges.push(
              new THREE.Line3(
                geometry.vertices[face.c],
                geometry.vertices[face.b]
              )
            );
            edgeIndexPairs[`${face.c}-${face.b}`] = true;
            edgeIndexPairs[`${face.b}-${face.c}`] = true;
          }
        }
      } else {
        var tempGeo = new THREE.Geometry().fromBufferGeometry(geometry);
        const vertices = tempGeo.vertices.map(
          (v) => v /*.applyMatrix4(object.matrix)*/
        );
        for (let face of tempGeo.faces) {
          if (!edgeIndexPairs[`${face.a}-${face.b}`]) {
            edges.push(new THREE.Line3(vertices[face.a], vertices[face.b]));
            edgeIndexPairs[`${face.a}-${face.b}`] = true;
            edgeIndexPairs[`${face.b}-${face.a}`] = true;
          }
          if (!edgeIndexPairs[`${face.a}-${face.c}`]) {
            edges.push(new THREE.Line3(vertices[face.a], vertices[face.c]));
            edgeIndexPairs[`${face.a}-${face.c}`] = true;
            edgeIndexPairs[`${face.c}-${face.a}`] = true;
          }
          if (!edgeIndexPairs[`${face.c}-${face.b}`]) {
            edges.push(new THREE.Line3(vertices[face.c], vertices[face.b]));
            edgeIndexPairs[`${face.c}-${face.b}`] = true;
            edgeIndexPairs[`${face.b}-${face.c}`] = true;
          }
        }
      }
    }
    return edges;
  }

  private extractEdges(object: THREE.Object3D): THREE.Line3[] {
    if (object instanceof THREE.Mesh) {
      return ThreeUtils.edgesFromObject(object);
    }
    return [];
  }

  private extractVertices(object: THREE.Object3D): THREE.Vector3[] {
    const vertices: Array<THREE.Vector3> = [];
    if (object instanceof THREE.Mesh) {
      const geometry = object.geometry;
      if (geometry instanceof THREE.Geometry) {
        vertices.push(...geometry.vertices.map((v) => v.clone()));
      } else {
        var tempGeo = new THREE.Geometry().fromBufferGeometry(geometry);
        for (var i = 0; i < tempGeo.vertices.length; i++) {
          vertices.push(tempGeo.vertices[i] /*.applyMatrix4(object.matrix)*/);
        }
      }
    }
    return vertices;
  }
}
