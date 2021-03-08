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
exports.CheckerModuleNormalDistanceModel = void 0;
const checker_internals_1 = require("./checker-internals");
const checker_internals_2 = require("./checker-internals");
const site_model_1 = require("../site.model");
const deco_api_1 = require("deco-api");
const THREE = __importStar(require("three"));
let debug = require('debug')('app:models:three:checker:module-normal-distance');
let CheckerModuleNormalDistanceModel = class CheckerModuleNormalDistanceModel extends checker_internals_1.CheckerModuleBaseModel {
    constructor() {
        super(...arguments);
        this.allowedInputTypes = ['triangle', 'triangles', 'line3', 'line3s', 'vector3', 'vector3s'];
        this.moduleType = 'normal-distance';
        this.name = '';
        this.operation = 'min';
        this.sameInputs = false;
    }
    process(flow) {
        const _super = Object.create(null, {
            process: { get: () => super.process }
        });
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            _super.process.call(this, flow);
            this.sameInputs = this.inputVarName === this.input2VarName;
            const inputA = this.currentInput;
            // const inputAType = this.currentInputType as 'triangle' | 'triangles' | 'line3' | 'line3s' | 'vector3' | 'vector3s';
            if (!this.input2VarName) {
                throw new Error('Missing input2VarName');
            }
            const input2Value = flow.fetchInput(this.input2VarName);
            if (!input2Value) {
                throw new Error('Input requested not found');
            }
            if (!((_a = this.allowedInputTypes) === null || _a === void 0 ? void 0 : _a.includes(input2Value.type))) {
                throw new Error('Invalid input2 type');
            }
            const inputB = input2Value.value;
            // const inputBType = input2Value.type as 'triangle' | 'triangles' | 'line3' | 'line3s' | 'vector3' | 'vector3s';
            const distances = [];
            const refs = [];
            let iAs = Array.isArray(inputA) ? inputA : [inputA];
            let iBs = Array.isArray(inputB) ? inputB : [inputB];
            let refA = Array.isArray(this.currentInputRef) ? this.currentInputRef : [this.currentInputRef];
            let refB = Array.isArray(input2Value.ref) ? input2Value.ref : [input2Value.ref];
            if (iAs.length !== refA.length) {
                throw new Error('Invalid references for input A');
            }
            if (iBs.length !== refB.length) {
                throw new Error('Invalid references for input B');
            }
            const operation = this.operation || 'min';
            const processRefs = {};
            for (const indexA in iAs) {
                const iA = iAs[indexA];
                const rA = refA[indexA];
                for (const indexB in iBs) {
                    const rB = refB[indexB];
                    if (this.sameInputs && rA === rB) {
                        continue; // we ignore the same objects if we compare twich the same input
                    }
                    const processRefKey = processRefs[`${rB.uuid}:${rA.uuid}`] ? `${rB.uuid}:${rA.uuid}` : `${rA.uuid}:${rB.uuid}`;
                    if (!processRefs[processRefKey]) {
                        processRefs[processRefKey] = {
                            refA: rA,
                            refB: rB
                        };
                    }
                    const iB = iBs[indexB];
                    let distance;
                    if (iA instanceof THREE.Vector3 && iB instanceof THREE.Vector3) {
                        distance = this.pointPoint(iA, iB);
                    }
                    else if (iA instanceof THREE.Vector3 && iB instanceof THREE.Line3) {
                        distance = this.pointLine(iA, iB);
                    }
                    else if (iA instanceof THREE.Line3 && iB instanceof THREE.Vector3) {
                        distance = this.pointLine(iB, iA);
                    }
                    else if (iA instanceof THREE.Vector3 && iB instanceof THREE.Triangle) {
                        distance = this.pointFace(iA, iB);
                    }
                    else if (iA instanceof THREE.Triangle && iB instanceof THREE.Vector3) {
                        distance = this.pointFace(iB, iA);
                    }
                    else if (iA instanceof THREE.Line3 && iB instanceof THREE.Line3) {
                        distance = this.LineLine(iA, iB);
                    }
                    else if (iA instanceof THREE.Line3 && iB instanceof THREE.Triangle) {
                        distance = this.LineFace(iA, iB);
                    }
                    else if (iA instanceof THREE.Triangle && iB instanceof THREE.Line3) {
                        distance = this.LineFace(iB, iA);
                    }
                    else if (iA instanceof THREE.Triangle && iB instanceof THREE.Triangle) {
                        distance = this.FaceFace(iA, iB);
                    }
                    else {
                        throw new Error('Invalid normal distance requested');
                    }
                    if (distance !== undefined) {
                        if (operation === 'max') {
                            processRefs[processRefKey].value = processRefs[processRefKey].value ? Math.max(processRefs[processRefKey].value, distance) : distance;
                        }
                        else {
                            processRefs[processRefKey].value = processRefs[processRefKey].value ? Math.min(processRefs[processRefKey].value, distance) : distance;
                        }
                    }
                }
                if (this.sameInputs) {
                    break;
                }
            }
            for (const key in processRefs) {
                const processRef = processRefs[key];
                if (processRef.value === undefined) {
                    continue;
                }
                distances.push(processRef.value);
                refs.push([processRef.refA, processRef.refB]);
            }
            this.outputType = 'numbers';
            this.outputValue = distances;
            this.outputReference = refs;
        });
    }
    pointPoint(i1, i2) {
        return i1.distanceTo(i2);
    }
    pointLine(i1, i2) {
        const p = new THREE.Vector3;
        i2.closestPointToPoint(i1, true, p);
        return i1.distanceTo(p);
    }
    pointFace(i1, i2) {
        const p = new THREE.Vector3;
        i2.closestPointToPoint(i1, p);
        return i1.distanceTo(p);
    }
    LineLine(i1, i2) {
        const p = new THREE.Vector3;
        const pp = [];
        i1.closestPointToPoint(i2.start, true, p);
        pp.push(i2.start.distanceTo(p));
        i1.closestPointToPoint(i2.end, true, p);
        pp.push(i2.end.distanceTo(p));
        i2.closestPointToPoint(i1.start, true, p);
        pp.push(i1.start.distanceTo(p));
        i2.closestPointToPoint(i1.end, true, p);
        pp.push(i1.end.distanceTo(p));
        return Math.min(...pp);
    }
    LineFace(i1, i2) {
        const p = new THREE.Vector3;
        const pp = [];
        // distance from line to each points of the face
        // TODO: Fix formula
        i1.closestPointToPoint(i2.a, true, p);
        pp.push(i2.a.distanceTo(p));
        i1.closestPointToPoint(i2.b, true, p);
        pp.push(i2.b.distanceTo(p));
        i1.closestPointToPoint(i2.c, true, p);
        pp.push(i2.c.distanceTo(p));
        // distance from the face to each point of the line
        i2.closestPointToPoint(i1.start, p);
        pp.push(i1.start.distanceTo(p));
        i2.closestPointToPoint(i1.end, p);
        pp.push(i1.end.distanceTo(p));
        return Math.min(...pp);
    }
    FaceFace(i1, i2) {
        const p = new THREE.Vector3;
        const pp = [];
        i1.closestPointToPoint(i2.a, p);
        pp.push(i2.a.distanceTo(p));
        i1.closestPointToPoint(i2.b, p);
        pp.push(i2.b.distanceTo(p));
        i1.closestPointToPoint(i2.c, p);
        pp.push(i2.c.distanceTo(p));
        i2.closestPointToPoint(i1.a, p);
        pp.push(i1.a.distanceTo(p));
        i2.closestPointToPoint(i1.b, p);
        pp.push(i1.b.distanceTo(p));
        i2.closestPointToPoint(i1.c, p);
        pp.push(i1.c.distanceTo(p));
        return Math.min(...pp);
    }
    summary() {
        return __awaiter(this, void 0, void 0, function* () {
            if (Array.isArray(this.outputValue)) {
                this.outputSummary = `${this.outputValue.length} distances (${this.outputValue.slice(0, 3).map(v => { return Math.round(v * 1000) / 1000; }).join(', ')})`;
            }
            else {
                this.outputSummary = '';
            }
            yield this.update(['outputSummary']);
        });
    }
};
__decorate([
    deco_api_1.type.id
], CheckerModuleNormalDistanceModel.prototype, "_id", void 0);
__decorate([
    deco_api_1.type.model({ model: deco_api_1.AppModel }),
    deco_api_1.io.input,
    deco_api_1.io.toDocument,
    deco_api_1.query.filterable(),
    deco_api_1.validate.required,
    deco_api_1.mongo.index({ type: 'single' })
], CheckerModuleNormalDistanceModel.prototype, "appId", void 0);
__decorate([
    deco_api_1.type.model({ model: site_model_1.ThreeSiteModel }),
    deco_api_1.io.all,
    deco_api_1.query.filterable(),
    deco_api_1.validate.required,
    deco_api_1.mongo.index({ type: 'single' })
], CheckerModuleNormalDistanceModel.prototype, "siteId", void 0);
__decorate([
    deco_api_1.type.select({ options: checker_internals_1.CheckerModuleIOTypeOptions, multiple: true }),
    deco_api_1.io.toDocument,
    deco_api_1.io.output
], CheckerModuleNormalDistanceModel.prototype, "allowedInputTypes", void 0);
__decorate([
    deco_api_1.type.select({ options: checker_internals_2.CheckerModuleTypeOptions }),
    deco_api_1.io.toDocument,
    deco_api_1.io.output,
    deco_api_1.validate.required
], CheckerModuleNormalDistanceModel.prototype, "moduleType", void 0);
__decorate([
    deco_api_1.type.string,
    deco_api_1.io.all
], CheckerModuleNormalDistanceModel.prototype, "name", void 0);
__decorate([
    deco_api_1.type.string,
    deco_api_1.io.all,
    deco_api_1.validate.required
], CheckerModuleNormalDistanceModel.prototype, "inputVarName", void 0);
__decorate([
    deco_api_1.type.string,
    deco_api_1.io.all
], CheckerModuleNormalDistanceModel.prototype, "input2VarName", void 0);
__decorate([
    deco_api_1.type.string,
    deco_api_1.io.all,
    deco_api_1.validate.required
], CheckerModuleNormalDistanceModel.prototype, "outputVarName", void 0);
__decorate([
    deco_api_1.type.select({ options: checker_internals_1.CheckerModuleIOTypeOptions, multiple: false }),
    deco_api_1.io.toDocument,
    deco_api_1.io.output
], CheckerModuleNormalDistanceModel.prototype, "outputType", void 0);
__decorate([
    deco_api_1.type.string,
    deco_api_1.io.toDocument,
    deco_api_1.io.output
], CheckerModuleNormalDistanceModel.prototype, "outputSummary", void 0);
__decorate([
    deco_api_1.type.select({ options: ['min', 'max'] }),
    deco_api_1.io.all
], CheckerModuleNormalDistanceModel.prototype, "operation", void 0);
CheckerModuleNormalDistanceModel = __decorate([
    deco_api_1.model('checker_module')
], CheckerModuleNormalDistanceModel);
exports.CheckerModuleNormalDistanceModel = CheckerModuleNormalDistanceModel;
//# sourceMappingURL=checker-module-normal-distance.model.js.map