"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThreeRoutes = void 0;
const three_checker2_controller_1 = require("./controllers/three.checker2.controller");
const three_style_controller_1 = require("./controllers/three.style.controller");
const three_theme_controller_1 = require("./controllers/three.theme.controller");
const three_geometry_controller_1 = require("./controllers/three.geometry.controller");
const three_material_controller_1 = require("./controllers/three.material.controller");
const three_object_controller_1 = require("./controllers/three.object.controller");
const three_site_controller_1 = require("./controllers/three.site.controller");
const express_1 = require("express");
const deco_api_1 = require("deco-api");
const router = express_1.Router();
exports.ThreeRoutes = router;
// Mount Three Controllers
router.use(deco_api_1.PolicyController.registerPolicyMountingPoint('three'));
router.use('/site', three_site_controller_1.ThreeSiteController);
router.use('/object', three_object_controller_1.ThreeObjectController);
router.use('/material', three_material_controller_1.ThreeMaterialController);
router.use('/geometry', three_geometry_controller_1.ThreeGeometryController);
router.use('/theme', three_theme_controller_1.ThreeThemeController);
router.use('/style', three_style_controller_1.ThreeStyleController);
router.use('/checker', three_checker2_controller_1.ThreeCheckerController);
router.get('/status', (req, res, next) => {
    res.send({ module: 'three', status: 'OK' });
});
//# sourceMappingURL=routes.js.map