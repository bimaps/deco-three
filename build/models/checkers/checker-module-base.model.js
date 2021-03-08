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
exports.CheckerModuleBaseModel = void 0;
const checker_internals_1 = require("./checker-internals");
const deco_api_1 = require("deco-api");
let debug = require('debug')('app:models:three:checker:module-base');
let CheckerModuleBaseModel = class CheckerModuleBaseModel extends deco_api_1.Model {
    constructor() {
        super(...arguments);
        this.outputStyle = 'default';
    }
    process(flow) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.inputVarName) {
                throw new Error('Missing inputVarName');
            }
            const inputValueType = flow.fetchInput(this.inputVarName);
            if (!inputValueType) {
                throw new Error('Input requested not found');
            }
            if (!((_a = this.allowedInputTypes) === null || _a === void 0 ? void 0 : _a.includes(inputValueType.type))) {
                throw new Error('Invalid input type');
            }
            this.currentInput = inputValueType.value;
            this.currentInputType = inputValueType.type;
            this.currentInputRef = inputValueType.ref;
        });
    }
    summary() {
        return __awaiter(this, void 0, void 0, function* () {
            this.outputSummary = '';
        });
    }
    static instanceFromDocument(document, options = { keepCopyOriginalValues: false }) {
        const _super = Object.create(null, {
            instanceFromDocument: { get: () => super.instanceFromDocument }
        });
        return __awaiter(this, void 0, void 0, function* () {
            if (document.__checkerModuleInstanceDefined) {
                return (yield _super.instanceFromDocument.call(this, document, options));
            }
            const model = checker_internals_1.modelsByType[document === null || document === void 0 ? void 0 : document.moduleType];
            if (!model) {
                throw new Error('Invalid module type');
            }
            document.__checkerModuleInstanceDefined = true;
            const instance = yield model.instanceFromDocument(document, options);
            return instance;
        });
    }
    static instanceFromRequest(req, res) {
        const _super = Object.create(null, {
            instanceFromRequest: { get: () => super.instanceFromRequest }
        });
        return __awaiter(this, void 0, void 0, function* () {
            if (res.locals.__checkerModuleInstanceDefined) {
                return (yield _super.instanceFromRequest.call(this, req, res));
            }
            const model = checker_internals_1.modelsByType[req.body.moduleType];
            if (!model) {
                throw new Error('Invalid module type');
            }
            res.locals.__checkerModuleInstanceDefined = true;
            const instance = yield model.instanceFromRequest(req, res);
            return instance;
        });
    }
};
CheckerModuleBaseModel = __decorate([
    deco_api_1.model('checker_module')
], CheckerModuleBaseModel);
exports.CheckerModuleBaseModel = CheckerModuleBaseModel;
//# sourceMappingURL=checker-module-base.model.js.map