import {AppMiddleware, ControllerMiddleware, PolicyController} from '@bim/deco-api';
import {Router} from 'express';
import {ThreeModuleBaseModel} from '../models';
import {ThreeModuleControllerMiddleware} from './three-module-controller.middleware';

const router: Router = Router();

const moduleController = new ThreeModuleControllerMiddleware(ThreeModuleBaseModel);

router.get(
    ControllerMiddleware.getAllRoute(),
    AppMiddleware.fetchWithPublicKey,
    PolicyController.registerPolicyMountingPoint(['three.module.get']),
    moduleController.prepareQueryFromReq(),
    moduleController.getAll(null, {enableLastModifiedCaching: true})
);

router.get(
    ControllerMiddleware.getOneRoute(),
    AppMiddleware.fetchWithPublicKey,
    PolicyController.registerPolicyMountingPoint(['three.module.get']),
    moduleController.getOne()
);

router.post(
    ControllerMiddleware.postRoute(),
    AppMiddleware.fetchWithPublicKey,
    PolicyController.registerPolicyMountingPoint(['three.module.write', 'three.module.post']),
    moduleController.post()
);

router.put(
    ControllerMiddleware.putRoute(),
    AppMiddleware.fetchWithPublicKey,
    PolicyController.registerPolicyMountingPoint(['three.module.write', 'three.module.put']),
    moduleController.put()
);

router.delete(
    ControllerMiddleware.deleteRoute(),
    AppMiddleware.fetchWithPublicKey,
    PolicyController.registerPolicyMountingPoint(['three.module.write', 'three.module.delete']),
    moduleController.delete()
);