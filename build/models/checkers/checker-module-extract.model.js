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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckerModuleExtractModel = void 0;
const three_utils_1 = require("./../../helpers/three-utils");
const checker_internals_1 = require("./checker-internals");
const checker_internals_2 = require("./checker-internals");
const checker_internals_3 = require("./checker-internals");
const site_model_1 = require("../site.model");
const deco_api_1 = require("deco-api");
const THREE = __importStar(require("three"));
let debug = require('debug')('app:models:three:checker:module-extract');
let CheckerModuleExtractModel = class CheckerModuleExtractModel extends checker_internals_2.CheckerModuleBaseModel {
    constructor() {
        super(...arguments);
        this.allowedInputTypes = ['three-objects', 'scene', 'three-object'];
        this.moduleType = 'extract';
        this.name = '';
        this.inputObjects = [];
        this.multiple = true;
    }
    process(flow) {
        const _super = Object.create(null, {
            process: { get: () => super.process }
        });
        return __awaiter(this, void 0, void 0, function* () {
            _super.process.call(this, flow);
            this.multiple = true;
            if (this.currentInput && this.currentInputType === 'three-objects') {
                this.inputObjects = this.currentInput;
            }
            else if (this.currentInput && this.currentInputType === 'scene') {
                this.inputObjects = [];
                flow.scene.traverse((obj) => {
                    this.inputObjects.push(obj);
                });
            }
            else if (this.currentInput && this.currentInputType === 'three-object') {
                this.inputObjects = [this.currentInput];
                this.multiple = false;
            }
            else {
                throw new Error('Invalid extract input');
            }
            const output = [];
            const refs = [];
            for (const object of this.inputObjects) {
                if (this.extractType === 'property') {
                    let value = flow.fetchProp(object, this.value);
                    if (this.forceOutputAsNumber && typeof value !== 'number') {
                        value = parseFloat(value);
                    }
                    output.push(value);
                    refs.push(object);
                }
                else if (this.extractType === 'faces') {
                    const faces = this.extractFaces(object);
                    output.push(...faces);
                    const refsForFaces = Array(faces.length).fill(object);
                    refs.push(...refsForFaces);
                    this.outputType = 'triangles';
                }
                else if (this.extractType === 'edges') {
                    const edges = this.extractEdges(object);
                    output.push(...edges);
                    const refForEdges = Array(edges.length).fill(object);
                    refs.push(...refForEdges);
                    this.outputType = 'line3s';
                }
                else if (this.extractType === 'wireframe') {
                    const wireframes = this.extractWireframe(object);
                    output.push(...wireframes);
                    const refForWireframes = Array(wireframes.length).fill(object);
                    refs.push(...refForWireframes);
                    this.outputType = 'line3s';
                }
                else if (this.extractType === 'vertices') {
                    const vertices = this.extractVertices(object);
                    output.push(...vertices);
                    const refForVertices = Array(vertices.length).fill(object);
                    refs.push(...refForVertices);
                    this.outputType = 'vector3s';
                }
            }
            if (typeof output[0] === 'boolean') {
                this.outputType = this.multiple ? 'booleans' : 'boolean';
            }
            else if (typeof output[0] === 'number') {
                this.outputType = this.multiple ? 'numbers' : 'number';
            }
            else if (typeof output[0] === 'string') {
                this.outputType = this.multiple ? 'strings' : 'string';
            }
            this.outputValue = this.multiple ? output : output[0];
            this.outputReference = this.multiple ? refs : refs[0];
        });
    }
    summary() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.extractType !== 'property' && Array.isArray(this.outputValue)) {
                this.outputSummary = `${this.outputValue.length} ${this.extractType}`;
            }
            else if (Array.isArray(this.outputValue)) {
                const firstValues = this.outputValue.slice(0, 3);
                this.outputSummary = firstValues.join(', ');
            }
            else {
                this.outputSummary = '';
            }
            yield this.update(['outputSummary']);
        });
    }
    extractFaces(object) {
        const triangles = [];
        if (object instanceof THREE.Mesh) {
            const geometry = object.geometry;
            if (geometry instanceof THREE.Geometry) {
                for (let face of geometry.faces) {
                    triangles.push(new THREE.Triangle(geometry.vertices[face.a], geometry.vertices[face.b], geometry.vertices[face.c]));
                }
            }
            else {
                var tempGeo = new THREE.Geometry().fromBufferGeometry(geometry);
                for (let face of tempGeo.faces) {
                    triangles.push(new THREE.Triangle(tempGeo.vertices[face.a] /*.applyMatrix4(object.matrix)*/, tempGeo.vertices[face.b] /*.applyMatrix4(object.matrix)*/, tempGeo.vertices[face.c] /*.applyMatrix4(object.matrix)*/));
                }
            }
        }
        return triangles;
    }
    extractWireframe(object) {
        const edgeIndexPairs = {};
        const edges = [];
        if (object instanceof THREE.Mesh) {
            const geometry = object.geometry;
            if (geometry instanceof THREE.Geometry) {
                for (let face of geometry.faces) {
                    if (!edgeIndexPairs[`${face.a}-${face.b}`]) {
                        edges.push(new THREE.Line3(geometry.vertices[face.a], geometry.vertices[face.b]));
                        edgeIndexPairs[`${face.a}-${face.b}`] = true;
                        edgeIndexPairs[`${face.b}-${face.a}`] = true;
                    }
                    if (!edgeIndexPairs[`${face.a}-${face.c}`]) {
                        edges.push(new THREE.Line3(geometry.vertices[face.a], geometry.vertices[face.c]));
                        edgeIndexPairs[`${face.a}-${face.c}`] = true;
                        edgeIndexPairs[`${face.c}-${face.a}`] = true;
                    }
                    if (!edgeIndexPairs[`${face.c}-${face.b}`]) {
                        edges.push(new THREE.Line3(geometry.vertices[face.c], geometry.vertices[face.b]));
                        edgeIndexPairs[`${face.c}-${face.b}`] = true;
                        edgeIndexPairs[`${face.b}-${face.c}`] = true;
                    }
                }
            }
            else {
                var tempGeo = new THREE.Geometry().fromBufferGeometry(geometry);
                const vertices = tempGeo.vertices.map(v => v /*.applyMatrix4(object.matrix)*/);
                for (let face of tempGeo.faces) {
                    if (!edgeIndexPairs[`${face.a}-${face.b}`]) {
                        edges.push(new THREE.Line3(vertices[face.a], vertices[face.b]));
                        edgeIndexPairs[`${face.a}-${face.b}`] = true;
                        edgeIndexPairs[`${face.b}-${face.a}`] = true;
                    }
                    if (!edgeIndexPairs[`${face.a}-${face.c}`]) {
                        edges.push(new THREE.Line3(vertices[face.a], vertices[face.c]));
                        edgeIndexPairs[`${face.a}-${face.c}`] = true;
                        edgeIndexPairs[`${face.c}-${face.a}`] = true;
                    }
                    if (!edgeIndexPairs[`${face.c}-${face.b}`]) {
                        edges.push(new THREE.Line3(vertices[face.c], vertices[face.b]));
                        edgeIndexPairs[`${face.c}-${face.b}`] = true;
                        edgeIndexPairs[`${face.b}-${face.c}`] = true;
                    }
                }
            }
        }
        return edges;
    }
    extractEdges(object) {
        if (object instanceof THREE.Mesh) {
            return three_utils_1.ThreeUtils.edgesFromObject(object);
        }
        return [];
    }
    extractVertices(object) {
        const vertices = [];
        if (object instanceof THREE.Mesh) {
            const geometry = object.geometry;
            if (geometry instanceof THREE.Geometry) {
                vertices.push(...geometry.vertices.map(v => v.clone()));
            }
            else {
                var tempGeo = new THREE.Geometry().fromBufferGeometry(geometry);
                for (var i = 0; i < tempGeo.vertices.length; i++) {
                    vertices.push(tempGeo.vertices[i] /*.applyMatrix4(object.matrix)*/);
                }
            }
        }
        return vertices;
    }
};
__decorate([
    deco_api_1.type.id
], CheckerModuleExtractModel.prototype, "_id", void 0);
__decorate([
    deco_api_1.type.model({ model: deco_api_1.AppModel }),
    deco_api_1.io.input,
    deco_api_1.io.toDocument,
    deco_api_1.query.filterable(),
    deco_api_1.validate.required,
    deco_api_1.mongo.index({ type: 'single' })
], CheckerModuleExtractModel.prototype, "appId", void 0);
__decorate([
    deco_api_1.type.model({ model: site_model_1.ThreeSiteModel }),
    deco_api_1.io.all,
    deco_api_1.query.filterable(),
    deco_api_1.validate.required,
    deco_api_1.mongo.index({ type: 'single' })
], CheckerModuleExtractModel.prototype, "siteId", void 0);
__decorate([
    deco_api_1.type.select({ options: checker_internals_2.CheckerModuleIOTypeOptions, multiple: true }),
    deco_api_1.io.toDocument,
    deco_api_1.io.output
], CheckerModuleExtractModel.prototype, "allowedInputTypes", void 0);
__decorate([
    deco_api_1.type.select({ options: checker_internals_3.CheckerModuleTypeOptions }),
    deco_api_1.io.toDocument,
    deco_api_1.io.output,
    deco_api_1.validate.required
], CheckerModuleExtractModel.prototype, "moduleType", void 0);
__decorate([
    deco_api_1.type.string,
    deco_api_1.io.all
], CheckerModuleExtractModel.prototype, "name", void 0);
__decorate([
    deco_api_1.type.string,
    deco_api_1.io.all,
    deco_api_1.validate.required
], CheckerModuleExtractModel.prototype, "inputVarName", void 0);
__decorate([
    deco_api_1.type.string,
    deco_api_1.io.all,
    deco_api_1.validate.required
], CheckerModuleExtractModel.prototype, "outputVarName", void 0);
__decorate([
    deco_api_1.type.select({ options: checker_internals_2.CheckerModuleIOTypeOptions, multiple: false }),
    deco_api_1.io.toDocument,
    deco_api_1.io.output
], CheckerModuleExtractModel.prototype, "outputType", void 0);
__decorate([
    deco_api_1.type.string,
    deco_api_1.io.toDocument,
    deco_api_1.io.output
], CheckerModuleExtractModel.prototype, "outputSummary", void 0);
__decorate([
    deco_api_1.type.select({ options: checker_internals_1.CheckerExtractTypeOptions }),
    deco_api_1.io.all
], CheckerModuleExtractModel.prototype, "extractType", void 0);
__decorate([
    deco_api_1.type.any,
    deco_api_1.io.all
], CheckerModuleExtractModel.prototype, "value", void 0);
__decorate([
    deco_api_1.type.boolean,
    deco_api_1.io.all
], CheckerModuleExtractModel.prototype, "forceOutputAsNumber", void 0);
CheckerModuleExtractModel = __decorate([
    deco_api_1.model('checker_module')
], CheckerModuleExtractModel);
exports.CheckerModuleExtractModel = CheckerModuleExtractModel;
//# sourceMappingURL=checker-module-extract.model.js.map