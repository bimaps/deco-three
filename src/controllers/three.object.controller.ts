import { ThreeCoreControllerMiddleware } from './three.core.controller';
import { ThreeObjectModel } from './../models/object.model';
import { Router } from 'express';
import { ControllerMiddleware, AuthMiddleware, AppMiddleware } from 'deco-api';
let debug = require('debug')('app:controller:three:object');

const router: Router = Router();

let mdController = new ThreeCoreControllerMiddleware(ThreeObjectModel);

router.get(
  ControllerMiddleware.getAllRoute(),
  AppMiddleware.fetchWithPublicKey,
  mdController.prepareQueryFromReq(),
  mdController.getAll(null, {enableLastModifiedCaching: true})
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

export const ThreeObjectController: Router = router;