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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IfcHelper = void 0;
const space_model_1 = require("./../models/space.model");
const storey_model_1 = require("./../models/storey.model");
const building_model_1 = require("./../models/building.model");
const object_model_1 = require("./../models/object.model");
const fs_1 = __importDefault(require("fs"));
const mv_1 = __importDefault(require("mv"));
const ifc_convert_1 = __importDefault(require("ifc-convert"));
const ifc2json_wrapper_1 = require("ifc2json-wrapper");
const THREE = __importStar(require("three"));
const debug = require('debug')('app:helpers:ifc');
class IfcHelper {
    static convert2obj(filepath) {
        const match = filepath.match(/\/?([^\/]*)$/);
        if (match === null || match.length < 2)
            throw new Error('Invalid filepath');
        const filename = match[1];
        if (filename.indexOf('.') !== -1)
            throw new Error('Invalid filename, must not contain extension');
        const src = `ignored/${filename}.ifc`;
        const dest = `ignored/${filename}.obj`;
        const mtlDest = `ignored/${filename}.mtl`;
        return new Promise((resolve, reject) => {
            mv_1.default(filepath, src, (error) => {
                if (error)
                    return reject(error);
                resolve();
            });
        }).then(() => {
            return ifc_convert_1.default(src, dest, { args: ['--use-element-guids', '--site-local-placement'] });
        }).then(() => {
            try {
                fs_1.default.accessSync(src, fs_1.default.constants.R_OK);
            }
            catch (error) {
                debug('Obj file not found');
                throw error;
            }
            try {
                fs_1.default.accessSync(mtlDest, fs_1.default.constants.R_OK);
            }
            catch (error) {
                debug('Mtl file not found');
                throw error;
            }
            return {
                ifcPath: src,
                objPath: dest,
                mtlPath: mtlDest
            };
        });
    }
    // public static parseIfcMetadata(filepath: string, importId: string) {
    //   throw new Error('parseIfcMetadata is not available on this server');
    // }
    static parseIfcMetadata(filepath, site, importId) {
        return __awaiter(this, void 0, void 0, function* () {
            let destinationpath = '';
            const options = {
                stdout: '',
                stderr: '' // ifc2json will store in this property the result of stderr
            };
            try {
                destinationpath = yield ifc2json_wrapper_1.ifc2json(filepath, options);
            }
            catch (error) {
                console.log('IFC2JSON');
                console.log('stdout', options.stdout);
                console.log('stderr', options.stderr);
                throw error;
            }
            console.log('ifc2json stdout:', options.stdout);
            const jsonstring = fs_1.default.readFileSync(destinationpath, { encoding: 'utf-8' });
            let json;
            try {
                json = JSON.parse(jsonstring);
            }
            catch (error) {
                throw new Error('Invalid JSON');
            }
            const ifc2objectId = {};
            for (let data of json) {
                if (data.userData && data.userData.type === 'IfcProject') {
                    // ignore
                    continue;
                }
                if (data.userData && data.userData.type === 'IfcSite') {
                    site.ifcSiteId = data.id;
                    ifc2objectId[site.ifcSiteId] = site._id;
                    if (data.userData && data.userData.location) {
                        const locationValues = data.userData.location.split(',').map((v) => parseFloat(v));
                        site.location = locationValues;
                    }
                    if (data.userData && data.userData.refDirection) {
                        const refDirectionValues = data.userData.refDirection.split(',').map((v) => parseFloat(v));
                        site.refDirection = refDirectionValues;
                    }
                    if (data.userData && data.userData.axis) {
                        const axisValues = data.userData.axis.split(',').map((v) => parseFloat(v));
                        site.axis = axisValues;
                    }
                    IfcHelper.psetInMetadata(data.userData, site);
                    yield site.update(['ifcSiteId', 'metadata', 'location', 'refDirection', 'axis']);
                    // TODO: Fix Matrix-Location bug
                    // const objects = await ThreeObjectModel.getAll(new Query({name: data.id}));
                    // if (objects.length) {
                    //   console.log('found objects', objects);
                    //   const locationValues = site.location
                    //     ? site.location
                    //     : [0, 0, 0];
                    //   const refDirectionValues = site.refDirection
                    //     ? site.refDirection
                    //     : [1, 0, 0];
                    //   const axisValues = site.axis
                    //     ? site.axis
                    //     : [0, 0, 1];
                    //   // const refDirectionValues = [1, 0, 0];
                    //   // const axisValues = [0, 0, 1];
                    //   const location: THREE.Vector3 = new THREE.Vector3(locationValues[0], locationValues[1], locationValues[2]);
                    //   const refDirection: THREE.Vector3 = new THREE.Vector3(refDirectionValues[0], refDirectionValues[1], refDirectionValues[2]); // vect1
                    //   const axis: THREE.Vector3 = new THREE.Vector3(axisValues[0], axisValues[1], axisValues[2]);  // vect3
                    //   const vect1 = refDirection.clone();
                    //   const vect3 = axis.clone();
                    //   const vect2 = axis.clone().cross(refDirection);
                    //   const matrix = new THREE.Matrix4().set(
                    //     vect1.x, vect2.x, vect3.x, location.x,
                    //     vect1.y, vect2.y, vect3.y, location.y,
                    //     vect1.z, vect2.z, vect3.z, location.z,
                    //     0, 0, 0, 1
                    //   );
                    //   for (let object of objects) {
                    //     const geometry = await ThreeGeometryModel.getOneWithQuery({uuid: object.geometry});
                    //     if (!geometry) {
                    //       continue;
                    //     }
                    //     const attributes: Array<number> = geometry.data?.attributes?.position?.array;
                    //     if (!attributes) {
                    //       continue;
                    //     }
                    //     for (let i = 0; i < attributes.length; i+=3) {
                    //     }
                    //     await geometry.update(['data']);
                    //   }
                    // }
                    continue;
                }
                if (data.userData && data.userData.type === 'IfcBuilding') {
                    const existingBuilding = yield building_model_1.ThreeBuildingModel.getOneWithQuery({ ifcBuildingId: data.id, siteId: site._id });
                    const building = existingBuilding ? existingBuilding : new building_model_1.ThreeBuildingModel;
                    if (!existingBuilding) {
                        building.siteId = site._id;
                        building.appId = site.appId;
                    }
                    building.name = data.userData.name || '';
                    building.ifcBuildingId = data.id;
                    building.importId = importId;
                    building.userData = data.userData;
                    building.userData.ifcId = data.id;
                    if (data.userData && data.userData.location) {
                        const locationValues = data.userData.location.split(',').map((v) => parseFloat(v));
                        building.location = locationValues;
                    }
                    if (data.userData && data.userData.refDirection) {
                        const refDirectionValues = data.userData.refDirection.split(',').map((v) => parseFloat(v));
                        building.refDirection = refDirectionValues;
                    }
                    if (data.userData && data.userData.axis) {
                        const axisValues = data.userData.axis.split(',').map((v) => parseFloat(v));
                        building.axis = axisValues;
                    }
                    IfcHelper.psetInMetadata(data.userData, building);
                    if (existingBuilding) {
                        yield building.update(['name', 'ifcBuildingId', 'importId', 'userData', 'metadata', 'location', 'refDirection', 'axis']);
                        ifc2objectId[data.id] = building._id;
                    }
                    else {
                        const newBuilding = yield building.insert();
                        ifc2objectId[data.id] = newBuilding._id;
                    }
                    continue;
                }
                if (data.userData && data.userData.type === 'IfcBuildingStorey') {
                    const existingStorey = yield storey_model_1.ThreeStoreyModel.getOneWithQuery({ ifcStoreyId: data.id, siteId: site._id });
                    const storey = existingStorey ? existingStorey : new storey_model_1.ThreeStoreyModel;
                    if (!existingStorey) {
                        storey.siteId = site._id;
                        storey.appId = site.appId;
                    }
                    storey.name = data.userData.name || '';
                    storey.buildingId = ifc2objectId[data.userData.buildingId];
                    storey.ifcStoreyId = data.id;
                    storey.importId = importId;
                    storey.userData = data.userData;
                    storey.userData.ifcId = data.id;
                    if (data.userData && data.userData.location) {
                        const locationValues = data.userData.location.split(',').map((v) => parseFloat(v));
                        storey.location = locationValues;
                    }
                    if (data.userData && data.userData.refDirection) {
                        const refDirectionValues = data.userData.refDirection.split(',').map((v) => parseFloat(v));
                        storey.refDirection = refDirectionValues;
                    }
                    if (data.userData && data.userData.axis) {
                        const axisValues = data.userData.axis.split(',').map((v) => parseFloat(v));
                        storey.axis = axisValues;
                    }
                    IfcHelper.psetInMetadata(data.userData, storey);
                    if (existingStorey) {
                        yield storey.update(['name', 'ifcBuildingId', 'buildingId', 'importId', 'userData', 'metadata', 'location', 'refDirection', 'axis']);
                        ifc2objectId[data.id] = storey._id;
                    }
                    else {
                        const newStorey = yield storey.insert();
                        ifc2objectId[data.id] = newStorey._id;
                    }
                    continue;
                }
                if (data.userData && data.userData.type === 'IfcSpace') {
                    const existingSpace = yield space_model_1.ThreeSpaceModel.getOneWithQuery({ ifcSpaceId: data.id, siteId: site._id });
                    const space = existingSpace ? existingSpace : new space_model_1.ThreeSpaceModel;
                    if (!existingSpace) {
                        space.siteId = site._id;
                        space.appId = site.appId;
                    }
                    space.name = data.userData.name || '';
                    space.buildingId = ifc2objectId[data.userData.buildingId];
                    space.storeyIds = [];
                    if (Array.isArray(data.userData.buildingStorey)) {
                        for (let storyId of data.userData.buildingStorey) {
                            space.storeyIds.push(ifc2objectId[storyId]);
                        }
                    }
                    space.ifcSpaceId = data.id;
                    space.importId = importId;
                    space.userData = data.userData;
                    space.userData.ifcId = data.id;
                    if (data.boundary) {
                        if (data.boundary.geometry.type === 'MultiLineString') {
                            data.boundary.geometry.type = 'Polygon';
                        }
                        if (data.boundary.properties && data.boundary.properties.location) {
                            const locationValues = data.boundary.properties.location.split(',').map((v) => parseFloat(v));
                            space.location = locationValues;
                        }
                        if (data.boundary.properties && data.boundary.properties.refDirection) {
                            const refDirectionValues = data.boundary.properties.refDirection.split(',').map((v) => parseFloat(v));
                            space.refDirection = refDirectionValues;
                        }
                        if (data.boundary.properties && data.boundary.properties.axis) {
                            const axisValues = data.boundary.properties.axis.split(',').map((v) => parseFloat(v));
                            space.axis = axisValues;
                        }
                        if (space.location && data.boundary.properties) {
                            const locationValues = space.location;
                            const refDirectionValues = data.boundary.properties.refDirection
                                ? data.boundary.properties.refDirection.split(',').map((v) => parseFloat(v))
                                : [1, 0, 0];
                            const axisValues = data.boundary.properties.axis
                                ? data.boundary.properties.axis.split(',').map((v) => parseFloat(v))
                                : [0, 0, 1];
                            const location = new THREE.Vector3(locationValues[0], locationValues[1], locationValues[2]);
                            const refDirection = new THREE.Vector3(refDirectionValues[0], refDirectionValues[1], refDirectionValues[2]); // vect1
                            const axis = new THREE.Vector3(axisValues[0], axisValues[1], axisValues[2]); // vect3
                            const vect1 = refDirection;
                            const vect3 = axis;
                            const vect2 = axis.cross(refDirection);
                            const matrix = new THREE.Matrix4().set(vect1.x, vect2.x, vect3.x, location.x, vect1.y, vect2.y, vect3.y, location.y, vect1.z, vect2.z, vect3.z, location.z, 0, 0, 0, 1);
                            if (data.boundary.geometry.type === 'Polygon') {
                                for (let ring of data.boundary.geometry.coordinates) {
                                    for (let position of ring) {
                                        const vectToTransform = new THREE.Vector3(position[0], position[1], 0);
                                        vectToTransform.applyMatrix4(matrix);
                                        position[0] = vectToTransform.x;
                                        position[1] = vectToTransform.y;
                                    }
                                }
                            }
                        }
                        space.boundary = data.boundary;
                    }
                    IfcHelper.psetInMetadata(data.userData, space);
                    if (existingSpace) {
                        yield space.update(['name', 'ifcBuildingId', 'buildingId', 'storeyIds', 'importId', 'userData', 'metadata', 'location', 'refDirection', 'boundary', 'axis']);
                        ifc2objectId[data.id] = space._id;
                    }
                    else {
                        const newSpace = yield space.insert();
                        ifc2objectId[data.id] = newSpace._id;
                    }
                    continue;
                }
                yield IfcHelper.applyUserDataFromIfc(data, importId, ifc2objectId);
            }
        });
    }
    static psetInMetadata(userData, object) {
        if (!Array.isArray(object.metadata)) {
            object.metadata = [];
        }
        const currentKeys = Object.keys(object.metadata);
        for (let key in userData.pset || {}) {
            const index = currentKeys.indexOf(key);
            if (index !== -1) {
                object.metadata[index].value = userData.pset[key];
            }
            else {
                object.metadata.push({ key: key, value: userData.pset[key] });
            }
        }
    }
    static applyUserDataFromIfc(data, importId, ifc2objectId, keepOriginalUserData = true) {
        return object_model_1.ThreeObjectModel.getOneWithQuery({ name: data.id, importId: importId }).then((object) => {
            if (!object)
                return;
            object.name = data.userData.name || object.name;
            if (keepOriginalUserData) {
                object.userData = Object.assign(object.userData, data.userData);
            }
            else {
                object.userData = data.userData;
            }
            object.userData.ifcId = data.id;
            if (object.userData.buildingId && ifc2objectId[object.userData.buildingId]) {
                object.buildingId = ifc2objectId[object.userData.buildingId];
            }
            if (Array.isArray(object.userData.buildingStorey)) {
                const storeys = [];
                for (let storey of object.userData.buildingStorey) {
                    if (ifc2objectId[storey]) {
                        storeys.push(ifc2objectId[storey]);
                    }
                }
                object.storeys = storeys;
            }
            else {
                object.storeys = [];
            }
            if (object.userData.spaceId && ifc2objectId[object.userData.spaceId]) {
                object.spaceId = ifc2objectId[object.userData.spaceId];
            }
            return object.update(['name', 'userData', 'buildingId', 'storeys', 'spaceId']).then((obj) => {
            });
        });
    }
}
exports.IfcHelper = IfcHelper;
//# sourceMappingURL=ifc.helper.js.map