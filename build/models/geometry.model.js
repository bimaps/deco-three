"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThreeGeometryModel = void 0;
const site_model_1 = require("./site.model");
const deco_api_1 = require("deco-api");
let debug = require('debug')('app:models:three:geometry');
let ThreeGeometryModel = class ThreeGeometryModel extends deco_api_1.Model {
};
__decorate([
    deco_api_1.type.id
], ThreeGeometryModel.prototype, "_id", void 0);
__decorate([
    deco_api_1.type.model({ model: deco_api_1.AppModel }),
    deco_api_1.io.input,
    deco_api_1.io.toDocument,
    deco_api_1.query.filterable(),
    deco_api_1.validate.required,
    deco_api_1.mongo.index({ type: 'single' })
], ThreeGeometryModel.prototype, "appId", void 0);
__decorate([
    deco_api_1.type.model({ model: site_model_1.ThreeSiteModel }),
    deco_api_1.io.output,
    deco_api_1.io.toDocument,
    deco_api_1.query.filterable(),
    deco_api_1.validate.required,
    deco_api_1.mongo.index({ type: 'single' })
], ThreeGeometryModel.prototype, "siteId", void 0);
__decorate([
    deco_api_1.type.string,
    deco_api_1.io.output,
    deco_api_1.io.toDocument
], ThreeGeometryModel.prototype, "importId", void 0);
__decorate([
    deco_api_1.type.string,
    deco_api_1.io.all
], ThreeGeometryModel.prototype, "formatVersion", void 0);
__decorate([
    deco_api_1.type.string,
    deco_api_1.io.all,
    deco_api_1.query.filterable({ type: 'categories', ObjectId: false })
], ThreeGeometryModel.prototype, "uuid", void 0);
__decorate([
    deco_api_1.type.string,
    deco_api_1.io.all
], ThreeGeometryModel.prototype, "type", void 0);
__decorate([
    deco_api_1.type.array({ type: 'object', options: {
            keys: {
                x: { type: 'float', required: true },
                y: { type: 'float', required: true },
                z: { type: 'float', required: true }
            }
        }, allowOtherKeys: true }),
    deco_api_1.io.all
], ThreeGeometryModel.prototype, "vertices", void 0);
__decorate([
    deco_api_1.type.array({ type: 'any' }),
    deco_api_1.io.all
], ThreeGeometryModel.prototype, "colors", void 0);
__decorate([
    deco_api_1.type.array({ type: 'any' }),
    deco_api_1.io.all
], ThreeGeometryModel.prototype, "faces", void 0);
__decorate([
    deco_api_1.type.any,
    deco_api_1.io.all
], ThreeGeometryModel.prototype, "faceVertexUvs", void 0);
__decorate([
    deco_api_1.type.any,
    deco_api_1.io.all
], ThreeGeometryModel.prototype, "morphTargets", void 0);
__decorate([
    deco_api_1.type.any,
    deco_api_1.io.all
], ThreeGeometryModel.prototype, "morphNormals", void 0);
__decorate([
    deco_api_1.type.any,
    deco_api_1.io.all
], ThreeGeometryModel.prototype, "skinWeights", void 0);
__decorate([
    deco_api_1.type.any,
    deco_api_1.io.all
], ThreeGeometryModel.prototype, "skinIndices", void 0);
__decorate([
    deco_api_1.type.any,
    deco_api_1.io.all
], ThreeGeometryModel.prototype, "lineDistances", void 0);
__decorate([
    deco_api_1.type.any,
    deco_api_1.io.all
], ThreeGeometryModel.prototype, "boundingBox", void 0);
__decorate([
    deco_api_1.type.any,
    deco_api_1.io.all
], ThreeGeometryModel.prototype, "boundingSphere", void 0);
__decorate([
    deco_api_1.type.any,
    deco_api_1.io.all
], ThreeGeometryModel.prototype, "index", void 0);
__decorate([
    deco_api_1.type.any,
    deco_api_1.io.all
], ThreeGeometryModel.prototype, "attributes", void 0);
__decorate([
    deco_api_1.type.any,
    deco_api_1.io.all
], ThreeGeometryModel.prototype, "morphAttributes", void 0);
__decorate([
    deco_api_1.type.any,
    deco_api_1.io.all
], ThreeGeometryModel.prototype, "groups", void 0);
__decorate([
    deco_api_1.type.any,
    deco_api_1.io.all
], ThreeGeometryModel.prototype, "drawRange", void 0);
__decorate([
    deco_api_1.type.object({ allowOtherKeys: true }),
    deco_api_1.io.all
], ThreeGeometryModel.prototype, "userData", void 0);
__decorate([
    deco_api_1.type.boolean,
    deco_api_1.io.all
], ThreeGeometryModel.prototype, "isBufferGeometry", void 0);
__decorate([
    deco_api_1.type.any,
    deco_api_1.io.all
], ThreeGeometryModel.prototype, "data", void 0);
__decorate([
    deco_api_1.type.any,
    deco_api_1.io.all
], ThreeGeometryModel.prototype, "scale", void 0);
__decorate([
    deco_api_1.type.any,
    deco_api_1.io.all
], ThreeGeometryModel.prototype, "visible", void 0);
__decorate([
    deco_api_1.type.any,
    deco_api_1.io.all
], ThreeGeometryModel.prototype, "castShadow", void 0);
__decorate([
    deco_api_1.type.any,
    deco_api_1.io.all
], ThreeGeometryModel.prototype, "receiveShadow", void 0);
__decorate([
    deco_api_1.type.any,
    deco_api_1.io.all
], ThreeGeometryModel.prototype, "doubleSided", void 0);
__decorate([
    deco_api_1.type.float,
    deco_api_1.io.all
], ThreeGeometryModel.prototype, "radius", void 0);
__decorate([
    deco_api_1.type.float,
    deco_api_1.io.all
], ThreeGeometryModel.prototype, "radiusTop", void 0);
__decorate([
    deco_api_1.type.float,
    deco_api_1.io.all
], ThreeGeometryModel.prototype, "radiusBottom", void 0);
__decorate([
    deco_api_1.type.float,
    deco_api_1.io.all
], ThreeGeometryModel.prototype, "width", void 0);
__decorate([
    deco_api_1.type.float,
    deco_api_1.io.all
], ThreeGeometryModel.prototype, "height", void 0);
__decorate([
    deco_api_1.type.float,
    deco_api_1.io.all
], ThreeGeometryModel.prototype, "depth", void 0);
__decorate([
    deco_api_1.type.any,
    deco_api_1.io.all
], ThreeGeometryModel.prototype, "segments", void 0);
__decorate([
    deco_api_1.type.float,
    deco_api_1.io.all
], ThreeGeometryModel.prototype, "radialSegments", void 0);
__decorate([
    deco_api_1.type.float,
    deco_api_1.io.all
], ThreeGeometryModel.prototype, "tubularSegments", void 0);
__decorate([
    deco_api_1.type.float,
    deco_api_1.io.all
], ThreeGeometryModel.prototype, "radiusSegments", void 0);
__decorate([
    deco_api_1.type.float,
    deco_api_1.io.all
], ThreeGeometryModel.prototype, "widthSegments", void 0);
__decorate([
    deco_api_1.type.float,
    deco_api_1.io.all
], ThreeGeometryModel.prototype, "heightSegments", void 0);
__decorate([
    deco_api_1.type.boolean,
    deco_api_1.io.all
], ThreeGeometryModel.prototype, "openEnded", void 0);
__decorate([
    deco_api_1.type.float,
    deco_api_1.io.all
], ThreeGeometryModel.prototype, "thetaStart", void 0);
__decorate([
    deco_api_1.type.float,
    deco_api_1.io.all
], ThreeGeometryModel.prototype, "thetaLength", void 0);
ThreeGeometryModel = __decorate([
    deco_api_1.model('three_geometry')
], ThreeGeometryModel);
exports.ThreeGeometryModel = ThreeGeometryModel;
//# sourceMappingURL=geometry.model.js.map