import { ThreeCheckerControllerMiddleware } from './three.checker.controller.middleware';
import { ThreeCoreControllerMiddleware } from './three.core.controller';
import { ThreeSiteModel } from './../models/site.model';
import { Router } from 'express';
import { AppMiddleware, ControllerMiddleware, Operation } from '@bim/deco-api';
import multer from 'multer';

const storage = multer.memoryStorage();
const disk = multer.diskStorage({});
const memoryUpload = multer({ storage: storage });
const diskUpload = multer({ storage: disk });
let debug = require('debug')('app:controller:data');

const router: Router = Router();

const mdController = new ThreeCoreControllerMiddleware(ThreeSiteModel);

router.use(mdController.registerPolicyMountingPoint(['three.site']));

router.get(
  ControllerMiddleware.getAllRoute(),
  AppMiddleware.fetchWithPublicKey,
  mdController.registerPolicyMountingPoint(['three.site.get']),
  mdController.prepareQueryFromReq(),
  mdController.getAll(),
);

router.get(
  ControllerMiddleware.getOneRoute(),
  AppMiddleware.fetchWithPublicKey,
  mdController.registerPolicyMountingPoint(['three.site.get']),
  mdController.getOne({
    ignoreDownload: false,
    ignoreOutput: true,
    ignoreSend: true,
  }),
  mdController.fetchBuildingsInfos(),
);

router.post(
  '/:elementId/import/json',
  AppMiddleware.fetchWithPublicKey,
  mdController.registerPolicyMountingPoint(['three.site.import']),
  mdController.getOne({
    ignoreDownload: true,
    ignoreOutput: true,
    ignoreSend: true,
  }),
  memoryUpload.single('json'),
  mdController.importJSON,
);

router.post(
  '/:elementId/import/ifc',
  AppMiddleware.fetchWithPublicKey,
  mdController.registerPolicyMountingPoint(['three.site.import']),
  mdController.getOne({
    ignoreDownload: true,
    ignoreOutput: true,
    ignoreSend: true,
  }),
  diskUpload.single('ifc'),
  Operation.startMiddelware,
  mdController.importIFCWithMicroService,
  Operation.sendCurrentOperation,
);

router.get(
  '/:elementId/import/ifc/:operationId',
  mdController.registerPolicyMountingPoint(['three.site.import']),
  AppMiddleware.fetchWithPublicKey,
  Operation.waitForCompletion,
);

router.delete(
  '/:elementId/delete-data',
  AppMiddleware.fetchWithPublicKey,
  mdController.registerPolicyMountingPoint(['three.site.write', 'three.site.delete']),
  mdController.getOne({
    ignoreDownload: true,
    ignoreOutput: true,
    ignoreSend: true,
  }),
  mdController.deleteData,
);

router.delete(
  '/:elementId/clear-import',
  AppMiddleware.fetchWithPublicKey,
  mdController.registerPolicyMountingPoint(['three.site.write', 'three.site.delete']),
  mdController.getOne({
    ignoreDownload: true,
    ignoreOutput: true,
    ignoreSend: true,
  }),
  mdController.clearImport,
);

router.post(
  ControllerMiddleware.postRoute(),
  AppMiddleware.fetchWithPublicKey,
  mdController.registerPolicyMountingPoint(['three.site.write', 'three.site.post']),
  mdController.post(),
);

router.put(
  ControllerMiddleware.putRoute(),
  AppMiddleware.fetchWithPublicKey,
  mdController.registerPolicyMountingPoint(['three.site.write', 'three.site.put']),
  mdController.put(),
);

router.delete(
  ControllerMiddleware.deleteRoute(),
  AppMiddleware.fetchWithPublicKey,
  mdController.registerPolicyMountingPoint(['three.site.write', 'three.site.delete']),
  mdController.delete(),
);

router.get(
  '/:elementId/key-values',
  AppMiddleware.fetchWithPublicKey,
  mdController.registerPolicyMountingPoint(['three.site.get']),
  mdController.getOne({
    ignoreDownload: true,
    ignoreSend: true,
    ignoreOutput: true,
  }),
  mdController.fetchKeyValues(),
);

// Following routes should be depractated soon
router.get('/:siteId/checker/:configId/run', AppMiddleware.fetchWithPublicKey, ThreeCheckerControllerMiddleware.run());

router.get('/:siteId/checker/:configId/run/pdf', AppMiddleware.fetchWithPublicKey, ThreeCheckerControllerMiddleware.run(true));

router.get('/:siteId/checker/report/:reportId/run', AppMiddleware.fetchWithPublicKey, ThreeCheckerControllerMiddleware.runReport());

router.get('/:siteId/checker/report/:reportId/run/pdf', AppMiddleware.fetchWithPublicKey, ThreeCheckerControllerMiddleware.runReport(true));

export const ThreeSiteController: Router = router;
