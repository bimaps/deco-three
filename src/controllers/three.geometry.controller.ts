import { ThreeGeometryModel } from './../models/geometry.model';
import { ThreeCoreControllerMiddleware } from './three.core.controller';
import { Router } from 'express';
import { ControllerMiddleware,  CacheLastModified, AppMiddleware, AuthMiddleware } from 'deco-api';
let debug = require('debug')('app:controller:three:geometry');

const router: Router = Router();

let mdController = new ThreeCoreControllerMiddleware(ThreeGeometryModel);

router.get(
  ControllerMiddleware.getAllRoute(),
  CacheLastModified.init(),
  AppMiddleware.fetchWithPublicKey,
  mdController.prepareQueryFromReq(),
  mdController.getAll(null, {enableLastModifiedCaching: true}),
  // CacheLastModified.send()
);

router.get(
  ControllerMiddleware.getOneRoute(),
  AppMiddleware.fetchWithPublicKey,
  mdController.getOne()
);

router.post(
  ControllerMiddleware.postRoute(),
  AppMiddleware.fetchWithPublicKey,
  AuthMiddleware.authenticate,
  AuthMiddleware.checkUserRoleAccess('adminThreeRoles'),
  // AppMiddleware.addAppIdToBody('appId'),
  mdController.post()
);

router.put(
  ControllerMiddleware.putRoute(),
  AppMiddleware.fetchWithPublicKey,
  AuthMiddleware.authenticate,
  AuthMiddleware.checkUserRoleAccess('adminThreeRoles'),
  // AppMiddleware.addAppIdToBody('appId'),
  mdController.put()
);

router.delete(
  ControllerMiddleware.deleteRoute(),
  AppMiddleware.fetchWithPublicKey,
  AuthMiddleware.authenticate,
  AuthMiddleware.checkUserRoleAccess('adminThreeRoles'),
  mdController.delete()
);

export const ThreeGeometryController: Router = router;