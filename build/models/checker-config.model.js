"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThreeCheckerConfigModel = void 0;
const site_model_1 = require("./site.model");
const deco_api_1 = require("deco-api");
let debug = require('debug')('app:models:three:checker-config');
let ThreeCheckerConfigModel = class ThreeCheckerConfigModel extends deco_api_1.Model {
    constructor() {
        super(...arguments);
        this.conditions = [];
        this.operationSettings = {};
        this.metadata = [];
    }
};
__decorate([
    deco_api_1.type.id
], ThreeCheckerConfigModel.prototype, "_id", void 0);
__decorate([
    deco_api_1.type.model({ model: deco_api_1.AppModel }),
    deco_api_1.io.input,
    deco_api_1.io.toDocument,
    deco_api_1.query.filterable(),
    deco_api_1.validate.required,
    deco_api_1.mongo.index({ type: 'single' })
], ThreeCheckerConfigModel.prototype, "appId", void 0);
__decorate([
    deco_api_1.type.model({ model: site_model_1.ThreeSiteModel }),
    deco_api_1.io.all,
    deco_api_1.query.filterable(),
    deco_api_1.validate.required,
    deco_api_1.mongo.index({ type: 'single' })
], ThreeCheckerConfigModel.prototype, "siteId", void 0);
__decorate([
    deco_api_1.type.string,
    deco_api_1.io.all,
    deco_api_1.query.filterable({ type: 'text' }),
    deco_api_1.validate.required
], ThreeCheckerConfigModel.prototype, "name", void 0);
__decorate([
    deco_api_1.type.string,
    deco_api_1.io.all
], ThreeCheckerConfigModel.prototype, "description", void 0);
__decorate([
    deco_api_1.type.array({ type: 'object', options: { keys: {
                key: { type: 'string' },
                operator: { type: 'select', options: ['=', '<', '>', '!=', '*'] },
                value: { type: 'any' }
            } } }),
    deco_api_1.io.all
], ThreeCheckerConfigModel.prototype, "conditions", void 0);
__decorate([
    deco_api_1.type.select({ options: ['count', 'compare-key-value', 'add-key-value'] }),
    deco_api_1.io.all
], ThreeCheckerConfigModel.prototype, "operation", void 0);
__decorate([
    deco_api_1.type.any,
    deco_api_1.io.all
], ThreeCheckerConfigModel.prototype, "operationSettings", void 0);
__decorate([
    deco_api_1.type.metadata,
    deco_api_1.io.all
], ThreeCheckerConfigModel.prototype, "metadata", void 0);
ThreeCheckerConfigModel = __decorate([
    deco_api_1.model('checker_config')
], ThreeCheckerConfigModel);
exports.ThreeCheckerConfigModel = ThreeCheckerConfigModel;
//# sourceMappingURL=checker-config.model.js.map