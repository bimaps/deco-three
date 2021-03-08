"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
exports.CheckerModuleReducerModel = void 0;
const checker_internals_1 = require("./checker-internals");
const checker_internals_2 = require("./checker-internals");
const site_model_1 = require("../site.model");
const deco_api_1 = require("deco-api");
let debug = require('debug')('app:models:three:checker:module-reducer');
let CheckerModuleReducerModel = class CheckerModuleReducerModel extends checker_internals_1.CheckerModuleBaseModel {
    constructor() {
        super(...arguments);
        this.allowedInputTypes = ['three-objects', 'numbers', 'strings'];
        this.moduleType = 'reducer';
        this.name = '';
    }
    process(flow) {
        const _super = Object.create(null, {
            process: { get: () => super.process }
        });
        return __awaiter(this, void 0, void 0, function* () {
            _super.process.call(this, flow);
            if (!Array.isArray(this.currentInput)) {
                throw new Error('Reducer module only accepts array as input');
            }
            let mathInput;
            if (this.operation === 'min' || this.operation === 'max' || this.operation === 'average' || this.operation === 'sum') {
                if (this.currentInputType === 'numbers') {
                    mathInput = this.currentInput;
                }
                else if (this.currentInputType === 'strings') {
                    mathInput = this.currentInput.map(s => parseFloat(s));
                }
                else {
                    throw new Error('Min, max, average and sum reducers modules only accepts number, numbers, string and strings as input');
                }
                this.outputType = 'number';
                if (this.operation === 'min') {
                    // this.outputValue = Math.min(...mathInput); // very bad perf with spread for large arrays
                    // const min = mathInput.reduce((m, n) => Math.min(m, n)); // average perf with reduce for large arrays
                    const min = Math.min.apply(null, mathInput); // best perf with min.apply for large arras
                    const refKeys = [...Object.keys(mathInput)].filter(i => mathInput[parseInt(i, 10)] === min);
                    this.outputValue = min;
                    const inputRefs = this.currentInputRef || [];
                    this.outputReference = inputRefs.filter((v, i) => refKeys.includes(i.toString()));
                }
                else if (this.operation === 'max') {
                    // this.outputValue = Math.max(...mathInput);  // very bad perf with spread for large arrays
                    // const max = mathInput.reduce((m, n) => Math.max(m, n)); // average perf with reduce for large arrays
                    const max = Math.max.apply(null, mathInput); // best perf with max.apply for large arras
                    const refKeys = [...Object.keys(mathInput)].filter(i => mathInput[parseInt(i, 10)] === max);
                    this.outputValue = max;
                    const inputRefs = this.currentInputRef || [];
                    this.outputReference = inputRefs.filter((v, i) => refKeys.includes(i.toString()));
                }
                else if (this.operation === 'sum') {
                    this.outputReference = this.currentInputRef;
                    this.outputValue = mathInput.reduce((a, b) => a + b, 0);
                }
                else if (this.operation === 'average') {
                    this.outputValue = mathInput.reduce((a, b) => a + b, 0) / mathInput.length;
                    this.outputReference = this.currentInputRef;
                }
            }
            else if (this.operation === 'count') {
                this.outputType = 'number';
                this.outputValue = this.currentInput.length;
                this.outputReference = this.currentInputRef;
            }
        });
    }
    summary() {
        return __awaiter(this, void 0, void 0, function* () {
            let out = this.outputValue !== undefined ? this.outputValue : '';
            if (typeof out === 'number') {
                out = Math.round(out * 1000) / 1000;
            }
            this.outputSummary = out.toString();
            yield this.update(['outputSummary']);
        });
    }
};
__decorate([
    deco_api_1.type.id
], CheckerModuleReducerModel.prototype, "_id", void 0);
__decorate([
    deco_api_1.type.model({ model: deco_api_1.AppModel }),
    deco_api_1.io.input,
    deco_api_1.io.toDocument,
    deco_api_1.query.filterable(),
    deco_api_1.validate.required,
    deco_api_1.mongo.index({ type: 'single' })
], CheckerModuleReducerModel.prototype, "appId", void 0);
__decorate([
    deco_api_1.type.model({ model: site_model_1.ThreeSiteModel }),
    deco_api_1.io.all,
    deco_api_1.query.filterable(),
    deco_api_1.validate.required,
    deco_api_1.mongo.index({ type: 'single' })
], CheckerModuleReducerModel.prototype, "siteId", void 0);
__decorate([
    deco_api_1.type.select({ options: checker_internals_1.CheckerModuleIOTypeOptions, multiple: true }),
    deco_api_1.io.toDocument,
    deco_api_1.io.output
], CheckerModuleReducerModel.prototype, "allowedInputTypes", void 0);
__decorate([
    deco_api_1.type.select({ options: checker_internals_2.CheckerModuleTypeOptions }),
    deco_api_1.io.toDocument,
    deco_api_1.io.output,
    deco_api_1.validate.required
], CheckerModuleReducerModel.prototype, "moduleType", void 0);
__decorate([
    deco_api_1.type.string,
    deco_api_1.io.all
], CheckerModuleReducerModel.prototype, "name", void 0);
__decorate([
    deco_api_1.type.string,
    deco_api_1.io.all,
    deco_api_1.validate.required
], CheckerModuleReducerModel.prototype, "inputVarName", void 0);
__decorate([
    deco_api_1.type.string,
    deco_api_1.io.all,
    deco_api_1.validate.required
], CheckerModuleReducerModel.prototype, "outputVarName", void 0);
__decorate([
    deco_api_1.type.select({ options: checker_internals_1.CheckerModuleIOTypeOptions, multiple: false }),
    deco_api_1.io.toDocument,
    deco_api_1.io.output
], CheckerModuleReducerModel.prototype, "outputType", void 0);
__decorate([
    deco_api_1.type.string,
    deco_api_1.io.toDocument,
    deco_api_1.io.output
], CheckerModuleReducerModel.prototype, "outputSummary", void 0);
__decorate([
    deco_api_1.type.select({ options: checker_internals_2.CheckerModuleReducerOperationOptions }),
    deco_api_1.io.all
], CheckerModuleReducerModel.prototype, "operation", void 0);
CheckerModuleReducerModel = __decorate([
    deco_api_1.model('checker_module')
], CheckerModuleReducerModel);
exports.CheckerModuleReducerModel = CheckerModuleReducerModel;
//# sourceMappingURL=checker-module-reducer.model.js.map