import { ThreeMaterialModel } from './../models/material.model';
import { ThreeCoreControllerMiddleware } from './three.core.controller';
import { Router } from 'express';
import { ControllerMiddleware, AppMiddleware, AuthMiddleware } from 'deco-api';
let debug = require('debug')('app:controller:three:material');

const router: Router = Router();

let mdController = new ThreeCoreControllerMiddleware(ThreeMaterialModel);

router.get(
  ControllerMiddleware.getAllRoute(),
  AppMiddleware.fetchWithPublicKey,
  mdController.prepareQueryFromReq(),
  mdController.getAll()
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

export const ThreeMaterialController: Router = router;