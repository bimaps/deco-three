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
exports.CheckerModuleOutputModel = void 0;
const checker_internals_1 = require("./checker-internals");
const checker_internals_2 = require("./checker-internals");
const site_model_1 = require("../site.model");
const deco_api_1 = require("deco-api");
let debug = require('debug')('app:models:three:checker:module-reducer');
let CheckerModuleOutputModel = class CheckerModuleOutputModel extends checker_internals_1.CheckerModuleBaseModel {
    constructor() {
        super(...arguments);
        this.allowedInputTypes = ['number', 'numbers', 'string', 'strings', 'boolean', 'booleans'];
        this.moduleType = 'output';
        this.name = '';
        this.outputType = 'json';
        this.outputs = [];
    }
    process(flow) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const output = [];
            for (const outputConfig of this.outputs) {
                const inputValueType = flow.fetchInput(outputConfig.varName) || {
                    type: 'string',
                    value: '',
                    ref: undefined,
                    style: 'default'
                };
                // FIX: input is not required anymore
                // if (!inputValueType) {
                //   throw new Error('Input requested not found');
                // }
                if (!((_a = this.allowedInputTypes) === null || _a === void 0 ? void 0 : _a.includes(inputValueType.type))) {
                    throw new Error('Invalid input type');
                }
                if (Array.isArray(inputValueType.value)) {
                    if (Array.isArray(inputValueType.ref) && inputValueType.ref.length !== inputValueType.value.length) {
                        throw new Error('Ref array length must be the same than value array length');
                    }
                    if (Array.isArray(inputValueType.style) && inputValueType.style.length !== inputValueType.value.length) {
                        throw new Error('Style array length must be the same than value array length');
                    }
                    for (let index = 0; index < inputValueType.value.length; index++) {
                        const value = inputValueType.value[index];
                        const ref = Array.isArray(inputValueType.ref) ? inputValueType.ref[index] : inputValueType.ref;
                        const style = Array.isArray(inputValueType.style) ? inputValueType.style[index] : inputValueType.style;
                        const type = inputValueType.type && inputValueType.type.substr(-1, 1) === 's' ? inputValueType.type.substr(0, inputValueType.type.length - 1) : inputValueType.type;
                        output.push({
                            prefix: outputConfig.prefix,
                            value: value,
                            type: type,
                            ref: ref,
                            style: style,
                            suffix: outputConfig.suffix,
                            display: outputConfig.display,
                        });
                    }
                }
                else {
                    output.push({
                        prefix: outputConfig.prefix,
                        value: inputValueType.value,
                        type: inputValueType.type,
                        ref: inputValueType.ref,
                        style: inputValueType.style,
                        suffix: outputConfig.suffix,
                        display: outputConfig.display,
                    });
                }
            }
            this.outputValue = output;
            flow.outputs.push({
                name: this.name,
                outputs: this.outputValue
            });
        });
    }
    summary() {
        return __awaiter(this, void 0, void 0, function* () {
            let out = '';
            if (Array.isArray(this.outputValue)) {
                out = JSON.stringify(this.outputValue.map(ov => Object.assign({}, ov, { ref: undefined })));
            }
            else if (typeof this.outputValue === 'object') {
                out = JSON.stringify(Object.assign({}, this.outputValue, { ref: undefined }));
            }
            this.outputSummary = out.length > 200 ? out.substr(0, 200) : out;
            yield this.update(['outputSummary']);
        });
    }
};
__decorate([
    deco_api_1.type.id
], CheckerModuleOutputModel.prototype, "_id", void 0);
__decorate([
    deco_api_1.type.model({ model: deco_api_1.AppModel }),
    deco_api_1.io.input,
    deco_api_1.io.toDocument,
    deco_api_1.query.filterable(),
    deco_api_1.validate.required,
    deco_api_1.mongo.index({ type: 'single' })
], CheckerModuleOutputModel.prototype, "appId", void 0);
__decorate([
    deco_api_1.type.model({ model: site_model_1.ThreeSiteModel }),
    deco_api_1.io.all,
    deco_api_1.query.filterable(),
    deco_api_1.validate.required,
    deco_api_1.mongo.index({ type: 'single' })
], CheckerModuleOutputModel.prototype, "siteId", void 0);
__decorate([
    deco_api_1.type.select({ options: checker_internals_1.CheckerModuleIOTypeOptions, multiple: true }),
    deco_api_1.io.toDocument,
    deco_api_1.io.output
], CheckerModuleOutputModel.prototype, "allowedInputTypes", void 0);
__decorate([
    deco_api_1.type.select({ options: checker_internals_2.CheckerModuleTypeOptions }),
    deco_api_1.io.toDocument,
    deco_api_1.io.output,
    deco_api_1.validate.required
], CheckerModuleOutputModel.prototype, "moduleType", void 0);
__decorate([
    deco_api_1.type.string,
    deco_api_1.io.all
], CheckerModuleOutputModel.prototype, "name", void 0);
__decorate([
    deco_api_1.type.string,
    deco_api_1.io.all,
    deco_api_1.validate.required
], CheckerModuleOutputModel.prototype, "inputVarName", void 0);
__decorate([
    deco_api_1.type.string,
    deco_api_1.io.all,
    deco_api_1.validate.required
], CheckerModuleOutputModel.prototype, "outputVarName", void 0);
__decorate([
    deco_api_1.type.select({ options: checker_internals_1.CheckerModuleIOTypeOptions, multiple: false }),
    deco_api_1.io.toDocument,
    deco_api_1.io.output
], CheckerModuleOutputModel.prototype, "outputType", void 0);
__decorate([
    deco_api_1.type.string,
    deco_api_1.io.toDocument,
    deco_api_1.io.output
], CheckerModuleOutputModel.prototype, "outputSummary", void 0);
__decorate([
    deco_api_1.type.array({ type: 'object', options: {
            keys: {
                prefix: { type: 'string' },
                varName: { type: 'string' },
                suffix: { type: 'string' },
                display: { type: 'select', options: ['paragraph', 'blocks'] }
            }
        } }),
    deco_api_1.io.all
], CheckerModuleOutputModel.prototype, "outputs", void 0);
CheckerModuleOutputModel = __decorate([
    deco_api_1.model('checker_module')
], CheckerModuleOutputModel);
exports.CheckerModuleOutputModel = CheckerModuleOutputModel;
//# sourceMappingURL=checker-module-output.model.js.map