import { ThreeCoreControllerMiddleware } from './three.core.controller';
import { ThreeObjectModel } from './../models/object.model';
import { Router } from 'express';
import { ControllerMiddleware, AppMiddleware, MultipartMiddleware } from 'deco-api';
let debug = require('debug')('app:controller:three:object');

const router: Router = Router();

let mdController = new ThreeCoreControllerMiddleware(ThreeObjectModel);

router.use(mdController.registerPolicyMountingPoint(['three.object']))

router.get(
  ControllerMiddleware.getAllRoute(),
  AppMiddleware.fetchWithPublicKey,
  mdController.registerPolicyMountingPoint(['three.object.get']),
  mdController.prepareQueryFromReq(),
  mdController.getAll(null, {enableLastModifiedCaching: true})
);

router.get(
  ControllerMiddleware.getOneRoute(),
  AppMiddleware.fetchWithPublicKey,
  mdController.registerPolicyMountingPoint(['three.object.get']),
  mdController.getOne()
);

router.post(
  ControllerMiddleware.postRoute(),
  AppMiddleware.fetchWithPublicKey,
  mdController.registerPolicyMountingPoint(['three.object.write', 'three.object.post']),
  MultipartMiddleware.parseDeco(<any>ThreeObjectModel.deco),
  mdController.post()
);

router.put(
  ControllerMiddleware.putRoute(),
  AppMiddleware.fetchWithPublicKey,
  mdController.registerPolicyMountingPoint(['three.object.write', 'three.object.put']),
  MultipartMiddleware.parseDeco(<any>ThreeObjectModel.deco),
  mdController.put()
);

router.delete(
  ControllerMiddleware.deleteRoute(),
  AppMiddleware.fetchWithPublicKey,
  mdController.registerPolicyMountingPoint(['three.object.write', 'three.object.delete']),
  mdController.delete()
);

export const ThreeObjectController: Router = router;