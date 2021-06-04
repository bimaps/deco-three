"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThreeCheckerController = void 0;
const checker_config_model_1 = require("./../models/checker-config.model");
const checker_report_model_1 = require("./../models/checker-report.model");
const three_core_controller_1 = require("./three.core.controller");
const express_1 = require("express");
const deco_api_1 = require("deco-api");
let debug = require('debug')('app:controller:three:geometry');
const router = express_1.Router();
let configController = new three_core_controller_1.ThreeCoreControllerMiddleware(checker_config_model_1.ThreeCheckerConfigModel);
let reportController = new three_core_controller_1.ThreeCoreControllerMiddleware(checker_report_model_1.ThreeCheckerReportModel);
router.get('/report' + deco_api_1.ControllerMiddleware.getAllRoute(), deco_api_1.CacheLastModified.init(), deco_api_1.AppMiddleware.fetchWithPublicKey, reportController.prepareQueryFromReq(), reportController.getAll(null, { enableLastModifiedCaching: true }));
router.get('/report' + deco_api_1.ControllerMiddleware.getOneRoute(), deco_api_1.AppMiddleware.fetchWithPublicKey, reportController.getOne());
router.post('/report' + deco_api_1.ControllerMiddleware.postRoute(), deco_api_1.AppMiddleware.fetchWithPublicKey, reportController.post());
router.put('/report' + deco_api_1.ControllerMiddleware.putRoute(), deco_api_1.AppMiddleware.fetchWithPublicKey, reportController.put());
router.delete('/report' + deco_api_1.ControllerMiddleware.deleteRoute(), deco_api_1.AppMiddleware.fetchWithPublicKey, reportController.delete());
router.get(deco_api_1.ControllerMiddleware.getAllRoute(), deco_api_1.CacheLastModified.init(), deco_api_1.AppMiddleware.fetchWithPublicKey, configController.prepareQueryFromReq(), configController.getAll(null, { enableLastModifiedCaching: true }));
router.get(deco_api_1.ControllerMiddleware.getOneRoute(), deco_api_1.AppMiddleware.fetchWithPublicKey, configController.getOne());
router.post(deco_api_1.ControllerMiddleware.postRoute(), deco_api_1.AppMiddleware.fetchWithPublicKey, 
// AppMiddleware.addAppIdToBody('appId'),
configController.post());
router.put(deco_api_1.ControllerMiddleware.putRoute(), deco_api_1.AppMiddleware.fetchWithPublicKey, 
// AppMiddleware.addAppIdToBody('appId'),
configController.put());
router.delete(deco_api_1.ControllerMiddleware.deleteRoute(), deco_api_1.AppMiddleware.fetchWithPublicKey, configController.delete());
exports.ThreeCheckerController = router;
//# sourceMappingURL=three.checker.controller.js.map