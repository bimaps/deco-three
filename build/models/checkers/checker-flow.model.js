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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
exports.CheckerFlowModel = void 0;
const space_model_1 = require("./../space.model");
const three_generator_1 = require("./../../helpers/three.generator");
const geometry_model_1 = require("./../geometry.model");
const material_model_1 = require("./../material.model");
const object_model_1 = require("./../object.model");
const checker_internals_1 = require("./checker-internals");
const site_model_1 = require("../site.model");
const deco_api_1 = require("deco-api");
const THREE = __importStar(require("three"));
const moment_1 = __importDefault(require("moment"));
const object_resolve_path_1 = __importDefault(require("object-resolve-path"));
let debug = require('debug')('app:models:three:checkers:flow');
let CheckerFlowModel = class CheckerFlowModel extends deco_api_1.Model {
    constructor() {
        super(...arguments);
        this.name = '';
        this.description = '';
        this.modulesIds = [];
        this.modules = [];
        this.outputs = [];
    }
    process(scene) {
        return __awaiter(this, void 0, void 0, function* () {
            this.scene = scene || (yield this.prepareScene(this.siteId));
            for (const moduleId of this.modulesIds || []) {
                const moduleElement = yield checker_internals_1.CheckerModuleBaseModel.deco.db
                    .collection(checker_internals_1.CheckerModuleBaseModel.deco.collectionName)
                    .findOne({ _id: moduleId });
                const instance = yield checker_internals_1.CheckerModuleBaseModel.instanceFromDocument(moduleElement);
                if (instance) {
                    this.modules.push(instance);
                    yield instance.process(this);
                    yield instance.summary();
                }
            }
            return this.scene;
        });
    }
    prepareScene(siteId) {
        return __awaiter(this, void 0, void 0, function* () {
            const site = yield site_model_1.ThreeSiteModel.getOneWithId(siteId);
            if (!site) {
                throw new Error('Site not found');
            }
            const objects = (yield object_model_1.ThreeObjectModel.getAll(new deco_api_1.Query({ siteId: site._id }))) || [];
            const matIds = objects.map(o => o.material);
            const materials = yield material_model_1.ThreeMaterialModel.getAll(new deco_api_1.Query({ uuid: { $in: matIds } }));
            const geoIds = objects.map(o => o.geometry);
            const geometries = yield geometry_model_1.ThreeGeometryModel.getAll(new deco_api_1.Query({ uuid: { $in: geoIds } }));
            const spaces = yield space_model_1.ThreeSpaceModel.getAll(new deco_api_1.Query({ siteId: site._id }));
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
            this.scene = scene;
            const generator = new three_generator_1.ThreeGenerator();
            const spaceMaterial = new THREE.MeshBasicMaterial();
            for (const space of spaces) {
                const mesh = generator.space2mesh(space, spaceMaterial);
                if (mesh) {
                    scene.add(mesh);
                }
            }
            return this.scene;
        });
    }
    fetchInput(varname) {
        if (varname === 'scene') {
            return {
                type: 'scene',
                value: this.scene,
                ref: undefined,
                style: 'default'
            };
        }
        for (const moduleInstance of this.modules) {
            if (moduleInstance.outputVarName === varname) {
                return {
                    value: moduleInstance.outputValue,
                    type: moduleInstance.outputType,
                    ref: moduleInstance.outputReference,
                    style: moduleInstance.outputStyle || 'default'
                };
            }
        }
        return undefined;
    }
    fetchProp(object, propPath) {
        if (propPath.indexOf('#{') !== -1 || propPath.indexOf('!#') !== -1) {
            propPath = propPath.replace(/(#{|!{)/gm, '$1object:');
            return deco_api_1.Parser.parseTemplate(propPath, { object });
        }
        const parts = propPath.split('.');
        for (let i = 0; i < parts.length; i++) {
            if (i === 0) {
                continue;
            }
            parts[i] = `["${parts[i]}"]`;
        }
        const key = parts.join('');
        return object_resolve_path_1.default(object, key);
    }
    compareObject(object, condition) {
        const value = this.fetchProp(object, condition.key);
        return this.compareValue(value, condition);
    }
    compareValue(value, condition) {
        if (typeof condition.value === 'number' && typeof value === 'string') {
            value = parseFloat(value);
        }
        else if (condition.value instanceof Date && typeof value === 'string') {
            value = moment_1.default(value).toDate();
        }
        if (condition.operation === '=') {
            if (this.makeNumberIfPossible(value) != this.makeNumberIfPossible(condition.value))
                return false;
        }
        else if (condition.operation === '!=') {
            if (this.makeNumberIfPossible(value) == this.makeNumberIfPossible(condition.value))
                return false;
        }
        else if (condition.operation === '<') {
            if (this.makeNumberIfPossible(value) > this.makeNumberIfPossible(condition.value))
                return false;
        }
        else if (condition.operation === '>') {
            if (this.makeNumberIfPossible(value) < this.makeNumberIfPossible(condition.value))
                return false;
        }
        else if (condition.operation === '*') {
            if (typeof condition.value !== 'string' && condition.value.toString)
                condition.value = condition.value.toString();
            if (value && typeof value !== 'string' && value.toString)
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
    makeNumberIfPossible(input) {
        if (typeof input !== 'string') {
            return input;
        }
        const num = parseFloat(input.trim());
        return `${num}` === input.trim() ? num : input;
    }
    getOutputs(convertObjectToIfcId = true) {
        var _a, _b, _c;
        const outputs = this.outputs;
        for (const output of outputs || []) {
            for (const output2 of output.outputs || []) {
                if (output2.ref) {
                    if (Array.isArray(output2.ref)) {
                        for (const index in output2.ref) {
                            const ref = output2.ref[index];
                            if (ref instanceof THREE.Mesh && ((_a = ref.userData) === null || _a === void 0 ? void 0 : _a.ifcId)) {
                                output2.ref[index] = { ifcId: ref.userData.ifcId };
                            }
                            else {
                                output2.ref[index] = undefined;
                            }
                        }
                    }
                    else if (output2.ref instanceof THREE.Mesh && ((_b = output2.ref.userData) === null || _b === void 0 ? void 0 : _b.ifcId)) {
                        output2.ref = { ifcId: (_c = output2.ref.userData) === null || _c === void 0 ? void 0 : _c.ifcId };
                    }
                    else {
                        output2.ref = undefined;
                    }
                }
            }
        }
        return outputs;
    }
};
__decorate([
    deco_api_1.type.id
], CheckerFlowModel.prototype, "_id", void 0);
__decorate([
    deco_api_1.type.model({ model: deco_api_1.AppModel }),
    deco_api_1.io.input,
    deco_api_1.io.toDocument,
    deco_api_1.query.filterable(),
    deco_api_1.validate.required,
    deco_api_1.mongo.index({ type: 'single' })
], CheckerFlowModel.prototype, "appId", void 0);
__decorate([
    deco_api_1.type.model({ model: site_model_1.ThreeSiteModel }),
    deco_api_1.io.all,
    deco_api_1.query.filterable(),
    deco_api_1.validate.required,
    deco_api_1.mongo.index({ type: 'single' })
], CheckerFlowModel.prototype, "siteId", void 0);
__decorate([
    deco_api_1.type.string,
    deco_api_1.io.all,
    deco_api_1.validate.required
], CheckerFlowModel.prototype, "name", void 0);
__decorate([
    deco_api_1.type.string,
    deco_api_1.io.all
], CheckerFlowModel.prototype, "description", void 0);
__decorate([
    deco_api_1.type.models({ model: checker_internals_1.CheckerModuleBaseModel }),
    deco_api_1.io.all
], CheckerFlowModel.prototype, "modulesIds", void 0);
CheckerFlowModel = __decorate([
    deco_api_1.model('checker_flow')
], CheckerFlowModel);
exports.CheckerFlowModel = CheckerFlowModel;
//# sourceMappingURL=checker-flow.model.js.map