"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThreeCheckerReportModel = void 0;
const site_model_1 = require("./site.model");
const deco_api_1 = require("deco-api");
const checker_internals_1 = require("./checkers/checker-internals");
let debug = require('debug')('app:models:three:checker-config');
let ThreeCheckerReportModel = class ThreeCheckerReportModel extends deco_api_1.Model {
    constructor() {
        super(...arguments);
        // @type.models({model: ThreeCheckerConfigModel})
        // @io.all
        // public checkers: Array<ObjectId> = [];
        this.flows = [];
        this.metadata = [];
    }
};
__decorate([
    deco_api_1.type.id
], ThreeCheckerReportModel.prototype, "_id", void 0);
__decorate([
    deco_api_1.type.model({ model: deco_api_1.AppModel }),
    deco_api_1.io.input,
    deco_api_1.io.toDocument,
    deco_api_1.query.filterable(),
    deco_api_1.validate.required,
    deco_api_1.mongo.index({ type: 'single' })
], ThreeCheckerReportModel.prototype, "appId", void 0);
__decorate([
    deco_api_1.type.model({ model: site_model_1.ThreeSiteModel }),
    deco_api_1.io.all,
    deco_api_1.query.filterable(),
    deco_api_1.validate.required,
    deco_api_1.mongo.index({ type: 'single' })
], ThreeCheckerReportModel.prototype, "siteId", void 0);
__decorate([
    deco_api_1.type.string,
    deco_api_1.io.all,
    deco_api_1.query.filterable({ type: 'text' }),
    deco_api_1.validate.required
], ThreeCheckerReportModel.prototype, "name", void 0);
__decorate([
    deco_api_1.type.string,
    deco_api_1.io.all
], ThreeCheckerReportModel.prototype, "description", void 0);
__decorate([
    deco_api_1.type.models({ model: checker_internals_1.CheckerFlowModel }),
    deco_api_1.io.all,
    deco_api_1.query.filterable({ type: 'auto' })
], ThreeCheckerReportModel.prototype, "flows", void 0);
__decorate([
    deco_api_1.type.metadata,
    deco_api_1.io.all
], ThreeCheckerReportModel.prototype, "metadata", void 0);
ThreeCheckerReportModel = __decorate([
    deco_api_1.model('checker_report')
], ThreeCheckerReportModel);
exports.ThreeCheckerReportModel = ThreeCheckerReportModel;
//# sourceMappingURL=checker-report.model.js.map