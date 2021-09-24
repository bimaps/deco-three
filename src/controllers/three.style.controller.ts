import { ThreeStyleModel } from "./../models/style.model";
import { ThreeCoreControllerMiddleware } from "./three.core.controller";
import { Router } from "express";
import { AppMiddleware, ControllerMiddleware } from "@bim/deco-api";

let debug = require("debug")("app:controller:three:style");

const router: Router = Router();

let mdController = new ThreeCoreControllerMiddleware(ThreeStyleModel);

router.use(mdController.registerPolicyMountingPoint(["three.style"]));

router.get(
  ControllerMiddleware.getAllRoute(),
  AppMiddleware.fetchWithPublicKey,
  mdController.registerPolicyMountingPoint(["three.style.get"]),
  mdController.prepareQueryFromReq(),
  mdController.getAll(null, { enableLastModifiedCaching: false })
);

router.get(
  ControllerMiddleware.getOneRoute(),
  AppMiddleware.fetchWithPublicKey,
  mdController.registerPolicyMountingPoint(["three.style.get"]),
  mdController.getOne()
);

router.post(
  ControllerMiddleware.postRoute(),
  AppMiddleware.fetchWithPublicKey,
  mdController.registerPolicyMountingPoint([
    "three.style.write",
    "three.style.post",
  ]),
  mdController.post()
);

router.put(
  ControllerMiddleware.putRoute(),
  AppMiddleware.fetchWithPublicKey,
  mdController.registerPolicyMountingPoint([
    "three.style.write",
    "three.style.put",
  ]),
  mdController.put()
);

router.delete(
  ControllerMiddleware.deleteRoute(),
  AppMiddleware.fetchWithPublicKey,
  mdController.registerPolicyMountingPoint([
    "three.style.write",
    "three.style.delete",
  ]),
  mdController.getOne({
    ignoreDownload: true,
    ignoreOutput: true,
    ignoreSend: true,
  }),
  mdController.delete()
);

export const ThreeStyleController: Router = router;
