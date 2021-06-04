import { ThreeGeometryModel } from './../models/geometry.model';
import { ThreeCoreControllerMiddleware } from './three.core.controller';
import { Router } from 'express';
import { ControllerMiddleware,  CacheLastModified, AppMiddleware } from 'deco-api';
let debug = require('debug')('app:controller:three:geometry');

const router: Router = Router();

let mdController = new ThreeCoreControllerMiddleware(ThreeGeometryModel);

router.use(mdController.registerPolicyMountingPoint(['three.geometry']))

router.get(
  ControllerMiddleware.getAllRoute(),
  CacheLastModified.init(),
  AppMiddleware.fetchWithPublicKey,
  mdController.registerPolicyMountingPoint(['three.geometry.get']),
  mdController.prepareQueryFromReq(),
  mdController.getAll(null, {enableLastModifiedCaching: true}),
  // CacheLastModified.send()
);

router.get(
  ControllerMiddleware.getOneRoute(),
  AppMiddleware.fetchWithPublicKey,
  mdController.registerPolicyMountingPoint(['three.geometry.get']),
  mdController.getOne()
);

router.post(
  ControllerMiddleware.postRoute(),
  AppMiddleware.fetchWithPublicKey,
  mdController.registerPolicyMountingPoint(['three.geometry.write', 'three.geometry.post']),
  mdController.post()
);

router.put(
  ControllerMiddleware.putRoute(),
  AppMiddleware.fetchWithPublicKey,
  mdController.registerPolicyMountingPoint(['three.geometry.write', 'three.geometry.put']),
  mdController.put()
);

router.delete(
  ControllerMiddleware.deleteRoute(),
  AppMiddleware.fetchWithPublicKey,
  mdController.registerPolicyMountingPoint(['three.geometry.write', 'three.geometry.delete']),
  mdController.delete()
);

export const ThreeGeometryController: Router = router;