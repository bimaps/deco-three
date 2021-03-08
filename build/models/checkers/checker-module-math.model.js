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
exports.CheckerModuleMathModel = void 0;
const checker_internals_1 = require("./checker-internals");
const checker_internals_2 = require("./checker-internals");
const site_model_1 = require("../site.model");
const deco_api_1 = require("deco-api");
const math = __importStar(require("mathjs"));
let debug = require('debug')('app:models:three:checker:module-extract');
let CheckerModuleMathModel = class CheckerModuleMathModel extends checker_internals_1.CheckerModuleBaseModel {
    constructor() {
        super(...arguments);
        this.allowedInputTypes = ['numbers', 'strings', 'number', 'string'];
        this.moduleType = 'math';
        this.name = '';
        this.multiple = true;
    }
    process(flow) {
        const _super = Object.create(null, {
            process: { get: () => super.process }
        });
        return __awaiter(this, void 0, void 0, function* () {
            _super.process.call(this, flow);
            let arrayLength = 0;
            const inputs = {};
            // detect all required inputs
            for (let mod of flow.modules) {
                if (this.expression.indexOf(mod.outputVarName) !== -1) {
                    if (mod.outputVarName.indexOf(' ') !== -1) {
                        throw new Error('Variable names used in Mathematical expression must not contain space');
                    }
                    const value = mod.outputValue;
                    if (Array.isArray(value)) {
                        const length = value.length;
                        if (arrayLength === 0) {
                            arrayLength = length;
                        }
                        else if (arrayLength === length) {
                            // good
                        }
                        else {
                            throw new Error('All array variables used in Mathematical expression must have the same length');
                        }
                    }
                    inputs[mod.outputVarName] = mod.outputValue;
                }
            }
            this.multiple = arrayLength !== 0;
            const fct = math.compile(this.expression);
            if (!this.multiple) {
                const result = fct.evaluate(inputs);
                this.outputType = 'number';
                this.outputValue = result;
            }
            else {
                const results = [];
                for (let k = 0; k < arrayLength; k++) {
                    const scope = {};
                    for (const key in inputs) {
                        const valueOrValues = inputs[key];
                        if (Array.isArray(valueOrValues)) {
                            scope[key] = valueOrValues[k];
                        }
                        else {
                            scope[key] = valueOrValues;
                        }
                    }
                    results.push(fct.evaluate(scope));
                }
                this.outputType = 'numbers';
                this.outputValue = results;
            }
        });
    }
    summary() {
        return __awaiter(this, void 0, void 0, function* () {
            if (Array.isArray(this.outputValue)) {
                this.outputSummary = this.outputValue.slice(0, 3).join(', ');
            }
            else {
                this.outputSummary = this.outputValue.toString();
            }
            yield this.update(['outputSummary']);
        });
    }
};
__decorate([
    deco_api_1.type.id
], CheckerModuleMathModel.prototype, "_id", void 0);
__decorate([
    deco_api_1.type.model({ model: deco_api_1.AppModel }),
    deco_api_1.io.input,
    deco_api_1.io.toDocument,
    deco_api_1.query.filterable(),
    deco_api_1.validate.required,
    deco_api_1.mongo.index({ type: 'single' })
], CheckerModuleMathModel.prototype, "appId", void 0);
__decorate([
    deco_api_1.type.model({ model: site_model_1.ThreeSiteModel }),
    deco_api_1.io.all,
    deco_api_1.query.filterable(),
    deco_api_1.validate.required,
    deco_api_1.mongo.index({ type: 'single' })
], CheckerModuleMathModel.prototype, "siteId", void 0);
__decorate([
    deco_api_1.type.select({ options: checker_internals_1.CheckerModuleIOTypeOptions, multiple: true }),
    deco_api_1.io.toDocument,
    deco_api_1.io.output
], CheckerModuleMathModel.prototype, "allowedInputTypes", void 0);
__decorate([
    deco_api_1.type.select({ options: checker_internals_2.CheckerModuleTypeOptions }),
    deco_api_1.io.toDocument,
    deco_api_1.io.output,
    deco_api_1.validate.required
], CheckerModuleMathModel.prototype, "moduleType", void 0);
__decorate([
    deco_api_1.type.string,
    deco_api_1.io.all
], CheckerModuleMathModel.prototype, "name", void 0);
__decorate([
    deco_api_1.type.string,
    deco_api_1.io.all,
    deco_api_1.validate.required
], CheckerModuleMathModel.prototype, "inputVarName", void 0);
__decorate([
    deco_api_1.type.string,
    deco_api_1.io.all,
    deco_api_1.validate.required
], CheckerModuleMathModel.prototype, "outputVarName", void 0);
__decorate([
    deco_api_1.type.select({ options: checker_internals_1.CheckerModuleIOTypeOptions, multiple: false }),
    deco_api_1.io.toDocument,
    deco_api_1.io.output
], CheckerModuleMathModel.prototype, "outputType", void 0);
__decorate([
    deco_api_1.type.string,
    deco_api_1.io.toDocument,
    deco_api_1.io.output
], CheckerModuleMathModel.prototype, "outputSummary", void 0);
__decorate([
    deco_api_1.type.string,
    deco_api_1.io.all
], CheckerModuleMathModel.prototype, "expression", void 0);
CheckerModuleMathModel = __decorate([
    deco_api_1.model('checker_module')
], CheckerModuleMathModel);
exports.CheckerModuleMathModel = CheckerModuleMathModel;
//# sourceMappingURL=checker-module-math.model.js.map