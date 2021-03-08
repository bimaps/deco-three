"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var ThreeMaterialModel_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThreeMaterialModel = void 0;
const site_model_1 = require("./site.model");
const deco_api_1 = require("deco-api");
let debug = require('debug')('app:models:three:material');
let ThreeMaterialModel = ThreeMaterialModel_1 = class ThreeMaterialModel extends deco_api_1.Model {
    constructor() {
        super(...arguments);
        this.transparent = false;
    }
    static uniqueHashFromData(data, ignoreNameInMaterialId = false) {
        let values = [];
        for (let key in ThreeMaterialModel_1.deco.propertyTypes) {
            if (key === 'name' && ignoreNameInMaterialId) {
                continue;
            }
            values.push(data[key]);
        }
        return values.join('-');
    }
};
__decorate([
    deco_api_1.type.id
], ThreeMaterialModel.prototype, "_id", void 0);
__decorate([
    deco_api_1.type.model({ model: deco_api_1.AppModel }),
    deco_api_1.io.input,
    deco_api_1.io.toDocument,
    deco_api_1.query.filterable(),
    deco_api_1.validate.required,
    deco_api_1.mongo.index({ type: 'single' })
], ThreeMaterialModel.prototype, "appId", void 0);
__decorate([
    deco_api_1.type.model({ model: site_model_1.ThreeSiteModel }),
    deco_api_1.io.output,
    deco_api_1.io.toDocument,
    deco_api_1.query.filterable(),
    deco_api_1.validate.required,
    deco_api_1.mongo.index({ type: 'single' })
], ThreeMaterialModel.prototype, "siteId", void 0);
__decorate([
    deco_api_1.type.string,
    deco_api_1.io.toDocument,
    deco_api_1.io.output
], ThreeMaterialModel.prototype, "importId", void 0);
__decorate([
    deco_api_1.type.string,
    deco_api_1.io.all
], ThreeMaterialModel.prototype, "formatVersion", void 0);
__decorate([
    deco_api_1.type.string,
    deco_api_1.io.all,
    deco_api_1.query.filterable('text')
], ThreeMaterialModel.prototype, "uuid", void 0);
__decorate([
    deco_api_1.type.string,
    deco_api_1.io.all,
    deco_api_1.query.filterable('text')
], ThreeMaterialModel.prototype, "name", void 0);
__decorate([
    deco_api_1.type.string,
    deco_api_1.io.all
], ThreeMaterialModel.prototype, "type", void 0);
__decorate([
    deco_api_1.type.any,
    deco_api_1.io.all
], ThreeMaterialModel.prototype, "color", void 0);
__decorate([
    deco_api_1.type.any,
    deco_api_1.io.all
], ThreeMaterialModel.prototype, "ambient", void 0);
__decorate([
    deco_api_1.type.any,
    deco_api_1.io.all
], ThreeMaterialModel.prototype, "emissive", void 0);
__decorate([
    deco_api_1.type.any,
    deco_api_1.io.all
], ThreeMaterialModel.prototype, "specular", void 0);
__decorate([
    deco_api_1.type.float,
    deco_api_1.io.all
], ThreeMaterialModel.prototype, "shininess", void 0);
__decorate([
    deco_api_1.type.any,
    deco_api_1.io.all
], ThreeMaterialModel.prototype, "roughness", void 0);
__decorate([
    deco_api_1.type.any,
    deco_api_1.io.all
], ThreeMaterialModel.prototype, "metalness", void 0);
__decorate([
    deco_api_1.type.float,
    deco_api_1.io.all
], ThreeMaterialModel.prototype, "opacity", void 0);
__decorate([
    deco_api_1.type.boolean,
    deco_api_1.io.all
], ThreeMaterialModel.prototype, "transparent", void 0);
__decorate([
    deco_api_1.type.any,
    deco_api_1.io.all
], ThreeMaterialModel.prototype, "side", void 0);
__decorate([
    deco_api_1.type.any,
    deco_api_1.io.all
], ThreeMaterialModel.prototype, "children", void 0);
__decorate([
    deco_api_1.type.any,
    deco_api_1.io.all
], ThreeMaterialModel.prototype, "depthFunc", void 0);
__decorate([
    deco_api_1.type.boolean,
    deco_api_1.io.all
], ThreeMaterialModel.prototype, "depthTest", void 0);
__decorate([
    deco_api_1.type.boolean,
    deco_api_1.io.all
], ThreeMaterialModel.prototype, "depthWrite", void 0);
__decorate([
    deco_api_1.type.boolean,
    deco_api_1.io.all
], ThreeMaterialModel.prototype, "stencilWrite", void 0);
__decorate([
    deco_api_1.type.integer,
    deco_api_1.io.all
], ThreeMaterialModel.prototype, "stencilFunc", void 0);
__decorate([
    deco_api_1.type.integer,
    deco_api_1.io.all
], ThreeMaterialModel.prototype, "stencilRef", void 0);
__decorate([
    deco_api_1.type.integer,
    deco_api_1.io.all
], ThreeMaterialModel.prototype, "stencilMask", void 0);
__decorate([
    deco_api_1.type.integer,
    deco_api_1.io.all
], ThreeMaterialModel.prototype, "stencilFail", void 0);
__decorate([
    deco_api_1.type.integer,
    deco_api_1.io.all
], ThreeMaterialModel.prototype, "stencilZFail", void 0);
__decorate([
    deco_api_1.type.integer,
    deco_api_1.io.all
], ThreeMaterialModel.prototype, "stencilZPass", void 0);
__decorate([
    deco_api_1.type.object({ allowOtherKeys: true }),
    deco_api_1.io.all
], ThreeMaterialModel.prototype, "userData", void 0);
ThreeMaterialModel = ThreeMaterialModel_1 = __decorate([
    deco_api_1.model('three_material')
], ThreeMaterialModel);
exports.ThreeMaterialModel = ThreeMaterialModel;
//# sourceMappingURL=material.model.js.map