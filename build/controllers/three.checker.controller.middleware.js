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
exports.ThreeCheckerControllerMiddleware = void 0;
const space_model_1 = require("./../models/space.model");
const deco_api_1 = require("deco-api");
const three_generator_1 = require("../helpers/three.generator");
const material_model_1 = require("./../models/material.model");
const object_model_1 = require("./../models/object.model");
const checker_config_model_1 = require("./../models/checker-config.model");
const checker_report_model_1 = require("./../models/checker-report.model");
const geometry_model_1 = require("./../models/geometry.model");
const site_model_1 = require("./../models/site.model");
const deco_api_2 = require("deco-api");
const THREE = __importStar(require("three"));
const object_resolve_path_1 = __importDefault(require("object-resolve-path"));
const moment_1 = __importDefault(require("moment"));
const math = __importStar(require("mathjs"));
let debug = require('debug')('app:models:three:controller:core');
class ThreeCheckerControllerMiddleware extends deco_api_2.ControllerMiddleware {
    static runReport(pdf = false) {
        return (req, res, next) => {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const scene = yield ThreeCheckerControllerMiddleware.prepareScene(req.params.siteId);
                    const report = yield checker_report_model_1.ThreeCheckerReportModel.getOneWithId(req.params.reportId);
                    if (!report) {
                        return reject(new Error('Report not found'));
                    }
                    const checkerResults = [];
                    // for (let checkerId of report.checkers) {
                    //   const result = await ThreeCheckerControllerMiddleware.runChecker(scene, checkerId);
                    //   checkerResults.push(result);
                    // }
                    const result = {
                        name: report.name,
                        description: report.description,
                        results: checkerResults
                    };
                    resolve(result);
                }
                catch (error) {
                    reject(error);
                }
            })).then((result) => __awaiter(this, void 0, void 0, function* () {
                if (pdf) {
                    const pdf = new deco_api_1.PDF();
                    yield pdf.create();
                    yield ThreeCheckerControllerMiddleware.printReportHead(pdf, result);
                    for (let res of result.results) {
                        yield ThreeCheckerControllerMiddleware.printChecker(pdf, res);
                    }
                    const file = yield pdf.document.save();
                    const fileName = result.name + '.pdf';
                    res.writeHead(200, {
                        'Content-Type': 'application/pdf',
                        'Content-Disposition': 'attachment; filename=' + fileName,
                        'Content-Length': file.length
                    });
                    res.end(Buffer.from(file));
                }
                else {
                    res.send(result);
                }
            })).catch((error) => {
                return next(error);
            });
        };
    }
    static run(pdf = false) {
        return (req, res, next) => {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                const scene = yield ThreeCheckerControllerMiddleware.prepareScene(req.params.siteId);
                const result = yield ThreeCheckerControllerMiddleware.runChecker(scene, req.params.configId);
                resolve(result);
            })).then((result) => __awaiter(this, void 0, void 0, function* () {
                if (pdf) {
                    const pdf = new deco_api_1.PDF();
                    yield pdf.create();
                    yield ThreeCheckerControllerMiddleware.printChecker(pdf, result);
                    const file = yield pdf.document.save();
                    const fileName = result.name + '.pdf';
                    res.writeHead(200, {
                        'Content-Type': 'application/pdf',
                        'Content-Disposition': 'attachment; filename=' + fileName,
                        'Content-Length': file.length
                    });
                    res.end(Buffer.from(file));
                }
                else {
                    res.send(result);
                }
            })).catch((error) => {
                return next(error);
            });
        };
    }
    static prepareScene(siteId) {
        return __awaiter(this, void 0, void 0, function* () {
            const site = yield site_model_1.ThreeSiteModel.getOneWithId(siteId);
            if (!site) {
                throw new Error('Site not found');
            }
            const objects = (yield object_model_1.ThreeObjectModel.getAll(new deco_api_2.Query({ siteId: site._id }))) || [];
            const matIds = objects.map(o => o.material);
            const materials = yield material_model_1.ThreeMaterialModel.getAll(new deco_api_2.Query({ uuid: { $in: matIds } }));
            const geoIds = objects.map(o => o.geometry);
            const geometries = yield geometry_model_1.ThreeGeometryModel.getAll(new deco_api_2.Query({ uuid: { $in: geoIds } }));
            const spaces = yield space_model_1.ThreeSpaceModel.getAll(new deco_api_2.Query({ siteId: site._id }));
            const sceneJson = {
                metadata: {
                    version: 4.5,
                    type: 'Object',
                    generator: 'swissdata'
                },
                geometries: geometries,
                materials: materials,
                object: {
                    children: objects,
                    layers: 1,
                    matrix: [
                        1,
                        0,
                        0,
                        0,
                        0,
                        1,
                        0,
                        0,
                        0,
                        0,
                        1,
                        0,
                        0,
                        0,
                        0,
                        1
                    ],
                    type: 'Scene'
                }
            };
            const loader = new THREE.ObjectLoader();
            const scene = yield new Promise((resolve2, reject2) => {
                loader.parse(sceneJson, (object) => {
                    resolve2(object);
                });
            });
            const generator = new three_generator_1.ThreeGenerator();
            const spaceMaterial = new THREE.MeshBasicMaterial();
            for (const space of spaces) {
                const mesh = generator.space2mesh(space, spaceMaterial);
                if (mesh) {
                    scene.add(mesh);
                }
            }
            return scene;
        });
    }
    static runChecker(scene, checkerId) {
        return __awaiter(this, void 0, void 0, function* () {
            const config = yield checker_config_model_1.ThreeCheckerConfigModel.getOneWithId(checkerId);
            if (!config) {
                throw new Error('Checker config not found');
            }
            const objectsSet = [];
            scene.traverse((obj) => {
                for (let condition of config.conditions) {
                    if (!ThreeCheckerControllerMiddleware.compare(obj, condition)) {
                        return;
                    }
                }
                objectsSet.push(obj);
            });
            const result = {
                name: config.name,
                description: config.description,
                conditions: config.conditions,
                operation: config.operation,
                operationSettings: config.operationSettings,
                set: objectsSet.map(o => { return { name: o.userData.name, ifcId: o.userData.ifcId }; })
            };
            if (config.operation === 'count') {
                result.value = objectsSet.length;
            }
            else if (config.operation === 'add-key-value') {
                let value = 0;
                let nbObjectsWithValue = 0;
                for (let index = 0; index < objectsSet.length; index++) {
                    const obj = objectsSet[index];
                    const key = ThreeCheckerControllerMiddleware.preparePathKey(config.operationSettings.key);
                    const objValue = object_resolve_path_1.default(obj, key);
                    if (objValue !== undefined) {
                        nbObjectsWithValue++;
                        result.set[index].value = parseFloat(objValue);
                        value += parseFloat(objValue);
                    }
                }
                result.nbObjectsWithValue = nbObjectsWithValue;
                result.value = value;
            }
            else if (config.operation === 'compare-key-value') {
                let nbValid = 0;
                let nbInvalid = 0;
                for (let index = 0; index < objectsSet.length; index++) {
                    const obj = objectsSet[index];
                    const key = ThreeCheckerControllerMiddleware.preparePathKey(config.operationSettings.key);
                    const objValue = object_resolve_path_1.default(obj, key);
                    result.set[index].testValue = objValue;
                    result.set[index].isValid = ThreeCheckerControllerMiddleware.compare(obj, config.operationSettings);
                    if (result.set[index].isValid) {
                        nbValid++;
                    }
                    else {
                        nbInvalid++;
                    }
                }
                result.nbValid = nbValid;
                result.nbInvalid = nbInvalid;
            }
            if (result.operationSettings && result.operationSettings.expression) {
                result.valueBeforeExpression = result.value;
                const scope = Object.assign({}, result, { nbItems: result.nbObjectsWithValue || result.set.length });
                try {
                    const evaluatedValue = math.evaluate(result.operationSettings.expression, scope);
                    if (evaluatedValue !== undefined) {
                        result.value = evaluatedValue;
                    }
                }
                catch (error) {
                    // do nothing
                    console.error(error);
                }
            }
            return result;
        });
    }
    static preparePathKey(key) {
        const parts = key.split('.');
        for (let i = 0; i < parts.length; i++) {
            if (i === 0) {
                continue;
            }
            parts[i] = `["${parts[i]}"]`;
        }
        return parts.join('');
    }
    static compare(object, condition) {
        const key = ThreeCheckerControllerMiddleware.preparePathKey(condition.key);
        let value = object_resolve_path_1.default(object, key);
        if (typeof condition.value === 'number' && typeof value === 'string') {
            value = parseFloat(value);
        }
        else if (condition.value instanceof Date && typeof value === 'string') {
            value = moment_1.default(value).toDate();
        }
        if (condition.operator === '=') {
            if (ThreeCheckerControllerMiddleware.makeNumberIfPossible(value) != ThreeCheckerControllerMiddleware.makeNumberIfPossible(condition.value))
                return false;
        }
        else if (condition.operator === '!=') {
            if (ThreeCheckerControllerMiddleware.makeNumberIfPossible(value) == ThreeCheckerControllerMiddleware.makeNumberIfPossible(condition.value))
                return false;
        }
        else if (condition.operator === '<') {
            if (ThreeCheckerControllerMiddleware.makeNumberIfPossible(value) > ThreeCheckerControllerMiddleware.makeNumberIfPossible(condition.value))
                return false;
        }
        else if (condition.operator === '>') {
            if (ThreeCheckerControllerMiddleware.makeNumberIfPossible(value) < ThreeCheckerControllerMiddleware.makeNumberIfPossible(condition.value))
                return false;
        }
        else if (condition.operator === '*') {
            if (typeof condition.value !== 'string' && condition.value.toString)
                condition.value = condition.value.toString();
            if (typeof value !== 'string' && value.toString)
                value = value.toString();
            if (typeof value !== 'string' || typeof condition.value !== 'string') {
                // could not convert values to string
                return false;
            }
            if (value.toLowerCase().indexOf(condition.value.toLowerCase()) === -1)
                return false;
        }
        return true;
    }
    static makeNumberIfPossible(input) {
        if (typeof input !== 'string') {
            return input;
        }
        const num = parseFloat(input.trim());
        return `${num}` === input.trim() ? num : input;
    }
    static printReportHead(pdf, report) {
        return __awaiter(this, void 0, void 0, function* () {
            const head = new deco_api_1.PDFTextBlock(pdf);
            head.text = `# ${report.name}`;
            if (report.description) {
                head.text += `

${report.description}`;
            }
            head.apply();
        });
    }
    static printChecker(pdf, result) {
        return __awaiter(this, void 0, void 0, function* () {
            const head = new deco_api_1.PDFTextBlock(pdf);
            head.fontSize = 12;
            head.text = `### ${result.name}`;
            if (result.description) {
                head.text += "\n";
                head.text += `(color:0.5,0.5,0.5) ${result.description} (color:0)`;
            }
            head.text += "\n";
            head.text += "\n";
            head.text += "\n" + `**Nb Objects in set:** ${result.set.length}`;
            if (result.nbObjectsWithValue !== undefined) {
                head.text += "\n" + `**Nb Objects with value:** ${result.nbObjectsWithValue}`;
            }
            head.text += "\n" + `**Operation:** ${result.operation}`;
            if (result.operation === 'compare-key-value') {
                head.text += "\n" + `${result.operationSettings.key} ${result.operationSettings.operator} ${result.operationSettings.value}`;
            }
            if (result.operation === 'add-key-value') {
                head.text += "\n" + `Key to add: ${result.operationSettings.key}`;
            }
            if (result.operationSettings.expression) {
                head.text += "\n" + `**Value before expression:** ${result.valueBeforeExpression}`;
            }
            if (result.operationSettings.expression) {
                head.text += "\n" + `**Expression:** ${result.operationSettings.expression}`;
            }
            if (result.value !== undefined) {
                head.text += "\n" + `**Value:** ${result.value}`;
            }
            if (result.nbValid !== undefined) {
                head.text += "\n" + `**Nb Valid:** ${result.nbValid}`;
            }
            if (result.nbInvalid !== undefined) {
                head.text += "\n" + `**Nb Invalid:** ${result.nbInvalid}`;
            }
            if (result.isValid !== undefined) {
                const color = result.isValid ? '0,1,0' : '1,0,0';
                head.text += "\n" + `**Valid:** (color:${color}) ${result.isValid ? 'Yes' : 'No'} (color:0)`;
            }
            head.apply();
            const set = new deco_api_1.PDFTextBlock(pdf);
            set.fontSize = 12;
            set.text = '**Objects included in the check**';
            set.text += "\n";
            set.text += "\n";
            for (let item of result.set) {
                set.text += `${item.name} (${item.ifcId})`;
                set.text += "\n";
                if (item.value) {
                    set.text += `Value: ${item.value}`;
                    set.text += "\n";
                }
                if (item.testValue !== undefined) {
                    const color = item.isValid ? '0,1,0' : '1,0,0';
                    set.text += `Value: (color:${color}) ${item.testValue} (color:0)`;
                    set.text += "\n";
                }
                if (item.isValid !== undefined) {
                    const color = item.isValid ? '0,1,0' : '1,0,0';
                    set.text += `Valid: (color:${color}) ${item.isValid ? 'Yes' : 'No'} (color:0)`;
                    set.text += "\n";
                }
            }
            set.apply();
        });
    }
}
exports.ThreeCheckerControllerMiddleware = ThreeCheckerControllerMiddleware;
//# sourceMappingURL=three.checker.controller.middleware.js.map