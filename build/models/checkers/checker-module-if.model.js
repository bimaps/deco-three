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
exports.CheckerModuleIfModel = void 0;
const checker_interfaces_1 = require("./checker-interfaces");
const checker_internals_1 = require("./checker-internals");
const checker_internals_2 = require("./checker-internals");
const site_model_1 = require("../site.model");
const deco_api_1 = require("deco-api");
let debug = require('debug')('app:models:three:checker:module-if');
let CheckerModuleIfModel = class CheckerModuleIfModel extends checker_internals_1.CheckerModuleBaseModel {
    constructor() {
        super(...arguments);
        this.allowedInputTypes = ['numbers', 'strings', 'number', 'string'];
        this.moduleType = 'if';
        this.name = '';
    }
    process(flow) {
        const _super = Object.create(null, {
            process: { get: () => super.process }
        });
        return __awaiter(this, void 0, void 0, function* () {
            this.flow = flow;
            _super.process.call(this, flow);
            if (this.defaultOutputValue && typeof this.defaultOutputValue !== 'string' && typeof this.defaultOutputValue !== 'number' && typeof this.defaultOutputValue !== 'boolean') {
                throw new Error('If output value type must be string, number or boolean');
            }
            for (const operation of this.operations) {
                if (this.defaultOutputValue && operation.outputValue && typeof operation.outputValue !== typeof this.defaultOutputValue) {
                    throw new Error('All output value must be of identical type');
                }
            }
            if (this.currentInputType === 'numbers' || this.currentInputType === 'strings' || this.currentInputType === 'booleans') {
                const inputs = this.currentInput;
                const outputs = [];
                const styles = [];
                for (const key in inputs) {
                    const input = inputs[key];
                    const out = this.processOperationsForInput(input, this.operations);
                    outputs[key] = out.value || '';
                    styles[key] = out.style;
                }
                this.outputValue = outputs;
                this.outputStyle = styles;
            }
            else if (this.currentInputType === 'number' || this.currentInputType === 'string' || this.currentInput === 'boolean') {
                const input = this.currentInput;
                const out = this.processOperationsForInput(input, this.operations);
                this.outputValue = out.value || '';
                this.outputStyle = out.style;
            }
            this.outputType = (typeof this.defaultOutputValue);
            this.outputReference = this.currentInputRef;
            if (Array.isArray(this.outputValue)) {
                this.outputType += 's';
            }
        });
    }
    processOperationsForInput(input, operations) {
        for (const operation of operations) {
            let valid = false;
            for (let condition of operation.conditions) {
                valid = this.flow.compareValue(input, condition);
                if (valid && operation.conditionsOperator === 'or') {
                    break;
                }
                if (!valid && operation.conditionsOperator === 'and') {
                    break;
                }
            }
            if (valid) {
                return { value: operation.outputValue || input, style: operation.outputStyle };
            }
        }
        return { value: this.defaultOutputValue || input, style: this.defaultOutputStyle };
    }
    isConditionTrue(input, condition) {
        return false;
    }
    summary() {
        return __awaiter(this, void 0, void 0, function* () {
            if (Array.isArray(this.outputValue)) {
                this.outputSummary = this.outputValue.slice(0, 3).join(', ');
            }
            else {
                const out = this.outputValue || '';
                this.outputSummary = out.toString();
            }
        });
    }
};
__decorate([
    deco_api_1.type.id
], CheckerModuleIfModel.prototype, "_id", void 0);
__decorate([
    deco_api_1.type.model({ model: deco_api_1.AppModel }),
    deco_api_1.io.input,
    deco_api_1.io.toDocument,
    deco_api_1.query.filterable(),
    deco_api_1.validate.required,
    deco_api_1.mongo.index({ type: 'single' })
], CheckerModuleIfModel.prototype, "appId", void 0);
__decorate([
    deco_api_1.type.model({ model: site_model_1.ThreeSiteModel }),
    deco_api_1.io.all,
    deco_api_1.query.filterable(),
    deco_api_1.validate.required,
    deco_api_1.mongo.index({ type: 'single' })
], CheckerModuleIfModel.prototype, "siteId", void 0);
__decorate([
    deco_api_1.type.select({ options: checker_internals_1.CheckerModuleIOTypeOptions, multiple: true }),
    deco_api_1.io.toDocument,
    deco_api_1.io.output
], CheckerModuleIfModel.prototype, "allowedInputTypes", void 0);
__decorate([
    deco_api_1.type.select({ options: checker_internals_2.CheckerModuleTypeOptions }),
    deco_api_1.io.toDocument,
    deco_api_1.io.output,
    deco_api_1.validate.required
], CheckerModuleIfModel.prototype, "moduleType", void 0);
__decorate([
    deco_api_1.type.string,
    deco_api_1.io.all
], CheckerModuleIfModel.prototype, "name", void 0);
__decorate([
    deco_api_1.type.string,
    deco_api_1.io.all,
    deco_api_1.validate.required
], CheckerModuleIfModel.prototype, "inputVarName", void 0);
__decorate([
    deco_api_1.type.string,
    deco_api_1.io.all,
    deco_api_1.validate.required
], CheckerModuleIfModel.prototype, "outputVarName", void 0);
__decorate([
    deco_api_1.type.select({ options: checker_internals_2.CheckerModuleTypeOptions, multiple: false }),
    deco_api_1.io.toDocument,
    deco_api_1.io.output
], CheckerModuleIfModel.prototype, "outputType", void 0);
__decorate([
    deco_api_1.type.string,
    deco_api_1.io.toDocument,
    deco_api_1.io.output
], CheckerModuleIfModel.prototype, "outputSummary", void 0);
__decorate([
    deco_api_1.type.any,
    deco_api_1.io.all
], CheckerModuleIfModel.prototype, "defaultOutputValue", void 0);
__decorate([
    deco_api_1.type.select({ options: checker_interfaces_1.CheckerModuleIOStyleOptions }),
    deco_api_1.io.all
], CheckerModuleIfModel.prototype, "defaultOutputStyle", void 0);
__decorate([
    deco_api_1.type.array({ type: 'object', options: {
            keys: {
                conditions: { type: 'array', options: { type: 'object', options: {
                            keys: {
                                operation: { type: 'string' },
                                value: { type: 'any' },
                            }
                        } } },
                conditionsOperator: { type: 'select', options: ['and', 'or'] },
                outputValue: { type: 'any' },
                outputStyle: { type: 'select', options: checker_interfaces_1.CheckerModuleIOStyleOptions }
            }
        } }),
    deco_api_1.io.all
], CheckerModuleIfModel.prototype, "operations", void 0);
CheckerModuleIfModel = __decorate([
    deco_api_1.model('checker_module')
], CheckerModuleIfModel);
exports.CheckerModuleIfModel = CheckerModuleIfModel;
//# sourceMappingURL=checker-module-if.model.js.map