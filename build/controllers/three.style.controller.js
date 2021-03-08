"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThreeStyleController = void 0;
const style_model_1 = require("./../models/style.model");
const theme_model_1 = require("./../models/theme.model");
const three_core_controller_1 = require("./three.core.controller");
const express_1 = require("express");
const deco_api_1 = require("deco-api");
let debug = require('debug')('app:controller:three:style');
const router = express_1.Router();
let mdController = new three_core_controller_1.ThreeCoreControllerMiddleware(style_model_1.ThreeStyleModel);
function removeStyleFromAllThemes() {
    return (req, res, next) => {
        if (!res.locals.app)
            return next(new Error('Missing app')); // not required anymore as this is handled by policy
        if (!res.locals.element)
            return next(new Error('Missing element'));
        const rightInstance = res.locals.element instanceof style_model_1.ThreeStyleModel;
        if (!rightInstance)
            return next(new Error('Invalid style'));
        const styleId = res.locals.element._id;
        new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                const themes = yield theme_model_1.ThreeThemeModel.getAll(new deco_api_1.Query({ "rules.styles": styleId.toString() }));
                for (const theme of themes) {
                    for (const rule of theme.rules) {
                        const styleIndex = rule.styles.indexOf(styleId.toString());
                        if (styleIndex !== -1) {
                            rule.styles.splice(styleIndex, 1);
                        }
                    }
                    yield theme.update(['rules']);
                }
                resolve(null);
            }
            catch (error) {
                reject(error);
            }
        })).then(next).catch(next);
    };
}
router.get(deco_api_1.ControllerMiddleware.getAllRoute(), deco_api_1.AppMiddleware.fetchWithPublicKey, mdController.prepareQueryFromReq(), mdController.getAll(null, { enableLastModifiedCaching: false }));
router.get(deco_api_1.ControllerMiddleware.getOneRoute(), deco_api_1.AppMiddleware.fetchWithPublicKey, mdController.getOne());
router.post(deco_api_1.ControllerMiddleware.postRoute(), deco_api_1.AppMiddleware.fetchWithPublicKey, deco_api_1.AuthMiddleware.authenticate, deco_api_1.AuthMiddleware.checkUserRoleAccess('adminThreeRoles'), 
// AppMiddleware.addAppIdToBody('appId'),
mdController.post());
router.put(deco_api_1.ControllerMiddleware.putRoute(), deco_api_1.AppMiddleware.fetchWithPublicKey, deco_api_1.AuthMiddleware.authenticate, deco_api_1.AuthMiddleware.checkUserRoleAccess('adminThreeRoles'), 
// AppMiddleware.addAppIdToBody('appId'),
mdController.put());
router.delete(deco_api_1.ControllerMiddleware.deleteRoute(), deco_api_1.AppMiddleware.fetchWithPublicKey, deco_api_1.AuthMiddleware.authenticate, deco_api_1.AuthMiddleware.checkUserRoleAccess('adminThreeRoles'), mdController.getOne({ ignoreDownload: true, ignoreOutput: true, ignoreSend: true }), removeStyleFromAllThemes(), mdController.delete());
exports.ThreeStyleController = router;
//# sourceMappingURL=three.style.controller.js.map