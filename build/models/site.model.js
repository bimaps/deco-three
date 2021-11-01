"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThreeSiteModel = void 0;
const deco_api_1 = require("deco-api");
const THREE = __importStar(require("three"));
let debug = require('debug')('app:models:three:site');
let ThreeSiteModel = class ThreeSiteModel extends deco_api_1.Model {
    constructor() {
        super(...arguments);
        this.metadata = [];
        this.originalCameraPosition = new THREE.Vector3(0, 0, 0);
        this.originalCameraZoom = 10;
        this.originalCameraLookAt = new THREE.Vector3(0, 0, 0);
    }
};
__decorate([
    deco_api_1.type.id
], ThreeSiteModel.prototype, "_id", void 0);
__decorate([
    deco_api_1.type.model({ model: deco_api_1.AppModel }),
    deco_api_1.io.input,
    deco_api_1.io.toDocument,
    deco_api_1.query.filterable(),
    deco_api_1.validate.required,
    deco_api_1.mongo.index({ type: 'single' })
], ThreeSiteModel.prototype, "appId", void 0);
__decorate([
    deco_api_1.type.string,
    deco_api_1.io.all
], ThreeSiteModel.prototype, "ifcSiteId", void 0);
__decorate([
    deco_api_1.type.string,
    deco_api_1.io.all,
    deco_api_1.validate.required,
    deco_api_1.query.filterable({ type: 'auto' })
], ThreeSiteModel.prototype, "name", void 0);
__decorate([
    deco_api_1.type.metadata,
    deco_api_1.io.all
], ThreeSiteModel.prototype, "metadata", void 0);
__decorate([
    deco_api_1.type.any,
    deco_api_1.io.all
], ThreeSiteModel.prototype, "center", void 0);
__decorate([
    deco_api_1.type.any,
    deco_api_1.io.all
], ThreeSiteModel.prototype, "originalCameraPosition", void 0);
__decorate([
    deco_api_1.type.float,
    deco_api_1.io.all
], ThreeSiteModel.prototype, "originalCameraZoom", void 0);
__decorate([
    deco_api_1.type.any,
    deco_api_1.io.all
], ThreeSiteModel.prototype, "originalCameraLookAt", void 0);
__decorate([
    deco_api_1.type.string,
    deco_api_1.io.all,
    deco_api_1.query.filterable()
], ThreeSiteModel.prototype, "bcfProjectId", void 0);
__decorate([
    deco_api_1.type.array({ type: 'float' }),
    deco_api_1.io.all
], ThreeSiteModel.prototype, "location", void 0);
__decorate([
    deco_api_1.type.array({ type: 'float' }),
    deco_api_1.io.all
], ThreeSiteModel.prototype, "refDirection", void 0);
__decorate([
    deco_api_1.type.array({ type: 'float' }),
    deco_api_1.io.all
], ThreeSiteModel.prototype, "axis", void 0);
__decorate([
    deco_api_1.type.string,
    deco_api_1.io.all,
    deco_api_1.query.filterable()
], ThreeSiteModel.prototype, "business", void 0);
__decorate([
    deco_api_1.type.array({ type: 'string' }),
    deco_api_1.io.all
], ThreeSiteModel.prototype, "authorizedBusinesses", void 0);
ThreeSiteModel = __decorate([
    deco_api_1.model('three_site')
], ThreeSiteModel);
exports.ThreeSiteModel = ThreeSiteModel;
//# sourceMappingURL=site.model.js.map