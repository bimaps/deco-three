"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThreeSiteController = void 0;
const three_checker_controller_middleware_1 = require("./three.checker.controller.middleware");
const three_core_controller_1 = require("./three.core.controller");
const site_model_1 = require("./../models/site.model");
const express_1 = require("express");
const deco_api_1 = require("deco-api");
const multer_1 = __importDefault(require("multer"));
const storage = multer_1.default.memoryStorage();
const disk = multer_1.default.diskStorage({});
const memoryUpload = multer_1.default({ storage: storage });
const diskUpload = multer_1.default({ storage: disk });
let debug = require('debug')('app:controller:data');
const router = express_1.Router();
let mdController = new three_core_controller_1.ThreeCoreControllerMiddleware(site_model_1.ThreeSiteModel);
router.get(deco_api_1.ControllerMiddleware.getAllRoute(), deco_api_1.AppMiddleware.fetchWithPublicKey, mdController.prepareQueryFromReq(), mdController.getAll());
router.get(deco_api_1.ControllerMiddleware.getOneRoute(), deco_api_1.AppMiddleware.fetchWithPublicKey, mdController.getOne({ ignoreDownload: false, ignoreOutput: true, ignoreSend: true }), mdController.fetchBuildingsInfos());
router.post('/:elementId/import/json', deco_api_1.AppMiddleware.fetchWithPublicKey, deco_api_1.AuthMiddleware.authenticate, deco_api_1.AuthMiddleware.checkUserRoleAccess('adminThreeRoles'), mdController.getOne({ ignoreDownload: true, ignoreOutput: true, ignoreSend: true }), 
// AppMiddleware.addAppIdToBody('appId'),
memoryUpload.single('json'), mdController.importJSON);
router.post('/:elementId/import/ifc', deco_api_1.AppMiddleware.fetchWithPublicKey, deco_api_1.AuthMiddleware.authenticate, deco_api_1.AuthMiddleware.checkUserRoleAccess('adminThreeRoles'), mdController.getOne({ ignoreDownload: true, ignoreOutput: true, ignoreSend: true }), 
// AppMiddleware.addAppIdToBody('appId'),
diskUpload.single('ifc'), deco_api_1.Operation.startMiddelware, mdController.importIFC, deco_api_1.Operation.sendCurrentOperation);
router.get('/:elementId/import/ifc/:operationId', deco_api_1.AppMiddleware.fetchWithPublicKey, deco_api_1.AuthMiddleware.authenticate, deco_api_1.AuthMiddleware.checkUserRoleAccess('adminThreeRoles'), deco_api_1.Operation.waitForCompletion);
router.delete('/:elementId/delete-data', deco_api_1.AppMiddleware.fetchWithPublicKey, deco_api_1.AuthMiddleware.authenticate, deco_api_1.AuthMiddleware.checkUserRoleAccess('adminThreeRoles'), mdController.getOne({ ignoreDownload: true, ignoreOutput: true, ignoreSend: true }), 
// AppMiddleware.addAppIdToBody('appId'),
mdController.deleteData);
router.delete('/:elementId/clear-import', deco_api_1.AppMiddleware.fetchWithPublicKey, deco_api_1.AuthMiddleware.authenticate, deco_api_1.AuthMiddleware.checkUserRoleAccess('adminThreeRoles'), mdController.getOne({ ignoreDownload: true, ignoreOutput: true, ignoreSend: true }), 
// AppMiddleware.addAppIdToBody('appId'),
mdController.clearImport);
router.post(deco_api_1.ControllerMiddleware.postRoute(), deco_api_1.AppMiddleware.fetchWithPublicKey, deco_api_1.AuthMiddleware.authenticate, deco_api_1.AuthMiddleware.checkUserRoleAccess('adminThreeRoles'), 
// AppMiddleware.addAppIdToBody('appId'),
mdController.post());
router.put(deco_api_1.ControllerMiddleware.putRoute(), deco_api_1.AppMiddleware.fetchWithPublicKey, deco_api_1.AuthMiddleware.authenticate, deco_api_1.AuthMiddleware.checkUserRoleAccess('adminThreeRoles'), 
// AppMiddleware.addAppIdToBody('appId'),
mdController.put());
router.delete(deco_api_1.ControllerMiddleware.deleteRoute(), deco_api_1.AppMiddleware.fetchWithPublicKey, deco_api_1.AuthMiddleware.authenticate, deco_api_1.AuthMiddleware.checkUserRoleAccess('adminThreeRoles'), mdController.delete());
router.get('/:elementId/key-values', deco_api_1.AppMiddleware.fetchWithPublicKey, deco_api_1.AuthMiddleware.authenticate, deco_api_1.AuthMiddleware.checkUserRoleAccess('adminThreeRoles'), mdController.getOne({ ignoreDownload: true, ignoreSend: true, ignoreOutput: true }), mdController.fetchKeyValues());
router.get('/:siteId/checker/:configId/run', deco_api_1.AppMiddleware.fetchWithPublicKey, deco_api_1.AuthMiddleware.authenticate, deco_api_1.AuthMiddleware.checkUserRoleAccess('adminThreeRoles'), three_checker_controller_middleware_1.ThreeCheckerControllerMiddleware.run());
router.get('/:siteId/checker/:configId/run/pdf', deco_api_1.AppMiddleware.fetchWithPublicKey, deco_api_1.AuthMiddleware.authenticate, deco_api_1.AuthMiddleware.checkUserRoleAccess('adminThreeRoles'), three_checker_controller_middleware_1.ThreeCheckerControllerMiddleware.run(true));
router.get('/:siteId/checker/report/:reportId/run', deco_api_1.AppMiddleware.fetchWithPublicKey, deco_api_1.AuthMiddleware.authenticate, deco_api_1.AuthMiddleware.checkUserRoleAccess('adminThreeRoles'), three_checker_controller_middleware_1.ThreeCheckerControllerMiddleware.runReport());
router.get('/:siteId/checker/report/:reportId/run/pdf', deco_api_1.AppMiddleware.fetchWithPublicKey, deco_api_1.AuthMiddleware.authenticate, deco_api_1.AuthMiddleware.checkUserRoleAccess('adminThreeRoles'), three_checker_controller_middleware_1.ThreeCheckerControllerMiddleware.runReport(true));
exports.ThreeSiteController = router;
//# sourceMappingURL=three.site.controller.js.map