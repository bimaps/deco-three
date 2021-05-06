import { CheckerModuleBaseModel, CheckerFlowModel } from './../models/checkers/checker-internals';
import { ThreeCheckerReportModel } from './../models/checker-report.model';
import { ThreeStyleModel } from './../models/style.model';
import { ThreeThemeModel } from './../models/theme.model';
import { ThreeSpaceModel } from './../models/space.model';
import { ThreeUtils } from './three-utils';
import { ThreeSiteModel } from './../models/site.model';
import { ThreeGeometryModel } from './../models/geometry.model';
import { ThreeMaterialModel } from './../models/material.model';
import { ThreeBuildingModel } from './../models/building.model';
import { ThreeStoreyModel } from './../models/storey.model';
import { ObjectId, Model } from 'deco-api';
import { ThreeMaterialHelper } from './three.material';
import crypto from 'crypto';
import * as THREE from 'three';
import { MTLLoader, OBJLoader } from 'three-obj-mtl-loader';
import moment from 'moment';
import { ThreeObjectModel } from '../models/object.model';
import fs from 'fs';
let debug = require('debug')('app:helpers:three:importer');

export interface ThreeJsonData {
  metadata: {
    version: string,
    generator: string,
    type: string
  },
  object: ThreeJsonObject,
  geometries: Array<ThreeJsonGeometry>,
  materials: Array<ThreeJsonMaterial>
}

export interface ThreeJsonBase {
  _id: ObjectId;
  appId: ObjectId;
  siteId: ObjectId;
  uuid: string;
  name?: string;
  type: string;
  importId: string;
  childrenIds: Array<ObjectId>;
  parentId: ObjectId;
  userData?: {[key: string]: any};
}

export interface ThreeJsonObject extends ThreeJsonBase {
  children?: Array<ThreeJsonObject>;
  material?: string | Array<string>;
  matrix?: any;
  geometry?: string;
  layers?: number;
  color?: number;
  intensity?: number;
  visible?: boolean;
  _min?: THREE.Vector3;
  _max?: THREE.Vector3;
}

export interface ThreeJsonGeometry extends ThreeJsonBase {
  data?: {
    vertices?: Array<any>;
    attributes?: {
      position?: {
        array: number[]
      },
      normal?: {
        array: number[]
      }
    }
  };
}

export interface ThreeJsonMaterial extends ThreeJsonBase {

}

export interface ThreeImporterOptions {
  importId?: string;
  saveLights?: boolean;
  scaleFactor?: number;
  userData?: {[key: string]: any};
}

export interface ThreeDeleteData {
  model: string;
  nbDeleted: number;
}

export class ThreeImporterHelper {

  private mtlLoader: any;
  private objLoader: any;

  private site: ThreeSiteModel;

  private materials: Array<ThreeJsonMaterial> = [];
  private geometries: Array<ThreeJsonGeometry> = [];
  private objects: Array<ThreeJsonObject> = [];

  private scaleFactor = 1;
  private jsonData: ThreeJsonData;
  public importId: string;
  private saveLights: boolean = false;

  private measures: {[key: string]: {_min: THREE.Vector3, _max: THREE.Vector3}} = {};
  
  private startedImportDate: moment.Moment;

  private unsavedMaterialProperties: Array<string> = [];
  private unsavedGeometryProperties: Array<string> = [];
  private unsavedObjectProperties: Array<string> = [];

  public start(site: ThreeSiteModel, json: ThreeJsonData, options?: ThreeImporterOptions): Promise<any> {
    this.site = site;
    this.jsonData = json;
    if (options && options.importId) {
      this.importId = options.importId;
    } else {
      let len = 32;
      this.importId = crypto.randomBytes(Math.ceil(len / 2)).toString('hex').slice(0, len);
    }
    if (options && options.saveLights) {
      this.saveLights = true;
    } else {
      this.saveLights = false;
    }
    if (options && options.scaleFactor) {
      this.scaleFactor = options.scaleFactor;
    } else {
      this.scaleFactor = 1;
    }

    const reducingMaterialStats = ThreeMaterialHelper.reduceMaterials(this.jsonData);
    let userData = options && options.userData ? options.userData : undefined;

    this.startedImportDate = moment();
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

  public loadMTL(filename: string, preLoad: boolean = true, addToObjLoader: boolean = true): Promise<any> {
    if (!this.mtlLoader) this.mtlLoader = new MTLLoader();
    if (!this.objLoader) this.objLoader = new OBJLoader();
    return new Promise((resolve, reject) => {
      fs.readFile(filename, 'utf8', (error, data) => {
        if (error) return reject(error);
        let materials = this.mtlLoader.parse(data);
        if (preLoad) materials.preload()
        if (addToObjLoader) this.objLoader.setMaterials(materials);
        resolve(materials);
      });
    });
  }
  
  public loadOBJ(filename: string): Promise<THREE.Object3D> {
    if (!this.objLoader) this.objLoader = new OBJLoader();
    return new Promise((resolve, reject) => {
      fs.readFile(filename, 'utf8', (error, data) => {
        if (error) return reject(error);
        let object = this.objLoader.parse(data);
        resolve(object);
      });
    });
  }

  public rotate90X(object: THREE.Object3D): THREE.Object3D {
    const point = ThreeUtils.centroidFromObject(object);
    const angle = -90 / 180 * Math.PI;
    const axis = new THREE.Vector3(1, 0, 0);

    for (const child of object.children || []) {
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

  public removeData(siteId: ObjectId, modelNames: Array<string> = ['geometry', 'material', 'object', 'building', 'storey', 'space', 'theme', 'style', 'report', 'checker-flow', 'checker-modules'], beforeDate?: moment.Moment): Promise<Array<ThreeDeleteData>> {
    const bd: moment.Moment = beforeDate || moment().add(1, 'hour');
    let deletePromises: Array<Promise<any>> = [];
    for (let modelName of modelNames) {
      let model: typeof Model;
      if (modelName === 'geometry') model = ThreeGeometryModel;
      else if (modelName === 'material') model = ThreeMaterialModel;
      else if (modelName === 'object') model = ThreeObjectModel;
      else if (modelName === 'building') model = ThreeBuildingModel;
      else if (modelName === 'storey') model = ThreeStoreyModel;
      else if (modelName === 'space') model = ThreeSpaceModel;
      else if (modelName === 'theme') model = ThreeThemeModel;
      else if (modelName === 'style') model = ThreeStyleModel;
      else if (modelName === 'report') model = ThreeCheckerReportModel;
      else if (modelName === 'checker-flow') model = CheckerFlowModel;
      else if (modelName === 'checker-modules') model = CheckerModuleBaseModel;
      else continue;
      let query = {siteId: siteId, _createdAt: {$lt: bd.toDate()}};
      deletePromises.push(model.deco.db.collection(model.deco.collectionName).deleteMany(query).then((result) => {
        return {
          model: modelName,
          nbDeleted: result.deletedCount
        };
      }));
    }
    return Promise.all(deletePromises);
  }

  public removeImport(siteId: ObjectId, importId: string, beforeDate?: moment.Moment): Promise<Array<ThreeDeleteData>> {
    const bd: moment.Moment = beforeDate || moment().add(1, 'hour');
    let deletePromises: Array<Promise<any>> = [];
    let query = {importId: importId, siteId: siteId, _createdAt: {$lt: bd.toDate()}};
    deletePromises.push(ThreeObjectModel.deco.db.collection(ThreeObjectModel.deco.collectionName).deleteMany(query))
    deletePromises.push(ThreeMaterialModel.deco.db.collection(ThreeMaterialModel.deco.collectionName).deleteMany(query))
    deletePromises.push(ThreeGeometryModel.deco.db.collection(ThreeGeometryModel.deco.collectionName).deleteMany(query))
    deletePromises.push(ThreeBuildingModel.deco.db.collection(ThreeBuildingModel.deco.collectionName).deleteMany(query))
    deletePromises.push(ThreeStoreyModel.deco.db.collection(ThreeStoreyModel.deco.collectionName).deleteMany(query))
    deletePromises.push(ThreeSpaceModel.deco.db.collection(ThreeSpaceModel.deco.collectionName).deleteMany(query))

    return Promise.all(deletePromises).then((values) => {
      return [
        {model: 'object', nbDeleted: values[0].deletedCount},
        {model: 'material', nbDeleted: values[1].deletedCount},
        {model: 'geometry', nbDeleted: values[2].deletedCount},
        {model: 'building', nbDeleted: values[3].deletedCount},
        {model: 'storey', nbDeleted: values[4].deletedCount},
        {model: 'space', nbDeleted: values[5].deletedCount},
      ]
    });
  }

  private parse(userData?: {[key: string]: any}) {
    this.parseGeometries();
    this.roundGeometriesValues();
    this.parseMaterials();
    this.parseObject(this.jsonData.object, userData);
  }

  private parseGeometries() {
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

  private parseMaterials() {
    for (let material of this.jsonData.materials) {
      material.importId = this.importId;
      material.appId = this.site.appId;
      material.siteId = this.site._id;
      this.materials.push(material);
    }
  }

  private parseObject(object: ThreeJsonObject, userData?: {[key: string]: any}, parent: ThreeJsonObject | null = null) {
    if (object.type.toLowerCase().indexOf('camera') !== -1) return;
    if (object.type.toLowerCase().indexOf('light') !== -1 && !this.saveLights) return;

    object.importId = this.importId;
    object.appId = this.site.appId;
    object.siteId = this.site._id;
    if (!object._id) object._id = new ObjectId();
    if (!object.childrenIds) object.childrenIds = [];
    if (parent && parent._id && parent.type !== 'Scene') object.parentId = parent._id;
    
    if (!object.userData) object.userData = {};

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

  private measureObjects(): Promise<void> {
    return new Promise((resolve, reject) => {
      let loader = new THREE.ObjectLoader();
      loader.parse(this.jsonData, (data) => {
        data.traverse((obj) => {
          let bbox = new THREE.BoxHelper( obj );
          bbox.geometry.computeBoundingBox();
          let _min = bbox.geometry.boundingBox.min;
          let _max = bbox.geometry.boundingBox.max;

          this.measures[obj.uuid] = {_min: _min, _max: _max};
        });
        resolve();
      });
    });
  }

  private roundGeometriesValues(): void {
    for (let geometry of this.geometries) {
      if (geometry.type === 'Geometry' && geometry.data && geometry.data.vertices) {
        for (let verticeIndex in geometry.data.vertices) {
          geometry.data.vertices[verticeIndex] = ThreeImporterHelper.roundGeometryValue(geometry.data.vertices[verticeIndex]);
        }
      } else if (geometry.type === 'BufferGeometry') {
        if (geometry.data?.attributes?.position) {
          for (let index = 0; index < geometry.data.attributes.position.array.length; index++) {
            geometry.data.attributes.position.array[index] = ThreeImporterHelper.roundGeometryValue(geometry.data.attributes.position.array[index]);
          }
        }
        if (geometry.data?.attributes?.normal) {
          for (let index = 0; index < geometry.data.attributes.normal.array.length; index++) {
            geometry.data.attributes.normal.array[index] = ThreeImporterHelper.roundGeometryValue(geometry.data.attributes.normal.array[index]);
          }
        }
      }
    }
  }

  private static roundGeometryValue(value: number) {
    value = Math.round(value * 10000000) / 10000000;
    value = Math.abs(value) > 0.00000000001 ? value : 0;
    return value;
  }

  private applyMeasures() {
    for (let object of this.objects) {
      if (this.measures[object.uuid]) {
        object._min = this.measures[object.uuid]._min;
        object._max = this.measures[object.uuid]._max;
      }
    }
  }

  private save(): Promise<any> {
    return this.saveMaterials().then(() => {
      return this.saveGeometries();
    }).then(() => {
      return this.saveObjects();
    });
  }

  private saveMaterials(): Promise<any> {
    let materialPromises: Array<Promise<any>> = [];
    for (let material of this.materials) {
      materialPromises.push(ThreeMaterialModel.instanceFromDocument(material).then((materialInstance) => {
        return materialInstance.toDocument('insert').then(doc => doc.getInsertDocument());
      }).then((document) => {
        let missingKeys = this.keyDiffs(material, document);
        for (let key of missingKeys) {
          if (this.unsavedMaterialProperties.indexOf(key) === -1) this.unsavedMaterialProperties.push(key);
        }
        return document;
      }));
    }
    return Promise.all(materialPromises).then((documents) => {
      return ThreeMaterialModel.deco.db.collection(ThreeMaterialModel.deco.collectionName).insertMany(documents);
    });
  }

  private saveGeometries(): Promise<any> {
    let geometryPromises: Array<Promise<any>> = [];
    for (let geometry of this.geometries) {
      geometryPromises.push(ThreeGeometryModel.instanceFromDocument(geometry).then((geometryInstance) => {
        return geometryInstance.toDocument('insert').then(doc => doc.getInsertDocument());
      }).then((document) => {
        let missingKeys = this.keyDiffs(geometry, document);
        for (let key of missingKeys) {
          if (this.unsavedGeometryProperties.indexOf(key) === -1) this.unsavedGeometryProperties.push(key);
        }
        return document;
      }));
    }
    return Promise.all(geometryPromises).then((documents) => {
      return ThreeGeometryModel.deco.db.collection(ThreeGeometryModel.deco.collectionName).insertMany(documents);
    });
  }

  private saveObjects(): Promise<any> {
    let objectPromises: Array<Promise<any>> = [];
    for (let object of this.objects) {
      objectPromises.push(ThreeObjectModel.instanceFromDocument(object).then((objectInstance) => {
        return objectInstance.toDocument('insert').then(doc => doc.getInsertDocument());
      }).then((document) => {
        let missingKeys = this.keyDiffs(object, document);
        for (let key of missingKeys) {
          if (this.unsavedObjectProperties.indexOf(key) === -1) this.unsavedObjectProperties.push(key);
        }
        return document;
      }));
    }
    return Promise.all(objectPromises).then((documents) => {
      return ThreeObjectModel.deco.db.collection(ThreeObjectModel.deco.collectionName).insertMany(documents);
    });
  }

  private clearPreviousImport(): Promise<any> {
    return this.removeImport(this.site._id, this.importId, this.startedImportDate); 
  }

  private keyDiffs(object1: {[key: string]: any}, object2: {[key: string]: any}): Array<string> {
    let keys1 = Object.keys(object1);
    let keys2 = Object.keys(object2);
    return keys1.filter(k => keys2.indexOf(k) === -1);
  }
}