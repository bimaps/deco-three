"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThreeStyleModel = void 0;
const site_model_1 = require("./site.model");
const deco_api_1 = require("deco-api");
let debug = require('debug')('app:models:three:style');
let ThreeStyleModel = class ThreeStyleModel extends deco_api_1.Model {
    constructor() {
        super(...arguments);
        this.labelScale = 1;
        this.labelCentroidMethod = 'auto';
        this.iconCentroidMethod = 'auto';
    }
};
__decorate([
    deco_api_1.type.id
], ThreeStyleModel.prototype, "_id", void 0);
__decorate([
    deco_api_1.type.model({ model: deco_api_1.AppModel }),
    deco_api_1.io.input,
    deco_api_1.io.toDocument,
    deco_api_1.query.filterable(),
    deco_api_1.validate.required,
    deco_api_1.mongo.index({ type: 'single' })
], ThreeStyleModel.prototype, "appId", void 0);
__decorate([
    deco_api_1.type.model({ model: site_model_1.ThreeSiteModel }),
    deco_api_1.io.input,
    deco_api_1.io.toDocument,
    deco_api_1.query.filterable(),
    deco_api_1.validate.required,
    deco_api_1.mongo.index({ type: 'single' })
], ThreeStyleModel.prototype, "siteId", void 0);
__decorate([
    deco_api_1.type.string,
    deco_api_1.io.all,
    deco_api_1.validate.required
], ThreeStyleModel.prototype, "name", void 0);
__decorate([
    deco_api_1.type.boolean,
    deco_api_1.io.all
], ThreeStyleModel.prototype, "display", void 0);
__decorate([
    deco_api_1.type.string,
    deco_api_1.io.all
], ThreeStyleModel.prototype, "color", void 0);
__decorate([
    deco_api_1.type.select({ options: ['original', 'basic', 'phong', 'texture'] }),
    deco_api_1.io.all
], ThreeStyleModel.prototype, "material", void 0);
__decorate([
    deco_api_1.type.file({ accept: ['image/*'] }),
    deco_api_1.io.all
], ThreeStyleModel.prototype, "image", void 0);
__decorate([
    deco_api_1.type.float,
    deco_api_1.io.all
], ThreeStyleModel.prototype, "opacity", void 0);
__decorate([
    deco_api_1.type.integer,
    deco_api_1.io.all
], ThreeStyleModel.prototype, "renderOrder", void 0);
__decorate([
    deco_api_1.type.boolean,
    deco_api_1.io.all
], ThreeStyleModel.prototype, "displayLabel", void 0);
__decorate([
    deco_api_1.type.string,
    deco_api_1.io.all
], ThreeStyleModel.prototype, "labelKey", void 0);
__decorate([
    deco_api_1.type.string,
    deco_api_1.io.all
], ThreeStyleModel.prototype, "labelTemplate", void 0);
__decorate([
    deco_api_1.type.string,
    deco_api_1.io.all
], ThreeStyleModel.prototype, "labelBackgroundColor", void 0);
__decorate([
    deco_api_1.type.string,
    deco_api_1.io.all
], ThreeStyleModel.prototype, "labelTextColor", void 0);
__decorate([
    deco_api_1.type.float,
    deco_api_1.io.all
], ThreeStyleModel.prototype, "labelScale", void 0);
__decorate([
    deco_api_1.type.select({ options: ['auto', 'bbox', 'polylabel'] }),
    deco_api_1.io.all
], ThreeStyleModel.prototype, "labelCentroidMethod", void 0);
__decorate([
    deco_api_1.type.object({ keys: {
            x: { type: 'float' },
            y: { type: 'float' },
            z: { type: 'float' },
        }, allowOtherKeys: true }),
    deco_api_1.io.all
], ThreeStyleModel.prototype, "labelPosition", void 0);
__decorate([
    deco_api_1.type.float,
    deco_api_1.io.all
], ThreeStyleModel.prototype, "labelOpacity", void 0);
__decorate([
    deco_api_1.type.boolean,
    deco_api_1.io.all
], ThreeStyleModel.prototype, "icon", void 0);
__decorate([
    deco_api_1.type.string,
    deco_api_1.io.all
], ThreeStyleModel.prototype, "iconKey", void 0);
__decorate([
    deco_api_1.type.string,
    deco_api_1.io.all
], ThreeStyleModel.prototype, "iconDefault", void 0);
__decorate([
    deco_api_1.type.string,
    deco_api_1.io.all
], ThreeStyleModel.prototype, "iconBackground", void 0);
__decorate([
    deco_api_1.type.string,
    deco_api_1.io.all
], ThreeStyleModel.prototype, "iconForeground", void 0);
__decorate([
    deco_api_1.type.float,
    deco_api_1.io.all
], ThreeStyleModel.prototype, "iconScale", void 0);
__decorate([
    deco_api_1.type.select({ options: ['auto', 'bbox', 'polylabel'] }),
    deco_api_1.io.all
], ThreeStyleModel.prototype, "iconCentroidMethod", void 0);
__decorate([
    deco_api_1.type.object({ keys: {
            x: { type: 'float' },
            y: { type: 'float' },
            z: { type: 'float' },
        }, allowOtherKeys: true }),
    deco_api_1.io.all
], ThreeStyleModel.prototype, "iconPosition", void 0);
__decorate([
    deco_api_1.type.float,
    deco_api_1.io.all
], ThreeStyleModel.prototype, "iconOpacity", void 0);
__decorate([
    deco_api_1.type.boolean,
    deco_api_1.io.all
], ThreeStyleModel.prototype, "replaceGeometry", void 0);
__decorate([
    deco_api_1.type.select({ options: ['cone', 'sphere', 'cube', 'cylinder'] }),
    deco_api_1.io.all
], ThreeStyleModel.prototype, "geometryShape", void 0);
__decorate([
    deco_api_1.type.float,
    deco_api_1.io.all
], ThreeStyleModel.prototype, "geometryScale", void 0);
__decorate([
    deco_api_1.type.object({ keys: {
            x: { type: 'float' },
            y: { type: 'float' },
            z: { type: 'float' },
        }, allowOtherKeys: true }),
    deco_api_1.io.all
], ThreeStyleModel.prototype, "geometryPosition", void 0);
__decorate([
    deco_api_1.type.object({ keys: {
            x: { type: 'float' },
            y: { type: 'float' },
            z: { type: 'float' },
        } }),
    deco_api_1.io.all
], ThreeStyleModel.prototype, "geometryRotation", void 0);
__decorate([
    deco_api_1.type.boolean,
    deco_api_1.io.all
], ThreeStyleModel.prototype, "edgesDisplay", void 0);
ThreeStyleModel = __decorate([
    deco_api_1.model('three_style')
], ThreeStyleModel);
exports.ThreeStyleModel = ThreeStyleModel;
//# sourceMappingURL=style.model.js.map