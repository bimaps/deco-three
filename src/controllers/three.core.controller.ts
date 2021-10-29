import { ThreeDeleteSiteAction } from './actions/three.delete-site.actions';
import { ThreeObjectModel } from './../models/object.model';
import { ThreeSpaceModel } from './../models/space.model';
import { ThreeStoreyModel } from './../models/storey.model';
import { ThreeBuildingModel } from './../models/building.model';
import { IfcHelper, ThreeImporterHelper, ThreeJsonData } from './../helpers';
import { ThreeSiteModel } from './../models/site.model';
import { Request, Response, NextFunction } from 'express';
import { PolicyController, Query, Operation, ActionsService } from '@bim/deco-api';
import resolvePath from 'object-resolve-path';
import { ThreeReportAction } from './actions/three.report.action';
import { ThreeSendReportAction } from './actions/three.send-report.action';
let debug = require('debug')('app:models:three:controller:core');

export class ThreeCoreControllerMiddleware extends PolicyController {
  public extendGetAllQuery(query: Query, req: Request, res: Response): Promise<void> {
    let appId = res.locals.app._id;
    let readQuery: any = { appId: appId };
    query.addQuery(readQuery);

    return super.extendGetAllQuery(query, req, res, {}).then(() => {});
  }

  public importJSON(req: Request, res: Response, next: NextFunction) {
    if (!res.locals.element) return next(new Error('Import JSON requires to first fetch a site in res.locals.element'));
    let rightInstance = res.locals.element instanceof ThreeSiteModel;
    if (!rightInstance) return next(new Error('res.locals.element is not a ThreeSiteModel instance'));
    if (!res.locals.app) return next(new Error('Missing res.locals.app'));

    let json: any;
    if (req.body.json) {
      json = req.body.json;
    } else if (req.file && req.file.buffer) {
      let buffer: Buffer | undefined = req.file.buffer;
      let mystring: string | undefined = buffer.toString();
      buffer = undefined;
      try {
        json = JSON.parse(mystring);
        mystring = undefined;
      } catch (e) {
        return next(new Error('Invalid JSON'));
      }
    }

    if (!json.metadata) return next(new Error('Missing metadata in json, are you sure you upload the right JSON format?'));
    if (!json.metadata.version || parseFloat(json.metadata.version) !== 4.5)
      return next(new Error('Invalid or not supported version. We currently support version 4.5'));

    let importId: string | undefined = typeof req.query.importId === 'string' ? req.query.importId : undefined;

    let importer = new ThreeImporterHelper();
    let saveLights = req.query.saveLights ? true : false;
    importer
      .start(res.locals.element, json, { importId: importId, saveLights: saveLights })
      .then((response) => {
        res.send(response);
      })
      .catch((error) => {
        console.error(error);
        next(error);
      });
  }

  public importIFC(req: Request, res: Response, next: NextFunction) {
    if (!res.locals.element) return next(new Error('Import IFC requires to first fetch a site in res.locals.element'));
    let rightInstance = res.locals.element instanceof ThreeSiteModel;
    if (!rightInstance) return next(new Error('res.locals.element is not a ThreeSiteModel instance'));
    if (!res.locals.app) return next(new Error('Missing res.locals.app'));

    const site: ThreeSiteModel = res.locals.element;

    let _ifcPath: string;
    const importer = new ThreeImporterHelper();

    if (req.file && req.file.path) {
      next(); // pass to the next middleware => will send the currentOperation back to client
      IfcHelper.convert2obj(req.file.path)
        .then(({ ifcPath, objPath, mtlPath }) => {
          _ifcPath = ifcPath;
          return importer
            .loadMTL(mtlPath)
            .then(() => {
              return importer.loadOBJ(objPath);
            })
            .then((obj) => {
              return importer.rotate90X(obj);
            });
        })
        .catch((error) => {
          console.error(error);
          if (error && error.message) throw error;
          else throw new Error('Unexpected error while converting ifc to obj');
        })
        .then((result) => {
          if (!result) throw new Error('No result when converting and loading IFC in obj/mtl');
          if (typeof result !== 'boolean' && result.type) {
            let json: ThreeJsonData = result.toJSON();
            let importId: string | undefined = typeof req.query.importId === 'string' ? req.query.importId : undefined;
            let saveLights = req.query.saveLights ? true : false;
            return importer.start(site, json, { importId: importId, saveLights: saveLights });
          } else {
            debug('Unexpected result');
            debug('result', result);
            throw new Error('Unexpected result from ifcConvert');
          }
        })
        .then(() => {
          // now we can add the metadata from the IFC
          return IfcHelper.parseIfcMetadata(_ifcPath, site, importer.importId);
        })
        .then(() => {
          Operation.completeCurrentOperation(res, 'completed', 'Successfully imported').catch((error) => {
            debug('Error while setting the operation completed');
            debug(' - Error: ', error.message);
          });
          if (req.query.reportId && req.query.email) {
            ActionsService.runActions(res, [[ThreeReportAction, ThreeSendReportAction, ThreeDeleteSiteAction]], {
              siteId: site._id,
              reportId: req.query.reportId,
              ifcFilename: req.file.originalname,
              email: req.query.email,
            });
          }
        })
        .catch((error) => {
          Operation.completeCurrentOperation(res, 'errored', error.message).catch((error) => {
            debug('Error while setting the operation completed');
            debug(' - Error: ', error.message);
          });
        });
    } else {
      return next(new Error('IFC file not found'));
    }
  }

  public importIFCWithMicroService(req: Request, res: Response, next: NextFunction) {
    if (!res.locals.element) return next(new Error('Import IFC requires to first fetch a site in res.locals.element'));
    let rightInstance = res.locals.element instanceof ThreeSiteModel;
    if (!rightInstance) return next(new Error('res.locals.element is not a ThreeSiteModel instance'));
    if (!res.locals.app) return next(new Error('Missing res.locals.app'));

    const site: ThreeSiteModel = res.locals.element;

    let _ifcPath: string;
    let _jsonPath: string | undefined;
    const importer = new ThreeImporterHelper();

    if (req.file && req.file.path) {
      next(); // pass to the next middleware => will send the currentOperation back to client

      IfcHelper.convertWithMicroservice(req.file.path, ['obj', 'json'])
        .then(({ ifcPath, objPath, mtlPath, jsonPath }) => {
          _ifcPath = ifcPath;
          _jsonPath = jsonPath;
          return importer
            .loadMTL(mtlPath as string)
            .then(() => {
              return importer.loadOBJ(objPath as string);
            })
            .then((obj) => {
              return importer.rotate90X(obj);
            });
        })
        .catch((error) => {
          console.error(error);
          if (error && error.message) throw error;
          else throw new Error('Unexpected error while converting ifc to obj');
        })
        .then((result) => {
          if (!result) throw new Error('No result when converting and loading IFC in obj/mtl');
          if (typeof result !== 'boolean' && result.type) {
            let json: ThreeJsonData = result.toJSON();
            let importId: string | undefined = typeof req.query.importId === 'string' ? req.query.importId : undefined;
            let saveLights = req.query.saveLights ? true : false;
            return importer.start(site, json, { importId: importId, saveLights: saveLights });
          } else {
            debug('Unexpected result');
            debug('result', result);
            throw new Error('Unexpected result from ifcConvert');
          }
        })
        .then(() => {
          // now we can add the metadata from the IFC
          return IfcHelper.parseIfcMetadata(_jsonPath as string, site, importer.importId);
        })
        .then(() => {
          Operation.completeCurrentOperation(res, 'completed', 'Successfully imported').catch((error) => {
            debug('Error while setting the operation completed');
            debug(' - Error: ', error.message);
          });
          if (req.query.reportId && req.query.email) {
            ActionsService.runActions(res, [[ThreeReportAction, ThreeSendReportAction, ThreeDeleteSiteAction]], {
              siteId: site._id,
              reportId: req.query.reportId,
              ifcFilename: req.file.originalname,
              email: req.query.email,
            });
          }
        })
        .catch((error) => {
          Operation.completeCurrentOperation(res, 'errored', error.message).catch((error) => {
            debug('Error while setting the operation completed');
            debug(' - Error: ', error.message);
          });
        });
    } else {
      return next(new Error('IFC file not found'));
    }
  }

  public deleteData(req: Request, res: Response, next: NextFunction) {
    if (!res.locals.element) return next(new Error('Import JSON requires to first fetch a site in res.locals.element'));
    let rightInstance = res.locals.element instanceof ThreeSiteModel;
    if (!rightInstance) return next(new Error('res.locals.element is not a ThreeSiteModel instance'));
    if (!res.locals.app) return next(new Error('Missing res.locals.app'));

    let modelNames: Array<string> = req.body.models;
    if (!Array.isArray(modelNames) || !modelNames.length) return next(new Error('Invalid models'));

    let importer = new ThreeImporterHelper();
    importer
      .removeData(res.locals.element._id, modelNames)
      .then((response) => {
        res.send(response);
      })
      .catch((error) => {
        console.error(error);
        next(error);
      });
  }

  public clearImport(req: Request, res: Response, next: NextFunction) {
    if (!res.locals.element) return next(new Error('Import JSON requires to first fetch a site in res.locals.element'));
    let rightInstance = res.locals.element instanceof ThreeSiteModel;
    if (!rightInstance) return next(new Error('res.locals.element is not a ThreeSiteModel instance'));
    if (!res.locals.app) return next(new Error('Missing res.locals.app'));

    let importId = req.params.importId;

    let importer = new ThreeImporterHelper();
    importer
      .removeImport(res.locals.element._id, importId)
      .then((response) => {
        res.send(response);
      })
      .catch((error) => {
        console.error(error);
        next(error);
      });
  }

  public fetchBuildingsInfos() {
    return (req: Request, res: Response, next: NextFunction) => {
      if (res.locals.fileSent) {
        return; // ignore this part if the request was about downloading a file
      }
      const site = res.locals.element as ThreeSiteModel;
      const rightInstance = site instanceof ThreeSiteModel;
      if (!rightInstance) {
        return next(new Error('Invalid site instance in res.locals.element'));
      }
      new Promise(async (resolve, reject) => {
        try {
          const buildings = await ThreeBuildingModel.getAll(new Query({ siteId: site._id }));
          const storeys = await ThreeStoreyModel.getAll(new Query({ siteId: site._id, buildingId: { $in: buildings.map((i) => i._id) } }));
          const spaces = await ThreeSpaceModel.getAll(new Query({ siteId: site._id, buildingId: { $in: buildings.map((i) => i._id) } }));
          const output = await site.output();
          const buildingsOutput = await ThreeBuildingModel.outputList(buildings);
          const storeysOutput = await ThreeStoreyModel.outputList(storeys);
          const spacesOutput = await ThreeSpaceModel.outputList(spaces);
          output.buildings = buildingsOutput;
          output.storeys = storeysOutput;
          output.spaces = spacesOutput;
          resolve(output);
        } catch (error) {
          reject(error);
        }
      })
        .then((output) => {
          res.send(output);
        })
        .catch(next);
    };
  }

  public fetchKeyValues() {
    return (req: Request, res: Response, next: NextFunction) => {
      const site = res.locals.element as ThreeSiteModel;
      const rightInstance = site instanceof ThreeSiteModel;
      if (!rightInstance) {
        return next(new Error('Invalid site instance in res.locals.element'));
      }
      new Promise(async (resolve, reject) => {
        try {
          const objects = await ThreeObjectModel.getAll(new Query({ siteId: site._id }));
          const buildings = await ThreeBuildingModel.getAll(new Query({ siteId: site._id }));
          const storeys = await ThreeStoreyModel.getAll(new Query({ siteId: site._id, buildingId: { $in: buildings.map((i) => i._id) } }));
          const spaces = await ThreeSpaceModel.getAll(new Query({ siteId: site._id, buildingId: { $in: buildings.map((i) => i._id) } }));

          const allObjects: Array<any> = (objects as Array<any>)
            .concat(...buildings)
            .concat(...storeys)
            .concat(...spaces);

          const preparePathKey = (key: string) => {
            const parts = key.split('.');
            for (let i = 0; i < parts.length; i++) {
              if (i === 0) {
                continue;
              }
              parts[i] = `["${parts[i]}"]`;
            }
            return parts.join('');
          };

          let keyValues: { [key: string]: Array<any> } = {};
          const extractPaths = ['type', 'uuid', 'name', 'userData', 'userData.*'];

          for (let obj of allObjects) {
            const objKeys = Object.keys(obj);
            for (let objKey of objKeys) {
              if (!extractPaths.includes(objKey)) {
                continue;
              }
              const value = obj[objKey];
              if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
                if (!keyValues[objKey]) {
                  keyValues[objKey] = [];
                }
                if (!keyValues[objKey].includes(value)) {
                  keyValues[objKey].push(value);
                }
              } else if (typeof value === 'object') {
                ///////
                const level2Keys = Object.keys(value);
                const level2Paths = level2Keys.map((k) => `${objKey}.${k}`);

                for (let level2Path of level2Paths) {
                  if (!extractPaths.includes(level2Path) && !extractPaths.includes(`${objKey}.*`)) {
                    continue;
                  }
                  const valueLevel2 = resolvePath(obj, preparePathKey(level2Path));
                  if (typeof valueLevel2 === 'string' || typeof valueLevel2 === 'number' || typeof valueLevel2 === 'boolean') {
                    if (!keyValues[level2Path]) {
                      keyValues[level2Path] = [];
                    }
                    if (!keyValues[level2Path].includes(valueLevel2)) {
                      keyValues[level2Path].push(valueLevel2);
                    }
                  } else if (typeof valueLevel2 === 'object') {
                    //////
                    const level3Keys = Object.keys(valueLevel2);
                    const level3Paths = level3Keys.map((k) => `${level2Path}.${k}`);

                    for (let level3Path of level3Paths) {
                      const valueLevel3 = resolvePath(obj, preparePathKey(level3Path));
                      if (typeof valueLevel3 === 'string' || typeof valueLevel3 === 'number' || typeof valueLevel3 === 'boolean') {
                        if (!keyValues[level3Path]) {
                          keyValues[level3Path] = [];
                        }
                        if (!keyValues[level3Path].includes(valueLevel3)) {
                          keyValues[level3Path].push(valueLevel3);
                        }
                      } else if (typeof valueLevel3 === 'object') {
                        // we don't go to more than level 3 yet
                      }
                    }
                    //////
                  }
                }
                ///////
              }
            }
          }
          resolve(keyValues);
        } catch (error) {
          reject(error);
        }
      })
        .then((output) => {
          res.send(output);
        })
        .catch(next);
    };
  }
}
