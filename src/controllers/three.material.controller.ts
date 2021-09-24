import { ThreeMaterialModel } from './../models/material.model';
import { ThreeCoreControllerMiddleware } from './three.core.controller';
import { Router } from 'express';
import { AppMiddleware, ControllerMiddleware } from '@bim/deco-api';

let debug = require('debug')('app:controller:three:material');

const router: Router = Router();

let mdController = new ThreeCoreControllerMiddleware(ThreeMaterialModel);

router.use(mdController.registerPolicyMountingPoint(['three.material']));

router.get(
  ControllerMiddleware.getAllRoute(),
  AppMiddleware.fetchWithPublicKey,
  mdController.registerPolicyMountingPoint(['three.material.get']),
  mdController.prepareQueryFromReq(),
  mdController.getAll(),
);

router.get(
  ControllerMiddleware.getOneRoute(),
  AppMiddleware.fetchWithPublicKey,
  mdController.registerPolicyMountingPoint(['three.material.get']),
  mdController.getOne(),
);

router.post(
  ControllerMiddleware.postRoute(),
  AppMiddleware.fetchWithPublicKey,
  mdController.registerPolicyMountingPoint(['three.material.write', 'three.material.post']),
  mdController.post(),
);

router.put(
  ControllerMiddleware.putRoute(),
  AppMiddleware.fetchWithPublicKey,
  mdController.registerPolicyMountingPoint(['three.material.write', 'three.material.put']),
  mdController.put(),
);

router.delete(
  ControllerMiddleware.deleteRoute(),
  AppMiddleware.fetchWithPublicKey,
  mdController.registerPolicyMountingPoint(['three.material.write', 'three.material.delete']),
  mdController.delete(),
);

export const ThreeMaterialController: Router = router;
