"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThreeMaterialHelper = void 0;
const material_model_1 = require("./../models/material.model");
let debug = require('debug')('app:helpers:three:material');
class ThreeMaterialHelper {
    static reduceMaterials(json, options = {}) {
        let newMaterials = [];
        let materialMap = {};
        let materialHashes = {};
        let stats = {
            nbMaterialsOrigin: json.materials.length
        };
        for (let material of json.materials) {
            let materialHash = material_model_1.ThreeMaterialModel.uniqueHashFromData(material, options.ignoreNameInMaterialId);
            if (materialHashes[materialHash]) {
                // we have already one instance of this material
                // then we map it to this instance
                materialMap[material.uuid] = materialHashes[materialHash];
            }
            else {
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
    static mapChildrenWithMaterial(object, materialMap) {
        if (!object.children)
            return;
        for (let child of object.children) {
            if (child.material) {
                if (Array.isArray(child.material)) {
                    let newArray = [];
                    let childMaterials = child.material;
                    for (let material of childMaterials) {
                        if (materialMap[material]) {
                            let newUuid = materialMap[material];
                            newArray.push(newUuid);
                        }
                        else {
                            newArray.push(material);
                        }
                        if (newArray.length === 1) {
                            child.material = newArray[0];
                        }
                        else {
                            child.material = newArray;
                        }
                    }
                }
                else {
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
exports.ThreeMaterialHelper = ThreeMaterialHelper;
//# sourceMappingURL=three.material.js.map