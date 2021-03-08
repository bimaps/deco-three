"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThreeThemeModel = void 0;
const site_model_1 = require("./site.model");
const deco_api_1 = require("deco-api");
let debug = require('debug')('app:models:three:theme');
let ThreeThemeModel = class ThreeThemeModel extends deco_api_1.Model {
    constructor() {
        super(...arguments);
        this.rules = [];
        this.spaceHeight = 0; // 0 => real height from data
    }
};
__decorate([
    deco_api_1.type.id
], ThreeThemeModel.prototype, "_id", void 0);
__decorate([
    deco_api_1.type.model({ model: deco_api_1.AppModel }),
    deco_api_1.io.input,
    deco_api_1.io.toDocument,
    deco_api_1.query.filterable(),
    deco_api_1.validate.required,
    deco_api_1.mongo.index({ type: 'single' })
], ThreeThemeModel.prototype, "appId", void 0);
__decorate([
    deco_api_1.type.model({ model: site_model_1.ThreeSiteModel }),
    deco_api_1.io.input,
    deco_api_1.io.toDocument,
    deco_api_1.query.filterable(),
    deco_api_1.validate.required,
    deco_api_1.mongo.index({ type: 'single' })
], ThreeThemeModel.prototype, "siteId", void 0);
__decorate([
    deco_api_1.type.string,
    deco_api_1.io.all,
    deco_api_1.validate.required
], ThreeThemeModel.prototype, "name", void 0);
__decorate([
    deco_api_1.type.array(),
    deco_api_1.io.all
], ThreeThemeModel.prototype, "rules", void 0);
__decorate([
    deco_api_1.type.float,
    deco_api_1.io.all
], ThreeThemeModel.prototype, "spaceHeight", void 0);
ThreeThemeModel = __decorate([
    deco_api_1.model('three_theme')
], ThreeThemeModel);
exports.ThreeThemeModel = ThreeThemeModel;
//# sourceMappingURL=theme.model.js.map