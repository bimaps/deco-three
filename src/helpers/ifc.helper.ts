import { ThreeSpaceModel } from './../models/space.model';
import { ThreeStoreyModel } from './../models/storey.model';
import { ThreeBuildingModel } from './../models/building.model';
import { ThreeSiteModel } from './../models/site.model';
import { ThreeObjectModel } from './../models/object.model';
import fs from 'fs';
import mv from 'mv';
import ifcConvert from 'ifc-convert';
import { ifc2json } from 'ifc2json-wrapper';
import { ObjectId, Metadata, Query } from 'deco-api'; 
import * as THREE from 'three';
import fetch from 'node-fetch';
import FormData from 'form-data';

const debug = require('debug')('app:helpers:ifc');


export interface ObjFileResponse {
  ifcPath: string;
  objPath: string;
  mtlPath: string;
}

interface UserDataFromIfc {
  id: string;
  userData: {
    [key: string]: any;
    pset: any;
  };
  boundary?: GeoJSON.Feature;
}

export interface ConvertFileResponse {
  ifcPath: string;
  objPath?: string;
  mtlPath?: string;
  jsonPath?: string;
}

export class IfcHelper {

  public static IFC_SERVICE_HOST = process.env.IFC_SERVICE_HOST;
  public static IFC_SERVICE_API_KEY = process.env.IFC_SERVICE_API_KEY;

  public static async convertWithMicroservice(filepath: string, formats: ('json' | 'obj')[] = ['obj', 'json']): Promise<ConvertFileResponse> {

    const returnedValue: ConvertFileResponse = {
      ifcPath: filepath
    };

    const method = 'POST';
    const url = `${IfcHelper.IFC_SERVICE_HOST}/ifc-convert?formats=${formats.join(',')}`;

    debug('convertWithMicroservice method/url', method, url);

    const form = new FormData();
    form.append('ifc', fs.createReadStream(filepath));

    debug('convertWithMicroservice form', form);

    const response = await fetch(url, {
      method: method,
      body: form,
      headers: {
        "x-api-key": IfcHelper.IFC_SERVICE_API_KEY || ''
      }
    });
    const operation = await response.json();
    debug('convertWithMicroservice operation response', JSON.stringify(operation));

    const completedOperation = await IfcHelper.waitForOperationCompletion(operation);

    const formatsToParse: ('json' | 'obj' | 'mtl')[] = formats;
    if (formats.includes('obj')) {
      formatsToParse.push('mtl');
    }
    
    for (const format of formatsToParse) {
      debug('convertWithMicroservice fetching file for format', format);
      const fileId = completedOperation.formats[format];
      if (!fileId) {
        throw new Error('Missing fileId for format: ' + format);
      }
      debug('convertWithMicroservice fileId', fileId);
      const method = 'GET';
      const url = `${IfcHelper.IFC_SERVICE_HOST}/file/${fileId}.${format}`;

      debug('convertWithMicroservice get file method/url', method, url);
      const response = await fetch(url, {
        method: method,
        headers: {
          "x-api-key": IfcHelper.IFC_SERVICE_API_KEY || ''
        }
      });
      const formatBuffer = await response.buffer();
      fs.writeFileSync(`ignored/${fileId}.${format}`, formatBuffer);
      (returnedValue as any)[format + 'Path'] = `ignored/${fileId}.${format}`;
    }

    debug('convertWithMicroservice returnedValue', returnedValue)

    return returnedValue;
  }

  private static async waitForOperationCompletion(operation: {id: string}): Promise<{formats: {[key: string]: string}}> {
    const method = 'GET';
    const url = `${IfcHelper.IFC_SERVICE_HOST}/ifc-convert/${operation.id}?wait=1`;

    debug('waitForOperationCompletion method/url', method, url);
    const response = await fetch(url, {
      method: method,
      headers: {
        "x-api-key": IfcHelper.IFC_SERVICE_API_KEY || ''
      }
    });
    const returnedOperation = await response.json();
    debug('waitForOperationCompletion operation response', JSON.stringify(returnedOperation));
    if (returnedOperation.status === 'succeeded') {
      return returnedOperation;
    } else if (returnedOperation.status === 'queued' || returnedOperation.status === 'started') {
      return IfcHelper.waitForOperationCompletion(operation);
    } else if (returnedOperation.status === 'canceled') {
      throw new Error('Operation canceled');
    } else if (returnedOperation.status === 'errored') {
      throw new Error(returnedOperation.error || 'Unknown operation error');
    }
    throw new Error('Unknown error');
  }

  // @deprectated, use convertWithMicroservice instead
  public static convert2obj(filepath: string): Promise<ObjFileResponse> {
    const match = filepath.match(/\/?([^\/]*)$/);
    if (match === null || match.length < 2) throw new Error('Invalid filepath');
    const filename = match[1];
    if (filename.indexOf('.') !== -1) throw new Error('Invalid filename, must not contain extension');
    const src = `ignored/${filename}.ifc`;
    const dest = `ignored/${filename}.obj`;
    const mtlDest = `ignored/${filename}.mtl`;

    return new Promise<void>((resolve, reject) => {
      mv(filepath, src, (error) => {
        if (error) return reject(error);
        resolve();
      });
    }).then(() => {
      return ifcConvert(src, dest, {args: ['--use-element-guids', '--site-local-placement']});
    }).then(() => {
      try {
        fs.accessSync(src, fs.constants.R_OK);
      } catch (error) {
        debug('Obj file not found');
        throw error;
      }
      try {
        fs.accessSync(mtlDest, fs.constants.R_OK);
      } catch (error) {
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

  // it is @deprectated to call this method
  // with an IFC file. The conversion must be done with
  // IfcHelper.convertWithMicroservice and the json filepath
  // must be passed on to parseIfcMetadata
  public static async parseIfcMetadata(filepath: string, site: ThreeSiteModel, importId: string): Promise<void> {
    let jsonstring: string = '';
    if (filepath.includes('.json')) {
      jsonstring = fs.readFileSync(filepath, {encoding: 'utf-8'});
    } else {
      let destinationpath = '';
      const options = {
        stdout: '', // ifc2json will store in this property the result of stdout
        stderr: '' // ifc2json will store in this property the result of stderr
      };
      try {
        destinationpath = await ifc2json(filepath, options);
      } catch (error) {
        console.log('IFC2JSON');
        console.log('stdout', options.stdout);
        console.log('stderr', options.stderr);
        throw error;
      }
      console.log('ifc2json stdout:', options.stdout);
      jsonstring = fs.readFileSync(destinationpath, {encoding: 'utf-8'});
    }

    debug('jsonstring 0...200', jsonstring.substr(0, 200));
    
    let json: Array<UserDataFromIfc>
    try {
      json = JSON.parse(jsonstring);
    } catch (error) {
      throw new Error('Invalid JSON');
    }

    const ifc2objectId: {
      [key: string]: ObjectId;
    } = {};

    for (let data of json) {
      if (data.userData && data.userData.type === 'IfcProject') {
        // ignore
        continue;
      }
      if (data.userData && data.userData.type === 'IfcSite') {
        site.ifcSiteId = data.id;
        ifc2objectId[site.ifcSiteId] = site._id;
        if (data.userData && data.userData.location) {
          const locationValues = data.userData.location.split(',').map((v: string) => parseFloat(v));
          site.location = locationValues;
        }
        if (data.userData && data.userData.refDirection) {
          const refDirectionValues = data.userData.refDirection.split(',').map((v: string) => parseFloat(v)); 
          site.refDirection = refDirectionValues;
        }
        if (data.userData && data.userData.axis) {
          const axisValues = data.userData.axis.split(',').map((v: string) => parseFloat(v));
          site.axis = axisValues;
        }
        IfcHelper.psetInMetadata(data.userData, site);
        await site.update(['ifcSiteId', 'metadata', 'location', 'refDirection', 'axis']);
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
        const existingBuilding = await ThreeBuildingModel.getOneWithQuery({ifcBuildingId: data.id, siteId: site._id});
        const building = existingBuilding ? existingBuilding : new ThreeBuildingModel;
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
          const locationValues = data.userData.location.split(',').map((v: string) => parseFloat(v));
          building.location = locationValues;
        }
        if (data.userData && data.userData.refDirection) {
          const refDirectionValues = data.userData.refDirection.split(',').map((v: string) => parseFloat(v)); 
          building.refDirection = refDirectionValues;
        }
        if (data.userData && data.userData.axis) {
          const axisValues = data.userData.axis.split(',').map((v: string) => parseFloat(v));
          building.axis = axisValues;
        }
        IfcHelper.psetInMetadata(data.userData, building);
        if (existingBuilding) {
          await building.update(['name', 'ifcBuildingId', 'importId', 'userData', 'metadata', 'location', 'refDirection', 'axis']);
          ifc2objectId[data.id] = building._id;
        } else {
          const newBuilding = await building.insert();
          ifc2objectId[data.id] = newBuilding._id;
        }
        continue;
      }
      if (data.userData && data.userData.type === 'IfcBuildingStorey') {
        const existingStorey = await ThreeStoreyModel.getOneWithQuery({ifcStoreyId: data.id, siteId: site._id});
        const storey = existingStorey ? existingStorey : new ThreeStoreyModel;
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
          const locationValues = data.userData.location.split(',').map((v: string) => parseFloat(v));
          storey.location = locationValues;
        }
        if (data.userData && data.userData.refDirection) {
          const refDirectionValues = data.userData.refDirection.split(',').map((v: string) => parseFloat(v)); 
          storey.refDirection = refDirectionValues;
        }
        if (data.userData && data.userData.axis) {
          const axisValues = data.userData.axis.split(',').map((v: string) => parseFloat(v));
          storey.axis = axisValues;
        }
        IfcHelper.psetInMetadata(data.userData, storey);
        if (existingStorey) {
          await storey.update(['name', 'ifcBuildingId', 'buildingId', 'importId', 'userData', 'metadata', 'location', 'refDirection', 'axis']);
          ifc2objectId[data.id] = storey._id;
        } else {
          const newStorey = await storey.insert();
          ifc2objectId[data.id] = newStorey._id;
        }
        continue;
      }
      if (data.userData && data.userData.type === 'IfcSpace') {
        const existingSpace = await ThreeSpaceModel.getOneWithQuery({ifcSpaceId: data.id, siteId: site._id});
        const space = existingSpace ? existingSpace : new ThreeSpaceModel;
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
            (data.boundary.geometry as any).type = 'Polygon';
          }
          if (data.boundary.properties && data.boundary.properties.location) {
            const locationValues = data.boundary.properties.location.split(',').map((v: string) => parseFloat(v));
            space.location = locationValues;
          }
          if (data.boundary.properties && data.boundary.properties.refDirection) {
            const refDirectionValues = data.boundary.properties.refDirection.split(',').map((v: string) => parseFloat(v)); 
            space.refDirection = refDirectionValues;
          }
          if (data.boundary.properties && data.boundary.properties.axis) {
            const axisValues = data.boundary.properties.axis.split(',').map((v: string) => parseFloat(v));
            space.axis = axisValues;
          }

          if (space.location && data.boundary.properties) {
            const locationValues = space.location;
            const refDirectionValues = data.boundary.properties.refDirection
              ? data.boundary.properties.refDirection.split(',').map((v: string) => parseFloat(v))
              : [1, 0, 0];
            const axisValues = data.boundary.properties.axis
              ? data.boundary.properties.axis.split(',').map((v: string) => parseFloat(v))
              : [0, 0, 1];
            const location: THREE.Vector3 = new THREE.Vector3(locationValues[0], locationValues[1], locationValues[2]);
            const refDirection: THREE.Vector3 = new THREE.Vector3(refDirectionValues[0], refDirectionValues[1], refDirectionValues[2]); // vect1
            const axis: THREE.Vector3 = new THREE.Vector3(axisValues[0], axisValues[1], axisValues[2]);  // vect3

            const vect1 = refDirection;
            const vect3 = axis;

            const vect2 = axis.cross(refDirection);
            const matrix = new THREE.Matrix4().set(
              vect1.x, vect2.x, vect3.x, location.x,
              vect1.y, vect2.y, vect3.y, location.y,
              vect1.z, vect2.z, vect3.z, location.z,
              0, 0, 0, 1
            );
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
          await space.update(['name', 'ifcBuildingId', 'buildingId', 'storeyIds', 'importId', 'userData', 'metadata', 'location', 'refDirection', 'boundary', 'axis']);
          ifc2objectId[data.id] = space._id;
        } else {
          const newSpace = await space.insert();
          ifc2objectId[data.id] = newSpace._id;
        }
        continue;
      }
      await IfcHelper.applyUserDataFromIfc(data, importId, ifc2objectId);
    }
  }

  private static psetInMetadata(userData: {pset: {[key: string]: any}}, object: {metadata: Array<Metadata>}) {
    if (!Array.isArray(object.metadata)) {
      object.metadata = [];
    }
    const currentKeys: Array<string> = Object.keys(object.metadata);
    for (let key in userData.pset || {}) {
      const index = currentKeys.indexOf(key);
      if (index !== -1) {
        object.metadata[index].value = userData.pset[key];
      } else {
        object.metadata.push({key: key, value: userData.pset[key]});
      }
    }
  }

  private static applyUserDataFromIfc(data: UserDataFromIfc, importId: string, ifc2objectId: {[key: string]: ObjectId }, keepOriginalUserData: boolean = true): Promise<any> {
    return ThreeObjectModel.getOneWithQuery({name: data.id, importId: importId}).then((object) => {
      if (!object) return;
      object.name = data.userData.name || object.name;
      if (keepOriginalUserData) {
        object.userData = Object.assign(object.userData, data.userData);
      } else {
        object.userData = data.userData;
      }
      object.userData.ifcId = data.id;
      if (object.userData.buildingId && ifc2objectId[object.userData.buildingId]) {
        object.buildingId = ifc2objectId[object.userData.buildingId];
      }
      if (Array.isArray(object.userData.buildingStorey)) {
        const storeys: Array<ObjectId> = [];
        for (let storey of object.userData.buildingStorey) {
          if (ifc2objectId[storey]) {
            storeys.push(ifc2objectId[storey]);
          }
        }
        object.storeys = storeys;
      } else {
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