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
exports.ThreeDeleteSiteAction = void 0;
const site_model_1 = require("./../../models/site.model");
let debug = require('debug')('app:actions:three:send-report');
class ThreeDeleteSiteAction {
    static run(res) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            debug('run');
            if (!((_b = (_a = res.locals.actions) === null || _a === void 0 ? void 0 : _a.variables) === null || _b === void 0 ? void 0 : _b.siteId)) {
                throw new Error('Three Report Action: Missing siteId variable');
            }
            const siteId = res.locals.actions.variables.siteId;
            debug('siteId', siteId);
            const site = yield site_model_1.ThreeSiteModel.getOneWithId(siteId);
            if (!site) {
                throw new Error('Site not found');
            }
            let deletePromises = [];
            const collectionNames = [
                'three_geometry',
                'three_material',
                'three_object',
                'three_building',
                'three_storey',
                'three_space',
                'three_theme',
                'three_style',
                'checker_report',
                'checker_module',
                'checker_flow'
            ];
            let query = { siteId: siteId };
            for (let collectionName of collectionNames) {
                deletePromises.push(site_model_1.ThreeSiteModel.deco.db.collection(collectionName).deleteMany(query).then((result) => {
                    return {
                        model: collectionName,
                        nbDeleted: result.deletedCount
                    };
                }));
            }
            const deleteResult = yield Promise.all(deletePromises);
            debug(deleteResult);
        });
    }
}
exports.ThreeDeleteSiteAction = ThreeDeleteSiteAction;
//# sourceMappingURL=three.delete-site.actions.js.map