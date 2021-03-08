"use strict";
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
exports.ThreeCoreControllerMiddleware = void 0;
const three_delete_site_actions_1 = require("./actions/three.delete-site.actions");
const object_model_1 = require("./../models/object.model");
const space_model_1 = require("./../models/space.model");
const storey_model_1 = require("./../models/storey.model");
const building_model_1 = require("./../models/building.model");
const helpers_1 = require("./../helpers");
const site_model_1 = require("./../models/site.model");
const deco_api_1 = require("deco-api");
const object_resolve_path_1 = __importDefault(require("object-resolve-path"));
const three_report_action_1 = require("./actions/three.report.action");
const three_send_report_action_1 = require("./actions/three.send-report.action");
let debug = require('debug')('app:models:three:controller:core');
class ThreeCoreControllerMiddleware extends deco_api_1.ControllerMiddleware {
    extendGetAllQuery(query, req, res) {
        let appId = res.locals.app._id;
        let readQuery = { appId: appId };
        query.addQuery(readQuery);
        return super.extendGetAllQuery(query, req, res).then(() => {
        });
    }
    importJSON(req, res, next) {
        if (!res.locals.element)
            return next(new Error('Import JSON requires to first fetch a site in res.locals.element'));
        let rightInstance = res.locals.element instanceof site_model_1.ThreeSiteModel;
        if (!rightInstance)
            return next(new Error('res.locals.element is not a ThreeSiteModel instance'));
        if (!res.locals.app)
            return next(new Error('Missing res.locals.app'));
        let json;
        if (req.body.json) {
            json = req.body.json;
        }
        else if (req.file && req.file.buffer) {
            let buffer = req.file.buffer;
            let mystring = buffer.toString();
            buffer = undefined;
            try {
                json = JSON.parse(mystring);
                mystring = undefined;
            }
            catch (e) {
                return next(new Error('Invalid JSON'));
            }
        }
        if (!json.metadata)
            return next(new Error('Missing metadata in json, are you sure you upload the right JSON format?'));
        if (!json.metadata.version || parseFloat(json.metadata.version) !== 4.5)
            return next(new Error('Invalid or not supported version. We currently support version 4.5'));
        let importId = typeof req.query.importId === 'string' ? req.query.importId : undefined;
        let importer = new helpers_1.ThreeImporterHelper();
        let saveLights = req.query.saveLights ? true : false;
        importer.start(res.locals.element, json, { importId: importId, saveLights: saveLights }).then((response) => {
            res.send(response);
        }).catch((error) => {
            console.error(error);
            next(error);
        });
    }
    importIFC(req, res, next) {
        if (!res.locals.element)
            return next(new Error('Import IFC requires to first fetch a site in res.locals.element'));
        let rightInstance = res.locals.element instanceof site_model_1.ThreeSiteModel;
        if (!rightInstance)
            return next(new Error('res.locals.element is not a ThreeSiteModel instance'));
        if (!res.locals.app)
            return next(new Error('Missing res.locals.app'));
        const site = res.locals.element;
        let _ifcPath;
        const importer = new helpers_1.ThreeImporterHelper();
        if (req.file && req.file.path) {
            next(); // pass to the next middleware => will send the currentOperation back to client
            helpers_1.IfcHelper.convert2obj(req.file.path).then(({ ifcPath, objPath, mtlPath }) => {
                _ifcPath = ifcPath;
                return importer.loadMTL(mtlPath).then(() => {
                    return importer.loadOBJ(objPath);
                }).then((obj) => {
                    return importer.rotate90X(obj);
                });
            }).catch((error) => {
                console.error(error);
                if (error && error.message)
                    throw error;
                else
                    throw new Error('Unexpected error while converting ifc to obj');
            }).then((result) => {
                if (!result)
                    throw new Error('No result when converting and loading IFC in obj/mtl');
                if (typeof result !== 'boolean' && result.type) {
                    let json = result.toJSON();
                    let importId = typeof req.query.importId === 'string' ? req.query.importId : undefined;
                    let saveLights = req.query.saveLights ? true : false;
                    return importer.start(site, json, { importId: importId, saveLights: saveLights });
                }
                else {
                    debug('Unexpected result');
                    debug('result', result);
                    throw new Error('Unexpected result from ifcConvert');
                }
            }).then(() => {
                // now we can add the metadata from the IFC
                return helpers_1.IfcHelper.parseIfcMetadata(_ifcPath, site, importer.importId);
            }).then(() => {
                deco_api_1.Operation.completeCurrentOperation(res, 'completed', 'Successfully imported').catch((error) => {
                    debug('Error while setting the operation completed');
                    debug(' - Error: ', error.message);
                });
                if (req.query.reportId && req.query.email) {
                    deco_api_1.ActionsService.runActions(res, [[
                            three_report_action_1.ThreeReportAction,
                            three_send_report_action_1.ThreeSendReportAction,
                            three_delete_site_actions_1.ThreeDeleteSiteAction
                        ]], { siteId: site._id, reportId: req.query.reportId, ifcFilename: req.file.originalname, email: req.query.email });
                }
            }).catch((error) => {
                deco_api_1.Operation.completeCurrentOperation(res, 'errored', error.message).catch((error) => {
                    debug('Error while setting the operation completed');
                    debug(' - Error: ', error.message);
                });
            });
        }
        else {
            return next(new Error('IFC file not found'));
        }
    }
    deleteData(req, res, next) {
        if (!res.locals.element)
            return next(new Error('Import JSON requires to first fetch a site in res.locals.element'));
        let rightInstance = res.locals.element instanceof site_model_1.ThreeSiteModel;
        if (!rightInstance)
            return next(new Error('res.locals.element is not a ThreeSiteModel instance'));
        if (!res.locals.app)
            return next(new Error('Missing res.locals.app'));
        let modelNames = req.body.models;
        if (!Array.isArray(modelNames) || !modelNames.length)
            return next(new Error('Invalid models'));
        let importer = new helpers_1.ThreeImporterHelper();
        importer.removeData(res.locals.element._id, modelNames).then((response) => {
            res.send(response);
        }).catch((error) => {
            console.error(error);
            next(error);
        });
    }
    clearImport(req, res, next) {
        if (!res.locals.element)
            return next(new Error('Import JSON requires to first fetch a site in res.locals.element'));
        let rightInstance = res.locals.element instanceof site_model_1.ThreeSiteModel;
        if (!rightInstance)
            return next(new Error('res.locals.element is not a ThreeSiteModel instance'));
        if (!res.locals.app)
            return next(new Error('Missing res.locals.app'));
        let importId = req.params.importId;
        let importer = new helpers_1.ThreeImporterHelper();
        importer.removeImport(res.locals.element._id, importId).then((response) => {
            res.send(response);
        }).catch((error) => {
            console.error(error);
            next(error);
        });
    }
    fetchBuildingsInfos() {
        return (req, res, next) => {
            if (res.locals.fileSent) {
                return; // ignore this part if the request was about downloading a file
            }
            const site = res.locals.element;
            const rightInstance = site instanceof site_model_1.ThreeSiteModel;
            if (!rightInstance) {
                return next(new Error('Invalid site instance in res.locals.element'));
            }
            new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const buildings = yield building_model_1.ThreeBuildingModel.getAll(new deco_api_1.Query({ siteId: site._id }));
                    const storeys = yield storey_model_1.ThreeStoreyModel.getAll(new deco_api_1.Query({ siteId: site._id, buildingId: { $in: buildings.map(i => i._id) } }));
                    const spaces = yield space_model_1.ThreeSpaceModel.getAll(new deco_api_1.Query({ siteId: site._id, buildingId: { $in: buildings.map(i => i._id) } }));
                    const output = yield site.output();
                    const buildingsOutput = yield building_model_1.ThreeBuildingModel.outputList(buildings);
                    const storeysOutput = yield storey_model_1.ThreeStoreyModel.outputList(storeys);
                    const spacesOutput = yield space_model_1.ThreeSpaceModel.outputList(spaces);
                    output.buildings = buildingsOutput;
                    output.storeys = storeysOutput;
                    output.spaces = spacesOutput;
                    resolve(output);
                }
                catch (error) {
                    reject(error);
                }
            })).then((output) => {
                res.send(output);
            }).catch(next);
        };
    }
    fetchKeyValues() {
        return (req, res, next) => {
            const site = res.locals.element;
            const rightInstance = site instanceof site_model_1.ThreeSiteModel;
            if (!rightInstance) {
                return next(new Error('Invalid site instance in res.locals.element'));
            }
            new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const objects = yield object_model_1.ThreeObjectModel.getAll(new deco_api_1.Query({ siteId: site._id }));
                    const buildings = yield building_model_1.ThreeBuildingModel.getAll(new deco_api_1.Query({ siteId: site._id }));
                    const storeys = yield storey_model_1.ThreeStoreyModel.getAll(new deco_api_1.Query({ siteId: site._id, buildingId: { $in: buildings.map(i => i._id) } }));
                    const spaces = yield space_model_1.ThreeSpaceModel.getAll(new deco_api_1.Query({ siteId: site._id, buildingId: { $in: buildings.map(i => i._id) } }));
                    const allObjects = objects.concat(...buildings).concat(...storeys).concat(...spaces);
                    const preparePathKey = (key) => {
                        const parts = key.split('.');
                        for (let i = 0; i < parts.length; i++) {
                            if (i === 0) {
                                continue;
                            }
                            parts[i] = `["${parts[i]}"]`;
                        }
                        return parts.join('');
                    };
                    let keyValues = {};
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
                            }
                            else if (typeof value === 'object') {
                                ///////
                                const level2Keys = Object.keys(value);
                                const level2Paths = level2Keys.map(k => `${objKey}.${k}`);
                                for (let level2Path of level2Paths) {
                                    if (!extractPaths.includes(level2Path) && !extractPaths.includes(`${objKey}.*`)) {
                                        continue;
                                    }
                                    const valueLevel2 = object_resolve_path_1.default(obj, preparePathKey(level2Path));
                                    if (typeof valueLevel2 === 'string' || typeof valueLevel2 === 'number' || typeof valueLevel2 === 'boolean') {
                                        if (!keyValues[level2Path]) {
                                            keyValues[level2Path] = [];
                                        }
                                        if (!keyValues[level2Path].includes(valueLevel2)) {
                                            keyValues[level2Path].push(valueLevel2);
                                        }
                                    }
                                    else if (typeof valueLevel2 === 'object') {
                                        //////
                                        const level3Keys = Object.keys(valueLevel2);
                                        const level3Paths = level3Keys.map(k => `${level2Path}.${k}`);
                                        for (let level3Path of level3Paths) {
                                            const valueLevel3 = object_resolve_path_1.default(obj, preparePathKey(level3Path));
                                            if (typeof valueLevel3 === 'string' || typeof valueLevel3 === 'number' || typeof valueLevel3 === 'boolean') {
                                                if (!keyValues[level3Path]) {
                                                    keyValues[level3Path] = [];
                                                }
                                                if (!keyValues[level3Path].includes(valueLevel3)) {
                                                    keyValues[level3Path].push(valueLevel3);
                                                }
                                            }
                                            else if (typeof valueLevel3 === 'object') {
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
                }
                catch (error) {
                    reject(error);
                }
            })).then((output) => {
                res.send(output);
            }).catch(next);
        };
    }
}
exports.ThreeCoreControllerMiddleware = ThreeCoreControllerMiddleware;
//# sourceMappingURL=three.core.controller.js.map