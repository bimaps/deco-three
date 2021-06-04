import { ThreeCheckerConfigModel } from './../models/checker-config.model';
import { ThreeCheckerReportModel } from './../models/checker-report.model';
import { ThreeCoreControllerMiddleware } from './three.core.controller';
import { Router } from 'express';
import { ControllerMiddleware, AppMiddleware, CacheLastModified } from 'deco-api';
let debug = require('debug')('app:controller:three:geometry');

const router: Router = Router();

let configController = new ThreeCoreControllerMiddleware(ThreeCheckerConfigModel);
let reportController = new ThreeCoreControllerMiddleware(ThreeCheckerReportModel);

router.get(
  '/report' + ControllerMiddleware.getAllRoute(),
  CacheLastModified.init(),
  AppMiddleware.fetchWithPublicKey,
  reportController.prepareQueryFromReq(),
  reportController.getAll(null, {enableLastModifiedCaching: true}),
  // CacheLastModified.send()
);

router.get(
  '/report' + ControllerMiddleware.getOneRoute(),
  AppMiddleware.fetchWithPublicKey,
  reportController.getOne()
);

router.post(
  '/report' + ControllerMiddleware.postRoute(),
  AppMiddleware.fetchWithPublicKey,
  reportController.post()
);

router.put(
  '/report' + ControllerMiddleware.putRoute(),
  AppMiddleware.fetchWithPublicKey,
  reportController.put()
);

router.delete(
  '/report' + ControllerMiddleware.deleteRoute(),
  AppMiddleware.fetchWithPublicKey,
  reportController.delete()
);

router.get(
  ControllerMiddleware.getAllRoute(),
  CacheLastModified.init(),
  AppMiddleware.fetchWithPublicKey,
  configController.prepareQueryFromReq(),
  configController.getAll(null, {enableLastModifiedCaching: true}),
  // CacheLastModified.send()
);

router.get(
  ControllerMiddleware.getOneRoute(),
  AppMiddleware.fetchWithPublicKey,
  configController.getOne()
);

router.post(
  ControllerMiddleware.postRoute(),
  AppMiddleware.fetchWithPublicKey,
  // AppMiddleware.addAppIdToBody('appId'),
  configController.post()
);

router.put(
  ControllerMiddleware.putRoute(),
  AppMiddleware.fetchWithPublicKey,
  // AppMiddleware.addAppIdToBody('appId'),
  configController.put()
);

router.delete(
  ControllerMiddleware.deleteRoute(),
  AppMiddleware.fetchWithPublicKey,
  configController.delete()
);



export const ThreeCheckerController: Router = router;