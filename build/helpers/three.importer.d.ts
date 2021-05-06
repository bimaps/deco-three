import { ThreeSiteModel } from './../models/site.model';
import { ObjectId } from 'deco-api';
import * as THREE from 'three';
import moment from 'moment';
export interface ThreeJsonData {
    metadata: {
        version: string;
        generator: string;
        type: string;
    };
    object: ThreeJsonObject;
    geometries: Array<ThreeJsonGeometry>;
    materials: Array<ThreeJsonMaterial>;
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
    userData?: {
        [key: string]: any;
    };
}
export interface ThreeJsonObject extends ThreeJsonBase {
    children?: Array<ThreeJsonObject>;
    material?: string | Array<string>;
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
                array: number[];
            };
            normal?: {
                array: number[];
            };
        };
    };
}
export interface ThreeJsonMaterial extends ThreeJsonBase {
}
export interface ThreeImporterOptions {
    importId?: string;
    saveLights?: boolean;
    scaleFactor?: number;
    userData?: {
        [key: string]: any;
    };
}
export interface ThreeDeleteData {
    model: string;
    nbDeleted: number;
}
export declare class ThreeImporterHelper {
    private mtlLoader;
    private objLoader;
    private site;
    private materials;
    private geometries;
    private objects;
    private scaleFactor;
    private jsonData;
    importId: string;
    private saveLights;
    private measures;
    private startedImportDate;
    private unsavedMaterialProperties;
    private unsavedGeometryProperties;
    private unsavedObjectProperties;
    start(site: ThreeSiteModel, json: ThreeJsonData, options?: ThreeImporterOptions): Promise<any>;
    loadMTL(filename: string, preLoad?: boolean, addToObjLoader?: boolean): Promise<any>;
    loadOBJ(filename: string): Promise<THREE.Object3D>;
    rotate90X(object: THREE.Object3D): THREE.Object3D;
    removeData(siteId: ObjectId, modelNames?: Array<string>, beforeDate?: moment.Moment): Promise<Array<ThreeDeleteData>>;
    removeImport(siteId: ObjectId, importId: string, beforeDate?: moment.Moment): Promise<Array<ThreeDeleteData>>;
    private parse;
    private parseGeometries;
    private parseMaterials;
    private parseObject;
    private measureObjects;
    private roundGeometriesValues;
    private static roundGeometryValue;
    private applyMeasures;
    private save;
    private saveMaterials;
    private saveGeometries;
    private saveObjects;
    private clearPreviousImport;
    private keyDiffs;
}
//# sourceMappingURL=three.importer.d.ts.map