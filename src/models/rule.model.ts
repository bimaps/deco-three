import { CheckerJsonOutput, RuleModuleIOStyle } from './checkers/checker-interfaces';
import { ThreeSpaceModel } from './space.model';
import { ThreeGenerator } from '../helpers/three.generator';
import { ThreeGeometryModel } from './geometry.model';
import { ThreeMaterialModel } from './material.model';
import { ThreeObjectModel } from './object.model';
import {
  RuleModuleBaseModel,
  RuleModuleIORef,
  RuleModuleIOType,
  RuleModuleIOTypeValue,
  RuleModuleObjectCondition,
  RuleModuleValueCondition,
  ThreeFlow,
} from './checkers/checker-internals';
import { ThreeSiteModel } from './site.model';
import { AppModel, io, model, Model, mongo, ObjectId, Parser, query, Query, type, validate } from '@bim/deco-api';
import * as THREE from 'three';
import moment from 'moment';
import resolvePath from 'object-resolve-path';

let debug = require('debug')('app:models:three:checkers:flow');

@model('rule')
export class RuleModel extends Model implements ThreeFlow {
  @type.id
  public _id: ObjectId;

  @type.model({ model: AppModel })
  @io.input
  @io.toDocument
  @query.filterable()
  @validate.required
  @mongo.index({ type: 'single' })
  public appId: ObjectId;

  @type.string
  @io.all
  @validate.required
  public name: string = '';

  @type.string
  @io.all
  public description: string = '';

  @type.models({ model: RuleModuleBaseModel })
  @io.all
  public modulesIds: Array<ObjectId> = [];

  public _lastModule?: RuleModuleBaseModel;

  public scene: THREE.Scene;
  public modules: Array<RuleModuleBaseModel> = [];
  public outputs: {
    name: string;
    outputs: CheckerJsonOutput[];
  }[] = [];

  @type.string
  @io.all
  @query.filterable()
  public business: string = '';

  @type.string
  @io.all
  @query.filterable()
  public businessId: string = '';

  /** @deprecated */
  public async process(scene?: THREE.Scene): Promise<THREE.Scene> {
    // TODO rules migration: The scene should be process during reporting or theme views
    // this.scene = scene || await this.prepareScene(this.siteId);
    // for (const moduleId of this.modulesIds || []) {
    //   const moduleElement = await CheckerModuleBaseModel.deco.db
    //     .collection(CheckerModuleBaseModel.deco.collectionName)
    //     .findOne({_id: moduleId});
    //
    //   const instance = await CheckerModuleBaseModel.instanceFromDocument(moduleElement);
    //   if (instance) {
    //     this.modules.push(instance);
    //     await instance.process(this);
    //     await instance.summary();
    //   }
    // }
    return this.scene;
  }

  /** @deprecated */
  private async prepareScene(siteId: string | ObjectId): Promise<THREE.Scene> {
    const site = await ThreeSiteModel.getOneWithId(siteId);
    if (!site) {
      throw new Error('Site not found');
    }
    const objects = (await ThreeObjectModel.getAll(new Query({ siteId: site._id }))) || [];
    const matIds = objects.map((o) => o.material);
    const materials = await ThreeMaterialModel.getAll(new Query({ uuid: { $in: matIds } }));
    const geoIds = objects.map((o) => o.geometry);
    const geometries = await ThreeGeometryModel.getAll(new Query({ uuid: { $in: geoIds } }));
    const spaces = await ThreeSpaceModel.getAll(new Query({ siteId: site._id }));
    const sceneJson = {
      metadata: {
        version: 4.5,
        type: 'Object',
        generator: 'swissdata',
      },
      geometries: geometries,
      materials: materials,
      object: {
        children: objects,
        layers: 1,
        matrix: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
        type: 'Scene',
      },
    };
    const loader = new THREE.ObjectLoader();
    const scene: THREE.Object3D = await new Promise((resolve2, reject2) => {
      loader.parse(sceneJson, (object) => {
        resolve2(object);
      });
    });
    this.scene = scene as THREE.Scene;
    const generator = new ThreeGenerator();
    const spaceMaterial = new THREE.MeshBasicMaterial();
    for (const space of spaces) {
      const mesh = generator.space2mesh(space, spaceMaterial);
      if (mesh) {
        scene.add(mesh);
      }
    }
    return this.scene;
  }

  public fetchInput(varname: string):
      | {
    value: RuleModuleIOTypeValue;
    type: RuleModuleIOType;
    ref: RuleModuleIORef | RuleModuleIORef[];
    style: RuleModuleIOStyle | RuleModuleIOStyle[];
  }
      | undefined {
    if (varname === 'scene') {
      return {
        type: 'scene',
        value: this.scene,
        ref: undefined,
        style: 'default',
      };
    }
    for (const moduleInstance of this.modules) {
      if (moduleInstance.outputVarName === varname) {
        return {
          value: moduleInstance.outputValue,
          type: moduleInstance.outputType,
          ref: moduleInstance.outputReference,
          style: moduleInstance.outputStyle || 'default',
        };
      }
    }

    return undefined;
  }

  public fetchProp(object: THREE.Object3D, propPath: string): any {
    if (propPath.indexOf('#{') !== -1 || propPath.indexOf('!#') !== -1) {
      propPath = propPath.replace(/(#{|!{)/gm, '$1object:');
      return Parser.parseTemplate(propPath, { object });
    }

    const parts = propPath.split('.');
    for (let i = 0; i < parts.length; i++) {
      if (i === 0) {
        continue;
      }
      parts[i] = `["${parts[i]}"]`;
    }
    const key = parts.join('');
    return resolvePath(object, key);
  }

  public compareObject(object: THREE.Object3D, condition: RuleModuleObjectCondition): boolean {
    const value = this.fetchProp(object, condition.key);
    return this.compareValue(value, condition);
  }

  public compareValue(value: string | boolean | number | Date, condition: RuleModuleObjectCondition | RuleModuleValueCondition): boolean {
    if (typeof condition.value === 'number' && typeof value === 'string') {
      value = parseFloat(value);
    } else if (condition.value instanceof Date && typeof value === 'string') {
      value = moment(value).toDate();
    }
    if (condition.operation === '=') {
      if (this.makeNumberIfPossible(value) != this.makeNumberIfPossible(condition.value)) return false;
    } else if (condition.operation === '!=') {
      if (this.makeNumberIfPossible(value) == this.makeNumberIfPossible(condition.value)) return false;
    } else if (condition.operation === '<') {
      if (this.makeNumberIfPossible(value) > this.makeNumberIfPossible(condition.value)) return false;
    } else if (condition.operation === '>') {
      if (this.makeNumberIfPossible(value) < this.makeNumberIfPossible(condition.value)) return false;
    } else if (condition.operation === '*') {
      if (typeof condition.value !== 'string' && condition.value.toString) condition.value = condition.value.toString();
      if (value && typeof value !== 'string' && value.toString) value = value.toString();
      if (typeof value !== 'string' || typeof condition.value !== 'string') {
        // could not convert values to string
        return false;
      }
      if (value.toLowerCase().indexOf(condition.value.toLowerCase()) === -1) return false;
    }
    return true;
  }

  private makeNumberIfPossible(input: string | any): number | any {
    if (typeof input !== 'string') {
      return input;
    }
    const num = parseFloat(input.trim());
    return `${num}` === input.trim() ? num : input;
  }

  public getOutputs(convertObjectToIfcId = true): { name: string; outputs: CheckerJsonOutput[] }[] {
    const outputs = this.outputs;
    for (const output of outputs || []) {
      for (const output2 of output.outputs || []) {
        if (output2.ref) {
          if (Array.isArray(output2.ref)) {
            for (const index in output2.ref) {
              const ref = output2.ref[index];
              if (ref instanceof THREE.Mesh && ref.userData?.ifcId) {
                output2.ref[index] = { ifcId: ref.userData.ifcId };
              } else {
                output2.ref[index] = undefined;
              }
            }
          } else if (output2.ref instanceof THREE.Mesh && output2.ref.userData?.ifcId) {
            output2.ref = { ifcId: output2.ref.userData?.ifcId };
          } else {
            output2.ref = undefined;
          }
        }
      }
    }
    return outputs;
  }
}
