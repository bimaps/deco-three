import { ThreeThemeModel } from "./../models/theme.model";
import { ThreeCoreControllerMiddleware } from "./three.core.controller";
import { Router } from "express";
import { AppMiddleware, ControllerMiddleware } from "@bim/deco-api";

let debug = require("debug")("app:controller:three:theme");

const router: Router = Router();

let mdController = new ThreeCoreControllerMiddleware(ThreeThemeModel);

router.use(mdController.registerPolicyMountingPoint(["three.theme"]));

router.get(
  ControllerMiddleware.getAllRoute(),
  AppMiddleware.fetchWithPublicKey,
  mdController.registerPolicyMountingPoint(["three.theme.get"]),
  mdController.prepareQueryFromReq(),
  mdController.getAll(null, { enableLastModifiedCaching: false })
);

router.get(
  ControllerMiddleware.getOneRoute(),
  AppMiddleware.fetchWithPublicKey,
  mdController.registerPolicyMountingPoint(["three.theme.get"]),
  mdController.getOne()
);

router.post(
  ControllerMiddleware.postRoute(),
  AppMiddleware.fetchWithPublicKey,
  mdController.registerPolicyMountingPoint([
    "three.theme.write",
    "three.theme.post",
  ]),
  mdController.post()
);

router.put(
  ControllerMiddleware.putRoute(),
  AppMiddleware.fetchWithPublicKey,
  mdController.registerPolicyMountingPoint([
    "three.theme.write",
    "three.theme.put",
  ]),
  mdController.put()
);

router.delete(
  ControllerMiddleware.deleteRoute(),
  AppMiddleware.fetchWithPublicKey,
  mdController.registerPolicyMountingPoint([
    "three.theme.write",
    "three.theme.delete",
  ]),
  mdController.delete()
);

export const ThreeThemeController: Router = router;
