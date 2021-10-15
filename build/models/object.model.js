"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThreeObjectModel = void 0;
const space_model_1 = require("./space.model");
const storey_model_1 = require("./storey.model");
const building_model_1 = require("./building.model");
const site_model_1 = require("./site.model");
const deco_api_1 = require("deco-api");
let debug = require('debug')('app:models:three:object');
let ThreeObjectModel = class ThreeObjectModel extends deco_api_1.Model {
    constructor() {
        super(...arguments);
        this.documents = [];
    }
};
__decorate([
    deco_api_1.type.id
], ThreeObjectModel.prototype, "_id", void 0);
__decorate([
    deco_api_1.type.model({ model: deco_api_1.AppModel }),
    deco_api_1.io.input,
    deco_api_1.io.toDocument,
    deco_api_1.query.filterable(),
    deco_api_1.validate.required,
    deco_api_1.mongo.index({ type: 'single' })
], ThreeObjectModel.prototype, "appId", void 0);
__decorate([
    deco_api_1.type.model({ model: site_model_1.ThreeSiteModel }),
    deco_api_1.io.output,
    deco_api_1.io.toDocument,
    deco_api_1.query.filterable(),
    deco_api_1.validate.required,
    deco_api_1.mongo.index({ type: 'single' })
], ThreeObjectModel.prototype, "siteId", void 0);
__decorate([
    deco_api_1.type.model({ model: building_model_1.ThreeBuildingModel }),
    deco_api_1.io.all,
    deco_api_1.query.filterable()
], ThreeObjectModel.prototype, "buildingId", void 0);
__decorate([
    deco_api_1.type.models({ model: storey_model_1.ThreeStoreyModel }),
    deco_api_1.io.all,
    deco_api_1.query.filterable()
], ThreeObjectModel.prototype, "storeys", void 0);
__decorate([
    deco_api_1.type.model({ model: space_model_1.ThreeSpaceModel }),
    deco_api_1.io.all,
    deco_api_1.query.filterable()
], ThreeObjectModel.prototype, "spaceId", void 0);
__decorate([
    deco_api_1.type.string,
    deco_api_1.io.output,
    deco_api_1.io.toDocument,
    deco_api_1.query.filterable({ type: 'text' })
], ThreeObjectModel.prototype, "importId", void 0);
__decorate([
    deco_api_1.type.string,
    deco_api_1.io.all
], ThreeObjectModel.prototype, "formatVersion", void 0);
__decorate([
    deco_api_1.type.string,
    deco_api_1.io.all,
    deco_api_1.query.filterable({ type: 'text' })
], ThreeObjectModel.prototype, "uuid", void 0);
__decorate([
    deco_api_1.type.string,
    deco_api_1.io.all,
    deco_api_1.query.filterable({ type: 'text' })
], ThreeObjectModel.prototype, "name", void 0);
__decorate([
    deco_api_1.type.string,
    deco_api_1.io.all,
    deco_api_1.query.filterable({ type: 'text' })
], ThreeObjectModel.prototype, "type", void 0);
__decorate([
    deco_api_1.type.object({ allowOtherKeys: true }),
    deco_api_1.io.all
], ThreeObjectModel.prototype, "matrix", void 0);
__decorate([
    deco_api_1.type.any(),
    deco_api_1.io.all,
    deco_api_1.query.filterable({ type: 'text' })
], ThreeObjectModel.prototype, "material", void 0);
__decorate([
    deco_api_1.type.any(),
    deco_api_1.io.all,
    deco_api_1.query.filterable({ type: 'text' })
], ThreeObjectModel.prototype, "geometry", void 0);
__decorate([
    deco_api_1.type.integer,
    deco_api_1.io.all
], ThreeObjectModel.prototype, "layers", void 0);
__decorate([
    deco_api_1.type.integer,
    deco_api_1.io.all
], ThreeObjectModel.prototype, "color", void 0);
__decorate([
    deco_api_1.type.integer,
    deco_api_1.io.all
], ThreeObjectModel.prototype, "intensity", void 0);
__decorate([
    deco_api_1.type.object({ allowOtherKeys: true }),
    deco_api_1.io.all,
    deco_api_1.query.filterable()
], ThreeObjectModel.prototype, "userData", void 0);
__decorate([
    deco_api_1.type.array(),
    deco_api_1.io.all,
    deco_api_1.query.filterable()
], ThreeObjectModel.prototype, "childrenIds", void 0);
__decorate([
    deco_api_1.type.id,
    deco_api_1.io.all,
    deco_api_1.query.filterable()
], ThreeObjectModel.prototype, "parentId", void 0);
__decorate([
    deco_api_1.type.boolean,
    deco_api_1.io.all,
    deco_api_1.query.filterable()
], ThreeObjectModel.prototype, "visible", void 0);
__decorate([
    deco_api_1.type.object({ keys: {
            x: { type: 'float', required: true },
            y: { type: 'float', required: true },
            z: { type: 'float', required: true }
        }, allowOtherKeys: true }),
    deco_api_1.io.input,
    deco_api_1.io.toDocument,
    deco_api_1.io.output,
    deco_api_1.query.filterable()
], ThreeObjectModel.prototype, "_min", void 0);
__decorate([
    deco_api_1.type.object({ keys: {
            x: { type: 'float', required: true },
            y: { type: 'float', required: true },
            z: { type: 'float', required: true },
        }, allowOtherKeys: true }),
    deco_api_1.io.input,
    deco_api_1.io.toDocument,
    deco_api_1.io.output,
    deco_api_1.query.filterable()
], ThreeObjectModel.prototype, "_max", void 0);
__decorate([
    deco_api_1.type.files({ accepted: 'image/*,application/pdf' }),
    deco_api_1.io.all
], ThreeObjectModel.prototype, "documents", void 0);
ThreeObjectModel = __decorate([
    deco_api_1.mongo.collectionIndex({ type: 'text', properties: ['uuid', 'material'] }),
    deco_api_1.model('three_object')
], ThreeObjectModel);
exports.ThreeObjectModel = ThreeObjectModel;
//# sourceMappingURL=object.model.js.map