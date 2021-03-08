"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThreeThemeController = void 0;
const theme_model_1 = require("./../models/theme.model");
const three_core_controller_1 = require("./three.core.controller");
const express_1 = require("express");
const deco_api_1 = require("deco-api");
let debug = require('debug')('app:controller:three:theme');
const router = express_1.Router();
let mdController = new three_core_controller_1.ThreeCoreControllerMiddleware(theme_model_1.ThreeThemeModel);
router.get(deco_api_1.ControllerMiddleware.getAllRoute(), deco_api_1.AppMiddleware.fetchWithPublicKey, mdController.prepareQueryFromReq(), mdController.getAll(null, { enableLastModifiedCaching: false }));
router.get(deco_api_1.ControllerMiddleware.getOneRoute(), deco_api_1.AppMiddleware.fetchWithPublicKey, mdController.getOne());
router.post(deco_api_1.ControllerMiddleware.postRoute(), deco_api_1.AppMiddleware.fetchWithPublicKey, deco_api_1.AuthMiddleware.authenticate, deco_api_1.AuthMiddleware.checkUserRoleAccess('adminThreeRoles'), 
// AppMiddleware.addAppIdToBody('appId'),
mdController.post());
router.put(deco_api_1.ControllerMiddleware.putRoute(), deco_api_1.AppMiddleware.fetchWithPublicKey, deco_api_1.AuthMiddleware.authenticate, deco_api_1.AuthMiddleware.checkUserRoleAccess('adminThreeRoles'), 
// AppMiddleware.addAppIdToBody('appId'),
mdController.put());
router.delete(deco_api_1.ControllerMiddleware.deleteRoute(), deco_api_1.AppMiddleware.fetchWithPublicKey, deco_api_1.AuthMiddleware.authenticate, deco_api_1.AuthMiddleware.checkUserRoleAccess('adminThreeRoles'), mdController.delete());
exports.ThreeThemeController = router;
//# sourceMappingURL=three.theme.controller.js.map