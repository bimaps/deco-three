"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThreeObjectController = void 0;
const three_core_controller_1 = require("./three.core.controller");
const object_model_1 = require("./../models/object.model");
const express_1 = require("express");
const deco_api_1 = require("deco-api");
let debug = require('debug')('app:controller:three:object');
const router = express_1.Router();
let mdController = new three_core_controller_1.ThreeCoreControllerMiddleware(object_model_1.ThreeObjectModel);
router.use(mdController.registerPolicyMountingPoint(['three.object']));
router.get(deco_api_1.ControllerMiddleware.getAllRoute(), deco_api_1.AppMiddleware.fetchWithPublicKey, mdController.registerPolicyMountingPoint(['three.object.get']), mdController.prepareQueryFromReq(), mdController.getAll(null, { enableLastModifiedCaching: true, addCountInKey: '__count' }));
router.get(deco_api_1.ControllerMiddleware.getOneRoute(), deco_api_1.AppMiddleware.fetchWithPublicKey, mdController.registerPolicyMountingPoint(['three.object.get']), mdController.getOne());
router.post(deco_api_1.ControllerMiddleware.postRoute(), deco_api_1.AppMiddleware.fetchWithPublicKey, mdController.registerPolicyMountingPoint(['three.object.write', 'three.object.post']), deco_api_1.MultipartMiddleware.parseDeco(object_model_1.ThreeObjectModel.deco), mdController.post());
router.put(deco_api_1.ControllerMiddleware.putRoute(), deco_api_1.AppMiddleware.fetchWithPublicKey, mdController.registerPolicyMountingPoint(['three.object.write', 'three.object.put']), deco_api_1.MultipartMiddleware.parseDeco(object_model_1.ThreeObjectModel.deco), mdController.put());
router.delete(deco_api_1.ControllerMiddleware.deleteRoute(), deco_api_1.AppMiddleware.fetchWithPublicKey, mdController.registerPolicyMountingPoint(['three.object.write', 'three.object.delete']), mdController.delete());
exports.ThreeObjectController = router;
//# sourceMappingURL=three.object.controller.js.map