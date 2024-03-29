import { Router } from 'express';
import { RuleModuleBaseModel } from '../models';
import { ThreeModuleControllerMiddleware } from './three-module-controller.middleware';

const router: Router = Router();

const moduleController = new ThreeModuleControllerMiddleware(RuleModuleBaseModel);

// Disabled because of an error "Invalid Model" at runtime
// TODO replace these old endpoint by the new ones once the theme/reporting refactoring is finished
// router.get(
//   ControllerMiddleware.getAllRoute(),
//   AppMiddleware.fetchWithPublicKey,
//   PolicyController.registerPolicyMountingPoint(['three.module.get']),
//   moduleController.prepareQueryFromReq(),
//   moduleController.getAll(null, { enableLastModifiedCaching: true }),
// );
//
// router.get(
//   ControllerMiddleware.getOneRoute(),
//   AppMiddleware.fetchWithPublicKey,
//   PolicyController.registerPolicyMountingPoint(['three.module.get']),
//   moduleController.getOne(),
// );
//
// router.post(
//   ControllerMiddleware.postRoute(),
//   AppMiddleware.fetchWithPublicKey,
//   PolicyController.registerPolicyMountingPoint(['three.module.write', 'three.module.post']),
//   moduleController.post(),
// );
//
// router.put(
//   ControllerMiddleware.putRoute(),
//   AppMiddleware.fetchWithPublicKey,
//   PolicyController.registerPolicyMountingPoint(['three.module.write', 'three.module.put']),
//   moduleController.put(),
// );
//
// router.delete(
//   ControllerMiddleware.deleteRoute(),
//   AppMiddleware.fetchWithPublicKey,
//   PolicyController.registerPolicyMountingPoint(['three.module.write', 'three.module.delete']),
//   moduleController.delete(),
// );

/** The express router handling three module http requests */
export { router as ThreeModuleController };
