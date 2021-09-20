import { ThreeStyleModel } from './../models/style.model';
import { ThreeThemeModel } from './../models/theme.model';
import { ThreeCoreControllerMiddleware } from './three.core.controller';
import { Router, Request, Response, NextFunction } from 'express';
import { ControllerMiddleware, Query, AppMiddleware } from '@bim/deco-api';

let debug = require('debug')('app:controller:three:style');

const router: Router = Router();

let mdController = new ThreeCoreControllerMiddleware(ThreeStyleModel);

router.use(mdController.registerPolicyMountingPoint(['three.style']))

function removeStyleFromAllThemes() {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!res.locals.app) return next(new Error('Missing app')); // not required anymore as this is handled by policy
    if (!res.locals.element) return next(new Error('Missing element'));
    const rightInstance = res.locals.element instanceof ThreeStyleModel;
    if (!rightInstance) return next(new Error('Invalid style'));
    const styleId = (res.locals.element as ThreeStyleModel)._id;

    new Promise(async (resolve, reject) => {
      try {
        const themes = await ThreeThemeModel.getAll(new Query({ "rules.styles": styleId.toString() }));
        for (const theme of themes) {
          for (const rule of theme.rules) {
            const styleIndex = rule.styles.indexOf(styleId.toString());
            if (styleIndex !== -1) {
              rule.styles.splice(styleIndex, 1);
            }
          }
          await theme.update(['rules']);
        }
        resolve(null);
      } catch (error) {
        reject(error)
      }
    }).then(next).catch(next);
  }
}

router.get(
    ControllerMiddleware.getAllRoute(),
    AppMiddleware.fetchWithPublicKey,
    mdController.registerPolicyMountingPoint(['three.style.get']),
    mdController.prepareQueryFromReq(),
    mdController.getAll(null, { enableLastModifiedCaching: false })
);

router.get(
    ControllerMiddleware.getOneRoute(),
    AppMiddleware.fetchWithPublicKey,
    mdController.registerPolicyMountingPoint(['three.style.get']),
    mdController.getOne()
);

router.post(
    ControllerMiddleware.postRoute(),
    AppMiddleware.fetchWithPublicKey,
    mdController.registerPolicyMountingPoint(['three.style.write', 'three.style.post']),
    mdController.post()
);

router.put(
    ControllerMiddleware.putRoute(),
    AppMiddleware.fetchWithPublicKey,
    mdController.registerPolicyMountingPoint(['three.style.write', 'three.style.put']),
    mdController.put()
);

router.delete(
    ControllerMiddleware.deleteRoute(),
    AppMiddleware.fetchWithPublicKey,
    mdController.registerPolicyMountingPoint(['three.style.write', 'three.style.delete']),
    mdController.getOne({ ignoreDownload: true, ignoreOutput: true, ignoreSend: true }),
    removeStyleFromAllThemes(),
    mdController.delete()
);

export const ThreeStyleController: Router = router;