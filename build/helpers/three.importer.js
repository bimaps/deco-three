"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThreeImporterHelper = void 0;
const checker_internals_1 = require("./../models/checkers/checker-internals");
const checker_report_model_1 = require("./../models/checker-report.model");
const style_model_1 = require("./../models/style.model");
const theme_model_1 = require("./../models/theme.model");
const space_model_1 = require("./../models/space.model");
const three_utils_1 = require("./three-utils");
const geometry_model_1 = require("./../models/geometry.model");
const material_model_1 = require("./../models/material.model");
const building_model_1 = require("./../models/building.model");
const storey_model_1 = require("./../models/storey.model");
const deco_api_1 = require("deco-api");
const three_material_1 = require("./three.material");
const crypto_1 = __importDefault(require("crypto"));
const THREE = __importStar(require("three"));
const three_obj_mtl_loader_1 = require("three-obj-mtl-loader");
const moment_1 = __importDefault(require("moment"));
const object_model_1 = require("../models/object.model");
const fs_1 = __importDefault(require("fs"));
let debug = require('debug')('app:helpers:three:importer');
class ThreeImporterHelper {
    constructor() {
        this.materials = [];
        this.geometries = [];
        this.objects = [];
        this.scaleFactor = 1;
        this.saveLights = false;
        this.measures = {};
        this.unsavedMaterialProperties = [];
        this.unsavedGeometryProperties = [];
        this.unsavedObjectProperties = [];
    }
    start(site, json, options) {
        this.site = site;
        this.jsonData = json;
        if (options && options.importId) {
            this.importId = options.importId;
        }
        else {
            let len = 32;
            this.importId = crypto_1.default.randomBytes(Math.ceil(len / 2)).toString('hex').slice(0, len);
        }
        if (options && options.saveLights) {
            this.saveLights = true;
        }
        else {
            this.saveLights = false;
        }
        if (options && options.scaleFactor) {
            this.scaleFactor = options.scaleFactor;
        }
        else {
            this.scaleFactor = 1;
        }
        const reducingMaterialStats = three_material_1.ThreeMaterialHelper.reduceMaterials(this.jsonData);
        let userData = options && options.userData ? options.userData : undefined;
        this.startedImportDate = moment_1.default();
        return this.measureObjects().then(() => {
            this.parse(userData);
            this.applyMeasures();
            return this.save();
        }).then(() => {
            return this.clearPreviousImport();
        }).then((removedObjects) => {
            return {
                reducingMaterialStats: reducingMaterialStats,
                unsavedMaterialProperties: this.unsavedMaterialProperties,
                unsavedGeometryProperties: this.unsavedGeometryProperties,
                unsavedObjectProperties: this.unsavedObjectProperties,
                removedObjects: removedObjects,
                nbObjectsSaved: this.objects.length,
                nbMaterialsSaved: this.materials.length,
                nbGeometrySaved: this.geometries.length,
                importId: this.importId
            };
        });
    }
    loadMTL(filename, preLoad = true, addToObjLoader = true) {
        if (!this.mtlLoader)
            this.mtlLoader = new three_obj_mtl_loader_1.MTLLoader();
        if (!this.objLoader)
            this.objLoader = new three_obj_mtl_loader_1.OBJLoader();
        return new Promise((resolve, reject) => {
            fs_1.default.readFile(filename, 'utf8', (error, data) => {
                if (error)
                    return reject(error);
                let materials = this.mtlLoader.parse(data);
                if (preLoad)
                    materials.preload();
                if (addToObjLoader)
                    this.objLoader.setMaterials(materials);
                resolve(materials);
            });
        });
    }
    loadOBJ(filename) {
        if (!this.objLoader)
            this.objLoader = new three_obj_mtl_loader_1.OBJLoader();
        return new Promise((resolve, reject) => {
            fs_1.default.readFile(filename, 'utf8', (error, data) => {
                if (error)
                    return reject(error);
                let object = this.objLoader.parse(data);
                resolve(object);
            });
        });
    }
    rotate90X(object) {
        const point = three_utils_1.ThreeUtils.centroidFromObject(object);
        const angle = -90 / 180 * Math.PI;
        const axis = new THREE.Vector3(1, 0, 0);
        for (const child of object.children || []) {
            const translation = child.position.clone().sub(point).projectOnPlane(axis);
            const translation2 = translation.clone().applyAxisAngle(new THREE.Vector3(1, 0, 0), angle);
            if (child instanceof THREE.Mesh) {
                child.geometry.translate(translation.x * -1, translation.y * -1, translation.z * -1);
                child.geometry.rotateX(angle);
                child.geometry.translate(translation2.x, translation2.y, translation2.z);
            }
        }
        return object;
    }
    removeData(siteId, modelNames = ['geometry', 'material', 'object', 'building', 'storey', 'space', 'theme', 'style', 'report', 'checker-flow', 'checker-modules'], beforeDate) {
        const bd = beforeDate || moment_1.default().add(1, 'hour');
        let deletePromises = [];
        for (let modelName of modelNames) {
            let model;
            if (modelName === 'geometry')
                model = geometry_model_1.ThreeGeometryModel;
            else if (modelName === 'material')
                model = material_model_1.ThreeMaterialModel;
            else if (modelName === 'object')
                model = object_model_1.ThreeObjectModel;
            else if (modelName === 'building')
                model = building_model_1.ThreeBuildingModel;
            else if (modelName === 'storey')
                model = storey_model_1.ThreeStoreyModel;
            else if (modelName === 'space')
                model = space_model_1.ThreeSpaceModel;
            else if (modelName === 'theme')
                model = theme_model_1.ThreeThemeModel;
            else if (modelName === 'style')
                model = style_model_1.ThreeStyleModel;
            else if (modelName === 'report')
                model = checker_report_model_1.ThreeCheckerReportModel;
            else if (modelName === 'checker-flow')
                model = checker_internals_1.CheckerFlowModel;
            else if (modelName === 'checker-modules')
                model = checker_internals_1.CheckerModuleBaseModel;
            else
                continue;
            let query = { siteId: siteId, _createdAt: { $lt: bd.toDate() } };
            deletePromises.push(model.deco.db.collection(model.deco.collectionName).deleteMany(query).then((result) => {
                return {
                    model: modelName,
                    nbDeleted: result.deletedCount
                };
            }));
        }
        return Promise.all(deletePromises);
    }
    removeImport(siteId, importId, beforeDate) {
        const bd = beforeDate || moment_1.default().add(1, 'hour');
        let deletePromises = [];
        let query = { importId: importId, siteId: siteId, _createdAt: { $lt: bd.toDate() } };
        deletePromises.push(object_model_1.ThreeObjectModel.deco.db.collection(object_model_1.ThreeObjectModel.deco.collectionName).deleteMany(query));
        deletePromises.push(material_model_1.ThreeMaterialModel.deco.db.collection(material_model_1.ThreeMaterialModel.deco.collectionName).deleteMany(query));
        deletePromises.push(geometry_model_1.ThreeGeometryModel.deco.db.collection(geometry_model_1.ThreeGeometryModel.deco.collectionName).deleteMany(query));
        deletePromises.push(building_model_1.ThreeBuildingModel.deco.db.collection(building_model_1.ThreeBuildingModel.deco.collectionName).deleteMany(query));
        deletePromises.push(storey_model_1.ThreeStoreyModel.deco.db.collection(storey_model_1.ThreeStoreyModel.deco.collectionName).deleteMany(query));
        deletePromises.push(space_model_1.ThreeSpaceModel.deco.db.collection(space_model_1.ThreeSpaceModel.deco.collectionName).deleteMany(query));
        return Promise.all(deletePromises).then((values) => {
            return [
                { model: 'object', nbDeleted: values[0].deletedCount },
                { model: 'material', nbDeleted: values[1].deletedCount },
                { model: 'geometry', nbDeleted: values[2].deletedCount },
                { model: 'building', nbDeleted: values[3].deletedCount },
                { model: 'storey', nbDeleted: values[4].deletedCount },
                { model: 'space', nbDeleted: values[5].deletedCount },
            ];
        });
    }
    parse(userData) {
        this.parseGeometries();
        this.roundGeometriesValues();
        this.parseMaterials();
        this.parseObject(this.jsonData.object, userData);
    }
    parseGeometries() {
        for (let geometry of this.jsonData.geometries) {
            geometry.importId = this.importId;
            geometry.appId = this.site.appId;
            geometry.siteId = this.site._id;
            if (geometry.type === 'Geometry' && geometry.data && geometry.data.vertices) {
                for (let verticeIndex in geometry.data.vertices) {
                    geometry.data.vertices[verticeIndex] = geometry.data.vertices[verticeIndex] * this.scaleFactor;
                }
            }
            this.geometries.push(geometry);
        }
    }
    parseMaterials() {
        for (let material of this.jsonData.materials) {
            material.importId = this.importId;
            material.appId = this.site.appId;
            material.siteId = this.site._id;
            this.materials.push(material);
        }
    }
    parseObject(object, userData, parent = null) {
        if (object.type.toLowerCase().indexOf('camera') !== -1)
            return;
        if (object.type.toLowerCase().indexOf('light') !== -1 && !this.saveLights)
            return;
        object.importId = this.importId;
        object.appId = this.site.appId;
        object.siteId = this.site._id;
        if (!object._id)
            object._id = new deco_api_1.ObjectId();
        if (!object.childrenIds)
            object.childrenIds = [];
        if (parent && parent._id && parent.type !== 'Scene')
            object.parentId = parent._id;
        if (!object.userData)
            object.userData = {};
        if (object.children && Array.isArray(object.children)) {
            for (let child of object.children) {
                this.parseObject(child, userData, object);
            }
            object.childrenIds = object.children.map(i => i._id);
            delete object.children;
        }
        if (object.type !== 'Scene') {
            this.objects.push(object);
        }
        return object;
    }
    measureObjects() {
        return new Promise((resolve, reject) => {
            let loader = new THREE.ObjectLoader();
            loader.parse(this.jsonData, (data) => {
                data.traverse((obj) => {
                    let bbox = new THREE.BoxHelper(obj);
                    bbox.geometry.computeBoundingBox();
                    let _min = bbox.geometry.boundingBox.min;
                    let _max = bbox.geometry.boundingBox.max;
                    this.measures[obj.uuid] = { _min: _min, _max: _max };
                });
                resolve();
            });
        });
    }
    roundGeometriesValues() {
        var _a, _b, _c, _d;
        for (let geometry of this.geometries) {
            if (geometry.type === 'Geometry' && geometry.data && geometry.data.vertices) {
                for (let verticeIndex in geometry.data.vertices) {
                    geometry.data.vertices[verticeIndex] = ThreeImporterHelper.roundGeometryValue(geometry.data.vertices[verticeIndex]);
                }
            }
            else if (geometry.type === 'BufferGeometry') {
                if ((_b = (_a = geometry.data) === null || _a === void 0 ? void 0 : _a.attributes) === null || _b === void 0 ? void 0 : _b.position) {
                    for (let index = 0; index < geometry.data.attributes.position.array.length; index++) {
                        geometry.data.attributes.position.array[index] = ThreeImporterHelper.roundGeometryValue(geometry.data.attributes.position.array[index]);
                    }
                }
                if ((_d = (_c = geometry.data) === null || _c === void 0 ? void 0 : _c.attributes) === null || _d === void 0 ? void 0 : _d.normal) {
                    for (let index = 0; index < geometry.data.attributes.normal.array.length; index++) {
                        geometry.data.attributes.normal.array[index] = ThreeImporterHelper.roundGeometryValue(geometry.data.attributes.normal.array[index]);
                    }
                }
            }
        }
    }
    static roundGeometryValue(value) {
        value = Math.round(value * 10000000) / 10000000;
        value = Math.abs(value) > 0.00000000001 ? value : 0;
        return value;
    }
    applyMeasures() {
        for (let object of this.objects) {
            if (this.measures[object.uuid]) {
                object._min = this.measures[object.uuid]._min;
                object._max = this.measures[object.uuid]._max;
            }
        }
    }
    save() {
        return this.saveMaterials().then(() => {
            return this.saveGeometries();
        }).then(() => {
            return this.saveObjects();
        });
    }
    saveMaterials() {
        let materialPromises = [];
        for (let material of this.materials) {
            materialPromises.push(material_model_1.ThreeMaterialModel.instanceFromDocument(material).then((materialInstance) => {
                return materialInstance.toDocument('insert').then(doc => doc.getInsertDocument());
            }).then((document) => {
                let missingKeys = this.keyDiffs(material, document);
                for (let key of missingKeys) {
                    if (this.unsavedMaterialProperties.indexOf(key) === -1)
                        this.unsavedMaterialProperties.push(key);
                }
                return document;
            }));
        }
        return Promise.all(materialPromises).then((documents) => {
            return material_model_1.ThreeMaterialModel.deco.db.collection(material_model_1.ThreeMaterialModel.deco.collectionName).insertMany(documents);
        });
    }
    saveGeometries() {
        let geometryPromises = [];
        for (let geometry of this.geometries) {
            geometryPromises.push(geometry_model_1.ThreeGeometryModel.instanceFromDocument(geometry).then((geometryInstance) => {
                return geometryInstance.toDocument('insert').then(doc => doc.getInsertDocument());
            }).then((document) => {
                let missingKeys = this.keyDiffs(geometry, document);
                for (let key of missingKeys) {
                    if (this.unsavedGeometryProperties.indexOf(key) === -1)
                        this.unsavedGeometryProperties.push(key);
                }
                return document;
            }));
        }
        return Promise.all(geometryPromises).then((documents) => {
            return geometry_model_1.ThreeGeometryModel.deco.db.collection(geometry_model_1.ThreeGeometryModel.deco.collectionName).insertMany(documents);
        });
    }
    saveObjects() {
        let objectPromises = [];
        for (let object of this.objects) {
            objectPromises.push(object_model_1.ThreeObjectModel.instanceFromDocument(object).then((objectInstance) => {
                return objectInstance.toDocument('insert').then(doc => doc.getInsertDocument());
            }).then((document) => {
                let missingKeys = this.keyDiffs(object, document);
                for (let key of missingKeys) {
                    if (this.unsavedObjectProperties.indexOf(key) === -1)
                        this.unsavedObjectProperties.push(key);
                }
                return document;
            }));
        }
        return Promise.all(objectPromises).then((documents) => {
            return object_model_1.ThreeObjectModel.deco.db.collection(object_model_1.ThreeObjectModel.deco.collectionName).insertMany(documents);
        });
    }
    clearPreviousImport() {
        return this.removeImport(this.site._id, this.importId, this.startedImportDate);
    }
    keyDiffs(object1, object2) {
        let keys1 = Object.keys(object1);
        let keys2 = Object.keys(object2);
        return keys1.filter(k => keys2.indexOf(k) === -1);
    }
}
exports.ThreeImporterHelper = ThreeImporterHelper;
//# sourceMappingURL=three.importer.js.map