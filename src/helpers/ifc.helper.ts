import { ThreeSpaceModel } from './../models/space.model';
import { ThreeStoreyModel } from './../models/storey.model';
import { ThreeBuildingModel } from './../models/building.model';
import { ThreeSiteModel } from './../models/site.model';
import { ThreeObjectModel } from './../models/object.model';
import fs from 'fs';
import mv from 'mv';
import ifcConvert from 'ifc-convert';
import { ifc2json } from 'ifc2json-wrapper';
import { ObjectId, Metadata, Query } from 'deco-api'; 
import * as THREE from 'three';

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

export class IfcHelper {
  public static convert2obj(filepath: string): Promise<ObjFileResponse> {
    const match = filepath.match(/\/?([^\/]*)$/);
    if (match === null || match.length < 2) throw new Error('Invalid filepath');
    const filename = match[1];
    if (filename.indexOf('.') !== -1) throw new Error('Invalid filename, must not contain extension');
    const src = `ignored/${filename}.ifc`;
    const dest = `ignored/${filename}.obj`;
    const mtlDest = `ignored/${filename}.mtl`;

    return new Promise((resolve, reject) => {
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

  public static parseIfcMetadata(filepath: string, site: ThreeSiteModel, importId: string) {
    return ifc2json(filepath).then(async (destinationpath: string) => {
      const jsonstring = fs.readFileSync(destinationpath, {encoding: 'utf-8'});
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
          building.name = data.userData.name || '';
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
          storey.name = data.userData.name || '';
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
          space.name = data.userData.name || '';
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
    });
  }

  private static psetInMetadata(userData: {pset: {[key: string]: any}}, object: {metadata: Array<Metadata>}) {
    if (!Array.isArray(object.metadata)) {
      object.metadata = [];
    }
    const currentKeys: Array<string> = Object.keys(object.metadata);
    for (let key in userData.pset || {}) {
      const index = currentKeys.indexOf(key);
      if (index !== -1) {
        object.metadata[index].value = userData.pset[key];
      } else {
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
      } else {
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