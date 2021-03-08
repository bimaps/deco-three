"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThreeStoreyModel = void 0;
const building_model_1 = require("./building.model");
const site_model_1 = require("./site.model");
const deco_api_1 = require("deco-api");
let debug = require('debug')('app:models:three:storey');
let ThreeStoreyModel = class ThreeStoreyModel extends deco_api_1.Model {
    constructor() {
        super(...arguments);
        this.metadata = [];
    }
};
__decorate([
    deco_api_1.type.id
], ThreeStoreyModel.prototype, "_id", void 0);
__decorate([
    deco_api_1.type.model({ model: deco_api_1.AppModel }),
    deco_api_1.io.input,
    deco_api_1.io.toDocument,
    deco_api_1.query.filterable(),
    deco_api_1.validate.required,
    deco_api_1.mongo.index({ type: 'single' })
], ThreeStoreyModel.prototype, "appId", void 0);
__decorate([
    deco_api_1.type.model({ model: site_model_1.ThreeSiteModel }),
    deco_api_1.io.output,
    deco_api_1.io.toDocument,
    deco_api_1.query.filterable(),
    deco_api_1.validate.required,
    deco_api_1.mongo.index({ type: 'single' })
], ThreeStoreyModel.prototype, "siteId", void 0);
__decorate([
    deco_api_1.type.model({ model: building_model_1.ThreeBuildingModel }),
    deco_api_1.io.all,
    deco_api_1.query.filterable(),
    deco_api_1.validate.required,
    deco_api_1.mongo.index({ type: 'single' })
], ThreeStoreyModel.prototype, "buildingId", void 0);
__decorate([
    deco_api_1.type.string,
    deco_api_1.io.all
], ThreeStoreyModel.prototype, "ifcStoreyId", void 0);
__decorate([
    deco_api_1.type.string,
    deco_api_1.io.output,
    deco_api_1.io.toDocument,
    deco_api_1.query.filterable({ type: 'text' })
], ThreeStoreyModel.prototype, "importId", void 0);
__decorate([
    deco_api_1.type.string,
    deco_api_1.io.all,
    deco_api_1.query.filterable({ type: 'text' })
], ThreeStoreyModel.prototype, "name", void 0);
__decorate([
    deco_api_1.type.array({ type: 'float' }),
    deco_api_1.io.all
], ThreeStoreyModel.prototype, "location", void 0);
__decorate([
    deco_api_1.type.array({ type: 'float' }),
    deco_api_1.io.all
], ThreeStoreyModel.prototype, "refDirection", void 0);
__decorate([
    deco_api_1.type.array({ type: 'float' }),
    deco_api_1.io.all
], ThreeStoreyModel.prototype, "axis", void 0);
__decorate([
    deco_api_1.type.object({ allowOtherKeys: true }),
    deco_api_1.io.all,
    deco_api_1.query.filterable()
], ThreeStoreyModel.prototype, "userData", void 0);
__decorate([
    deco_api_1.type.metadata,
    deco_api_1.io.all
], ThreeStoreyModel.prototype, "metadata", void 0);
ThreeStoreyModel = __decorate([
    deco_api_1.model('three_storey')
], ThreeStoreyModel);
exports.ThreeStoreyModel = ThreeStoreyModel;
//# sourceMappingURL=storey.model.js.map