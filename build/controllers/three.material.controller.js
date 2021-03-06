"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThreeMaterialController = void 0;
const material_model_1 = require("./../models/material.model");
const three_core_controller_1 = require("./three.core.controller");
const express_1 = require("express");
const deco_api_1 = require("deco-api");
let debug = require('debug')('app:controller:three:material');
const router = express_1.Router();
let mdController = new three_core_controller_1.ThreeCoreControllerMiddleware(material_model_1.ThreeMaterialModel);
router.use(mdController.registerPolicyMountingPoint(['three.material']));
router.get(deco_api_1.ControllerMiddleware.getAllRoute(), deco_api_1.AppMiddleware.fetchWithPublicKey, mdController.registerPolicyMountingPoint(['three.material.get']), mdController.prepareQueryFromReq(), mdController.getAll());
router.get(deco_api_1.ControllerMiddleware.getOneRoute(), deco_api_1.AppMiddleware.fetchWithPublicKey, mdController.registerPolicyMountingPoint(['three.material.get']), mdController.getOne());
router.post(deco_api_1.ControllerMiddleware.postRoute(), deco_api_1.AppMiddleware.fetchWithPublicKey, mdController.registerPolicyMountingPoint(['three.material.write', 'three.material.post']), mdController.post());
router.put(deco_api_1.ControllerMiddleware.putRoute(), deco_api_1.AppMiddleware.fetchWithPublicKey, mdController.registerPolicyMountingPoint(['three.material.write', 'three.material.put']), mdController.put());
router.delete(deco_api_1.ControllerMiddleware.deleteRoute(), deco_api_1.AppMiddleware.fetchWithPublicKey, mdController.registerPolicyMountingPoint(['three.material.write', 'three.material.delete']), mdController.delete());
exports.ThreeMaterialController = router;
//# sourceMappingURL=three.material.controller.js.map