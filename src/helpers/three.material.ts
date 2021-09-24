import { ThreeMaterialModel } from "./../models/material.model";
import { ThreeJsonData, ThreeJsonObject } from "./three.importer";

let debug = require("debug")("app:helpers:three:material");

export interface ReduceMaterialsOptions {
  ignoreNameInMaterialId?: boolean;
}

export class ThreeMaterialHelper {
  static reduceMaterials(
    json: ThreeJsonData,
    options: ReduceMaterialsOptions = {}
  ) {
    let newMaterials: Array<any> = [];
    let materialMap: { [key: string]: string } = {};
    let materialHashes: { [key: string]: string } = {};
    let stats: any = {
      nbMaterialsOrigin: json.materials.length,
    };

    for (let material of json.materials) {
      let materialHash = ThreeMaterialModel.uniqueHashFromData(
        material,
        options.ignoreNameInMaterialId
      );
      if (materialHashes[materialHash]) {
        // we have already one instance of this material
        // then we map it to this instance
        materialMap[material.uuid] = materialHashes[materialHash];
      } else {
        // first time we have such instance, let's create one
        materialHashes[materialHash] = material.uuid;
        newMaterials.push(material);
      }
    }

    json.materials = newMaterials;

    ThreeMaterialHelper.mapChildrenWithMaterial(json.object, materialMap);
    stats.nbMaterialsFinal = newMaterials.length;
    return stats;
  }

  private static mapChildrenWithMaterial(
    object: ThreeJsonObject,
    materialMap: any
  ) {
    if (!object.children) return;
    for (let child of object.children) {
      if (child.material) {
        if (Array.isArray(child.material)) {
          let newArray = [];
          let childMaterials: Array<string> = child.material;
          for (let material of childMaterials) {
            if (materialMap[material]) {
              let newUuid = materialMap[material];
              newArray.push(newUuid);
            } else {
              newArray.push(material);
            }
            if (newArray.length === 1) {
              child.material = newArray[0];
            } else {
              child.material = newArray;
            }
          }
        } else {
          if (materialMap[child.material])
            child.material = materialMap[child.material];
        }
      }
      if (child.children) {
        ThreeMaterialHelper.mapChildrenWithMaterial(child, materialMap);
      }
    }
  }
}
