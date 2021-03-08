import { ThreeCheckerControllerMiddleware } from './three.checker.controller.middleware';
import { ThreeCoreControllerMiddleware } from './three.core.controller';
import { ThreeSiteModel } from './../models/site.model';
import { Router } from 'express';
import { ControllerMiddleware, AppMiddleware, AuthMiddleware, Operation } from 'deco-api';
import multer from 'multer';
const storage = multer.memoryStorage()
const disk = multer.diskStorage({});
const memoryUpload = multer({ storage: storage })
const diskUpload = multer({storage: disk});
let debug = require('debug')('app:controller:data');

const router: Router = Router();

let mdController = new ThreeCoreControllerMiddleware(ThreeSiteModel);

router.get(
  ControllerMiddleware.getAllRoute(),
  AppMiddleware.fetchWithPublicKey,
  mdController.prepareQueryFromReq(),
  mdController.getAll()
);

router.get(
  ControllerMiddleware.getOneRoute(),
  AppMiddleware.fetchWithPublicKey,
  mdController.getOne({ignoreDownload: false, ignoreOutput: true, ignoreSend: true}),
  mdController.fetchBuildingsInfos()
);

router.post(
  '/:elementId/import/json',
  AppMiddleware.fetchWithPublicKey,
  AuthMiddleware.authenticate,
  AuthMiddleware.checkUserRoleAccess('adminThreeRoles'),
  mdController.getOne({ignoreDownload: true, ignoreOutput: true, ignoreSend: true}),
  // AppMiddleware.addAppIdToBody('appId'),
  memoryUpload.single('json'),
  mdController.importJSON
);

router.post(
  '/:elementId/import/ifc',
  AppMiddleware.fetchWithPublicKey,
  AuthMiddleware.authenticate,
  AuthMiddleware.checkUserRoleAccess('adminThreeRoles'),
  mdController.getOne({ignoreDownload: true, ignoreOutput: true, ignoreSend: true}),
  // AppMiddleware.addAppIdToBody('appId'),
  diskUpload.single('ifc'),
  Operation.startMiddelware,
  mdController.importIFC,
  Operation.sendCurrentOperation
);

router.get(
  '/:elementId/import/ifc/:operationId',
  AppMiddleware.fetchWithPublicKey,
  AuthMiddleware.authenticate,
  AuthMiddleware.checkUserRoleAccess('adminThreeRoles'),
  Operation.waitForCompletion
);

router.delete(
  '/:elementId/delete-data',
  AppMiddleware.fetchWithPublicKey,
  AuthMiddleware.authenticate,
  AuthMiddleware.checkUserRoleAccess('adminThreeRoles'),
  mdController.getOne({ignoreDownload: true, ignoreOutput: true, ignoreSend: true}),
  // AppMiddleware.addAppIdToBody('appId'),
  mdController.deleteData
);

router.delete(
  '/:elementId/clear-import',
  AppMiddleware.fetchWithPublicKey,
  AuthMiddleware.authenticate,
  AuthMiddleware.checkUserRoleAccess('adminThreeRoles'),
  mdController.getOne({ignoreDownload: true, ignoreOutput: true, ignoreSend: true}),
  // AppMiddleware.addAppIdToBody('appId'),
  mdController.clearImport
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

router.get(
  '/:elementId/key-values',
  AppMiddleware.fetchWithPublicKey,
  AuthMiddleware.authenticate,
  AuthMiddleware.checkUserRoleAccess('adminThreeRoles'),
  mdController.getOne({ignoreDownload: true, ignoreSend: true, ignoreOutput: true}),
  mdController.fetchKeyValues()
)

router.get(
  '/:siteId/checker/:configId/run',
  AppMiddleware.fetchWithPublicKey,
  AuthMiddleware.authenticate,
  AuthMiddleware.checkUserRoleAccess('adminThreeRoles'),
  ThreeCheckerControllerMiddleware.run()
);

router.get(
  '/:siteId/checker/:configId/run/pdf',
  AppMiddleware.fetchWithPublicKey,
  AuthMiddleware.authenticate,
  AuthMiddleware.checkUserRoleAccess('adminThreeRoles'),
  ThreeCheckerControllerMiddleware.run(true)
);

router.get(
  '/:siteId/checker/report/:reportId/run',
  AppMiddleware.fetchWithPublicKey,
  AuthMiddleware.authenticate,
  AuthMiddleware.checkUserRoleAccess('adminThreeRoles'),
  ThreeCheckerControllerMiddleware.runReport()
);

router.get(
  '/:siteId/checker/report/:reportId/run/pdf',
  AppMiddleware.fetchWithPublicKey,
  AuthMiddleware.authenticate,
  AuthMiddleware.checkUserRoleAccess('adminThreeRoles'),
  ThreeCheckerControllerMiddleware.runReport(true)
);

export const ThreeSiteController: Router = router;