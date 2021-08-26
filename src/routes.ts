import { ThreeCheckerController } from './controllers/three.checker2.controller';
import { ThreeStyleController } from './controllers/three.style.controller';
import { ThreeThemeController } from './controllers/three.theme.controller';
import { ThreeGeometryController } from './controllers/three.geometry.controller';
import { ThreeMaterialController } from './controllers/three.material.controller';
import { ThreeObjectController } from './controllers/three.object.controller';
import { ThreeSiteController } from './controllers/three.site.controller';
import { Router } from 'express';
import { PolicyController } from '@bim/deco-api';
import {ThreeModuleController} from './controllers';

const router: Router = Router();
// Mount Three Controllers
router.use(PolicyController.registerPolicyMountingPoint('three'));

router.use('/site', ThreeSiteController);
router.use('/object', ThreeObjectController);
router.use('/material', ThreeMaterialController);
router.use('/geometry', ThreeGeometryController);
router.use('/theme', ThreeThemeController);
router.use('/style', ThreeStyleController);
router.use('/checker', ThreeCheckerController);
router.use('/module', ThreeModuleController)

router.get('/status', (req, res, next) => {
  res.send({module: 'three', status: 'OK'});
});

export { router as ThreeRoutes };