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
exports.CheckerModuleFilterModel = void 0;
const checker_internals_1 = require("./checker-internals");
const checker_internals_2 = require("./checker-internals");
const site_model_1 = require("../site.model");
const deco_api_1 = require("deco-api");
let debug = require('debug')('app:models:three:checker:module-filter');
let CheckerModuleFilterModel = class CheckerModuleFilterModel extends checker_internals_1.CheckerModuleBaseModel {
    constructor() {
        super(...arguments);
        this.allowedInputTypes = ['three-objects', 'scene'];
        this.moduleType = 'filter';
        this.name = '';
        this.outputType = 'three-objects';
        this.conditionsOperator = 'and';
        this.inputObjects = [];
    }
    process(flow) {
        const _super = Object.create(null, {
            process: { get: () => super.process }
        });
        return __awaiter(this, void 0, void 0, function* () {
            _super.process.call(this, flow);
            if (this.currentInput && this.currentInputType === 'three-objects') {
                this.inputObjects = this.currentInput;
                // process filtering
            }
            else if (this.currentInput && this.currentInputType === 'scene') {
                this.inputObjects = [];
                flow.scene.traverse((obj) => {
                    this.inputObjects.push(obj);
                });
            }
            else {
                throw new Error('Invalid filter input');
            }
            const output = [];
            for (const object of this.inputObjects) {
                let keep = false;
                for (let condition of this.conditions) {
                    keep = flow.compareObject(object, condition);
                    if (keep && this.conditionsOperator === 'or') {
                        break;
                    }
                    if (!keep && this.conditionsOperator === 'and') {
                        break;
                    }
                }
                if (keep) {
                    output.push(object);
                }
            }
            this.outputType = 'three-objects';
            this.outputValue = output;
        });
    }
    summary() {
        return __awaiter(this, void 0, void 0, function* () {
            if (Array.isArray(this.outputValue)) {
                this.outputSummary = `${this.outputValue.length} elements`;
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
], CheckerModuleFilterModel.prototype, "_id", void 0);
__decorate([
    deco_api_1.type.model({ model: deco_api_1.AppModel }),
    deco_api_1.io.input,
    deco_api_1.io.toDocument,
    deco_api_1.query.filterable(),
    deco_api_1.validate.required,
    deco_api_1.mongo.index({ type: 'single' })
], CheckerModuleFilterModel.prototype, "appId", void 0);
__decorate([
    deco_api_1.type.model({ model: site_model_1.ThreeSiteModel }),
    deco_api_1.io.all,
    deco_api_1.query.filterable(),
    deco_api_1.validate.required,
    deco_api_1.mongo.index({ type: 'single' })
], CheckerModuleFilterModel.prototype, "siteId", void 0);
__decorate([
    deco_api_1.type.select({ options: checker_internals_1.CheckerModuleIOTypeOptions, multiple: true }),
    deco_api_1.io.toDocument,
    deco_api_1.io.output
], CheckerModuleFilterModel.prototype, "allowedInputTypes", void 0);
__decorate([
    deco_api_1.type.select({ options: checker_internals_2.CheckerModuleTypeOptions }),
    deco_api_1.io.toDocument,
    deco_api_1.io.output,
    deco_api_1.validate.required
], CheckerModuleFilterModel.prototype, "moduleType", void 0);
__decorate([
    deco_api_1.type.string,
    deco_api_1.io.all
], CheckerModuleFilterModel.prototype, "name", void 0);
__decorate([
    deco_api_1.type.string,
    deco_api_1.io.all,
    deco_api_1.validate.required
], CheckerModuleFilterModel.prototype, "inputVarName", void 0);
__decorate([
    deco_api_1.type.string,
    deco_api_1.io.all,
    deco_api_1.validate.required
], CheckerModuleFilterModel.prototype, "outputVarName", void 0);
__decorate([
    deco_api_1.type.select({ options: checker_internals_1.CheckerModuleIOTypeOptions, multiple: false }),
    deco_api_1.io.toDocument,
    deco_api_1.io.output
], CheckerModuleFilterModel.prototype, "outputType", void 0);
__decorate([
    deco_api_1.type.string,
    deco_api_1.io.toDocument,
    deco_api_1.io.output
], CheckerModuleFilterModel.prototype, "outputSummary", void 0);
__decorate([
    deco_api_1.type.array({
        type: 'object',
        options: {
            keys: {
                key: { type: 'string' },
                operation: { type: 'string' },
                value: { type: 'string' }
            }
        }
    }),
    deco_api_1.io.all
], CheckerModuleFilterModel.prototype, "conditions", void 0);
__decorate([
    deco_api_1.type.select({ options: ['or', 'and'] }),
    deco_api_1.io.all
], CheckerModuleFilterModel.prototype, "conditionsOperator", void 0);
CheckerModuleFilterModel = __decorate([
    deco_api_1.model('checker_module')
], CheckerModuleFilterModel);
exports.CheckerModuleFilterModel = CheckerModuleFilterModel;
//# sourceMappingURL=checker-module-filter.model.js.map