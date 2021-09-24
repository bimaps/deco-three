import { PdfChecker } from '../helpers/pdf.checker';
import { ThreeCheckerReportModel } from './../models/checker-report.model';
import { RuleModel, modelsByType, ReportOutput, RuleOutput } from './../models/checkers/checker-internals';
import { RuleModuleBaseModel } from './../models/checkers/checker-internals';
import { ThreeCoreControllerMiddleware } from './three.core.controller';
import { Router, Request, Response, NextFunction } from 'express';
import {
  ObjectId,
  ControllerMiddleware,
  Model,
  AppMiddleware,
  PolicyFactory,
  PolicyController,
  CacheLastModified
} from '@bim/deco-api';

let debug = require('debug')('app:controller:three:geometry');

const router: Router = Router();


/** @deprecated Flows are now rules and are not tied to reporting anymore  */
let flowController = new ThreeCoreControllerMiddleware(RuleModel);
/** @deprecated not tied to reporting anymore */
let reportController = new ThreeCoreControllerMiddleware(ThreeCheckerReportModel);

class CheckerModuleControllerMiddleware extends ControllerMiddleware {

  public getOneElement(element: Model, req: Request, res: Response): Promise<Model> {
    return Promise.resolve(element);
  }

  public async getOneElementId(elementId: string | ObjectId, req: Request, res: Response): Promise<string | ObjectId> {
    return this.setModelFromModuleType(elementId, req, res);
  }

  public async putElementId(elementId: string | ObjectId, req: Request, res: Response): Promise<string | ObjectId> {
    return this.setModelFromModuleType(elementId, req, res);
  }

  public async setModelFromModuleType(elementId: string | ObjectId, req: Request, res: Response): Promise<string | ObjectId> {
    // here the idea is to fetch the type of the element and set the .model property accordingly
    if (typeof elementId === 'string') {
      try {
        elementId = new ObjectId(elementId);
      } catch (_error) {
        throw new Error('Invalid elementId');
      }
    }
    const data = await this.model.deco.db.collection(this.model.deco.collectionName).findOne({ _id: elementId });
    const model = modelsByType[data?.moduleType];
    if (!model) {
      throw new Error('Invalid module type')
    }
    this.model = model;
    return Promise.resolve(elementId);
  }
}

/** @deprecated Modules are not referencing Flows/rules anymore. Rules are now composed by modules  */
let moduleController = new CheckerModuleControllerMiddleware(RuleModuleBaseModel);

router.use(flowController.registerPolicyMountingPoint(['three.flow']))
router.use(reportController.registerPolicyMountingPoint(['three.report']))


router.get(
    '/flow' + ControllerMiddleware.getAllRoute(),
    AppMiddleware.fetchWithPublicKey,
    flowController.registerPolicyMountingPoint(['three.flow.get']),
    // CacheLastModified.init(),
    flowController.prepareQueryFromReq(),
    flowController.getAll(null, { enableLastModifiedCaching: false }),
    // CacheLastModified.send()
)

router.get(
    '/flow' + ControllerMiddleware.getOneRoute(),
    AppMiddleware.fetchWithPublicKey,
    flowController.registerPolicyMountingPoint(['three.flow.get']),
    flowController.getOne()
);

router.post(
    '/flow' + ControllerMiddleware.postRoute(),
    AppMiddleware.fetchWithPublicKey,
    flowController.registerPolicyMountingPoint(['three.flow.write', 'three.flow.post']),
    flowController.post()
);

router.post(
    '/flow/:flowId/run',
    AppMiddleware.fetchWithPublicKey,
    fetchFlow(),
    PolicyController.addPolicy(flowIdPolicy()),
    flowController.registerPolicyMountingPoint(['three.flow.run']),
    runFlow(),
    reportController.sendLocals('output')
);

router.put(
    '/flow' + ControllerMiddleware.putRoute(),
    AppMiddleware.fetchWithPublicKey,
    flowController.registerPolicyMountingPoint(['three.flow.write', 'three.flow.put']),
    flowController.put()
);

router.delete(
    '/flow' + ControllerMiddleware.deleteRoute(),
    AppMiddleware.fetchWithPublicKey,
    flowController.registerPolicyMountingPoint(['three.flow.write', 'three.flow.delete']),
    flowController.getOne({ ignoreDownload: true, ignoreOutput: true, ignoreSend: true }),
    removeFlowFromAllReports(),
    deleteAllModules(),
    flowController.delete()
);

router.get(
    '/flow/:flowId/module' + ControllerMiddleware.getAllRoute(),
    CacheLastModified.init(),
    AppMiddleware.fetchWithPublicKey,
    fetchFlow(),
    PolicyController.addPolicy(flowIdPolicy()),
    flowController.registerPolicyMountingPoint(['three.flow.module', 'three.flow.module.get']),
    moduleController.prepareQueryFromReq(),
    moduleController.getAll(null, { enableLastModifiedCaching: false }),
    // CacheLastModified.send()
);

router.get(
    '/flow/:flowId/module' + ControllerMiddleware.getOneRoute(),
    AppMiddleware.fetchWithPublicKey,
    fetchFlow(),
    PolicyController.addPolicy(flowIdPolicy()),
    flowController.registerPolicyMountingPoint(['three.flow.module', 'three.flow.module.get']),
    moduleController.getOne()
);

router.post(
    '/flow/:flowId/module' + ControllerMiddleware.postRoute(),
    AppMiddleware.fetchWithPublicKey,
    fetchFlow(),
    PolicyController.addPolicy(flowIdPolicy()),
    flowController.registerPolicyMountingPoint(['three.flow.module', 'three.flow.module.write', 'three.flow.module.post']),
    moduleController.post({ ignoreOutput: false, ignoreSend: true }),
    addModuleToFlow()
);

router.put(
    '/flow/:flowId/module' + ControllerMiddleware.putRoute(),
    AppMiddleware.fetchWithPublicKey,
    fetchFlow(),
    PolicyController.addPolicy(flowIdPolicy()),
    flowController.registerPolicyMountingPoint(['three.flow.module', 'three.flow.module.write', 'three.flow.module.put']),
    moduleController.put()
);

router.delete(
    '/flow/:flowId/module' + ControllerMiddleware.deleteRoute(),
    AppMiddleware.fetchWithPublicKey,
    fetchFlow(),
    PolicyController.addPolicy(flowIdPolicy()),
    flowController.registerPolicyMountingPoint(['three.flow.module', 'three.flow.module.write', 'three.flow.module.delete']),
    moduleController.delete()
);

router.get(
    '/report' + ControllerMiddleware.getAllRoute(),
    AppMiddleware.fetchWithPublicKey,
    reportController.prepareQueryFromReq(),
    flowController.registerPolicyMountingPoint(['three.report.get']),
    reportController.getAll(null, { enableLastModifiedCaching: false })
);

router.get(
    '/report' + ControllerMiddleware.getOneRoute(),
    AppMiddleware.fetchWithPublicKey,
    flowController.registerPolicyMountingPoint(['three.report.get']),
    reportController.getOne()
);

router.get(
    '/report' + ControllerMiddleware.getOneRoute() + '/run',
    AppMiddleware.fetchWithPublicKey,
    flowController.registerPolicyMountingPoint(['three.report.run']),
    reportController.getOne({ ignoreDownload: true, ignoreSend: true, ignoreOutput: true }),
    runReport(),
    reportController.sendLocals('output')
);

router.post(
    '/report' + ControllerMiddleware.postRoute(),
    flowController.registerPolicyMountingPoint(['three.report.write', 'three.report.post']),
    AppMiddleware.fetchWithPublicKey,
    reportController.post()
);

router.put(
    '/report' + ControllerMiddleware.putRoute(),
    flowController.registerPolicyMountingPoint(['three.report.write', 'three.report.put']),
    AppMiddleware.fetchWithPublicKey,
    reportController.put()
);

router.delete(
    '/report' + ControllerMiddleware.deleteRoute(),
    flowController.registerPolicyMountingPoint(['three.report.write', 'three.report.delete']),
    AppMiddleware.fetchWithPublicKey,
    reportController.delete()
);


/** @deprecated Replaced by a more generic mechanism (rules and modules are not tied to reporting anymore) */
export const ThreeCheckerController: Router = router;

function fetchFlow() {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!res.locals.app) return next(new Error('Missing app')); // not required anymore as this is handled by policy
    if (!req.params.flowId) return next(new Error('Missing flowId'));
    let flowId: ObjectId;
    try {
      flowId = new ObjectId(req.params.flowId);
    } catch (error) {
      return next(new Error('Invalid flowId'));
    }
    RuleModel.getOneWithQuery({ appId: res.locals.app._id, _id: flowId }).then((element) => {
      if (element) {
        res.locals.flow = element;
        req.body.flowId = element._id.toString();
        return next();
      }
      throw new Error('Flow not found');
    }).catch(next);
  }
}

function flowIdPolicy() {
  return PolicyFactory.keyMustEqual('flowId', 'res.locals', 'flow._id');
}

function addModuleToFlow() {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!res.locals.app) return next(new Error('Missing app')); // not required anymore as this is handled by policy
    if (!res.locals.element) return next(new Error('Missing element'));
    if (!res.locals.element.id) return next(new Error('Missing element id'));
    if (!req.params.flowId) return next(new Error('Missing flowId'));
    if (!res.locals.flow) return next(new Error('Missing flow'));
    const flow: RuleModel = res.locals.flow;
    const rightInstance = flow instanceof RuleModel;
    if (!rightInstance) return next(new Error('Invalid flow instance'));

    if (!Array.isArray(flow.modulesIds)) {
      flow.modulesIds = [];
    }
    flow.modulesIds.push(res.locals.element.id);
    flow.update(['modulesIds']).then(() => {
      res.send(res.locals.element);
    }).catch((error) => {
      next(error);
    });
  }
}

function removeFlowFromAllReports() {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!res.locals.app) return next(new Error('Missing app')); // not required anymore as this is handled by policy
    if (!res.locals.element) return next(new Error('Missing element'));
    const rightInstance = res.locals.element instanceof RuleModel;
    if (!rightInstance) return next(new Error('Invalid flow'));
    const flowId = (res.locals.element as RuleModel)._id;

    ThreeCheckerReportModel.deco.db.collection(ThreeCheckerReportModel.deco.collectionName).update({
      flows: flowId
    }, { $pull: { flows: flowId } }, { multi: true }).then(() => {
      next();
    }).catch(next);
  }
}

function deleteAllModules() {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!res.locals.app) return next(new Error('Missing app')); // not required anymore as this is handled by policy
    if (!res.locals.element) return next(new Error('Missing element'));
    const rightInstance = res.locals.element instanceof RuleModel;
    if (!rightInstance) return next(new Error('Invalid flow'));
    const flow = (res.locals.element as RuleModel);

    RuleModuleBaseModel.deco.db.collection(RuleModuleBaseModel.deco.collectionName).remove({ _id: { $in: flow.modulesIds } }).then(() => {
      next();
    }).catch(next);
  }
}

function runFlow() {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!res.locals.app) return next(new Error('Missing app')); // not required anymore as this is handled by policy
    if (!req.params.flowId) return next(new Error('Missing flowId'));
    if (!res.locals.flow) return next(new Error('Missing flow'));
    const flow: RuleModel = res.locals.flow;
    const rightInstance = flow instanceof RuleModel;
    if (!rightInstance) return next(new Error('Invalid flow instance'));

    flow.process().then(async () => {
      const flowOutput: RuleOutput = {
        name: flow.name,
        description: flow.description,
        summaries: flow.modules.map(m => m.outputSummary),
        outputs: flow.getOutputs()
      }
      res.locals.output = flowOutput;
      if (!req.query.pdf) {
        next();
      } else {
        // generate PDF
        const pdf = new PdfChecker();
        await pdf.create();
        pdf.printFlowHead(flowOutput);
        pdf.printFlowOutputs(flowOutput);
        const file = await pdf.document.save();
        const fileName = flowOutput.name + '.pdf';
        res.writeHead(200, {
          'Content-Type': 'application/pdf',
          'Content-Disposition': 'attachment; filename=' + fileName,
          'Content-Length': file.length
        });
        res.end(Buffer.from(file));
      }
    }).catch((error) => {
      next(error);
    });
  }
}

function runReport() {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!res.locals.app) return next(new Error('Missing app')); // not required anymore as this is handled by policy
    if (!res.locals.element) return next(new Error('Missing element'));
    const rightInstance = res.locals.element instanceof ThreeCheckerReportModel;
    if (!rightInstance) return next(new Error('Invalid report instance'));
    const report: ThreeCheckerReportModel = res.locals.element;

    new Promise(async (resolve, reject) => {
      try {
        let scene: THREE.Scene | undefined = undefined;
        const reportOutput: ReportOutput = {
          name: report.name,
          description: report.description,
          flows: []
        };
        for (const ruleId of report.ruleIds) {
          const flow = await RuleModel.getOneWithId(ruleId);
          if (!flow) {
            throw new Error('Required flow not found');
          }
          scene = await flow.process(scene);
          reportOutput.flows.push({
            name: flow.name,
            description: flow.description,
            summaries: flow.modules.map(m => m.outputSummary),
            outputs: flow.getOutputs()
          })
        }
        if (req.query.pdf) {
          // generate PDF
          const pdf = new PdfChecker();
          await pdf.create();
          pdf.printReportHead(reportOutput);
          for (const flowOutput of reportOutput.flows) {
            pdf.printFlowHead(flowOutput);
            pdf.printFlowOutputs(flowOutput);
          }
          const file = await pdf.document.save();
          const fileName = reportOutput.name + '.pdf';
          res.writeHead(200, {
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'attachment; filename=' + fileName,
            'Content-Length': file.length
          });
          res.end(Buffer.from(file));
        }
        resolve(reportOutput);
      } catch (error) {
        reject(error);
      }
    }).then(output => {

      res.locals.output = output;
      if (!req.query.pdf) {
        next();
      }
    }).catch(next);
  }
}
