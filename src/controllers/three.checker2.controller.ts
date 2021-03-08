import { PdfChecker } from '../helpers/pdf.checker';
import { ThreeCheckerReportModel } from './../models/checker-report.model';
import { CheckerFlowModel, modelsByType, ReportOutput, FlowOutput } from './../models/checkers/checker-internals';
import { CheckerModuleBaseModel } from './../models/checkers/checker-internals';
import { ThreeCoreControllerMiddleware } from './three.core.controller';
import { Router, Request, Response, NextFunction } from 'express';
import { ObjectId, ControllerMiddleware, Model, AppMiddleware, PolicyFactory, PolicyController, CacheLastModified, AuthMiddleware } from 'deco-api';
let debug = require('debug')('app:controller:three:geometry');

const router: Router = Router();


let flowController = new ThreeCoreControllerMiddleware(CheckerFlowModel);
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
    const data = await this.model.deco.db.collection(this.model.deco.collectionName).findOne({_id: elementId});
    const model = modelsByType[data?.moduleType];
    if (!model) {
      throw new Error('Invalid module type')
    }
    this.model = model;
    return Promise.resolve(elementId);
  }
}

let moduleController = new CheckerModuleControllerMiddleware(CheckerModuleBaseModel);


router.get(
  '/flow' + ControllerMiddleware.getAllRoute(),
  CacheLastModified.init(),
  AppMiddleware.fetchWithPublicKey,
  flowController.prepareQueryFromReq(),
  flowController.getAll(null, {enableLastModifiedCaching: false}),
  // CacheLastModified.send()
)

router.get(
  '/flow' + ControllerMiddleware.getOneRoute(),
  AppMiddleware.fetchWithPublicKey,
  flowController.getOne()
);

router.post(
  '/flow' + ControllerMiddleware.postRoute(),
  AppMiddleware.fetchWithPublicKey,
  AuthMiddleware.authenticate,
  AuthMiddleware.checkUserRoleAccess('adminThreeRoles'),
  // AppMiddleware.addAppIdToBody('appId'),
  flowController.post()
);

router.post(
  '/flow/:flowId/run',
  AppMiddleware.fetchWithPublicKey,
  AuthMiddleware.authenticate,
  fetchFlow(),
  PolicyController.addPolicy(flowIdPolicy()),
  AuthMiddleware.checkUserRoleAccess('adminThreeRoles'),
  runFlow(),
  reportController.sendLocals('output')
);

router.put(
  '/flow' + ControllerMiddleware.putRoute(),
  AppMiddleware.fetchWithPublicKey,
  AuthMiddleware.authenticate,
  AuthMiddleware.checkUserRoleAccess('adminThreeRoles'),
  // AppMiddleware.addAppIdToBody('appId'),
  flowController.put()
);

router.delete(
  '/flow' + ControllerMiddleware.deleteRoute(),
  AppMiddleware.fetchWithPublicKey,
  AuthMiddleware.authenticate,
  AuthMiddleware.checkUserRoleAccess('adminThreeRoles'),
  flowController.getOne({ignoreDownload: true, ignoreOutput: true, ignoreSend: true}),
  removeFlowFromAllReports(),
  deleteAllModules(),
  flowController.delete()
);

router.get(
  '/flow/:flowId/module' + ControllerMiddleware.getAllRoute(),
  CacheLastModified.init(),
  AppMiddleware.fetchWithPublicKey,
  AuthMiddleware.authenticate,
  fetchFlow(),
  PolicyController.addPolicy(flowIdPolicy()),
  moduleController.prepareQueryFromReq(),
  moduleController.getAll(null, {enableLastModifiedCaching: false}),
  // CacheLastModified.send()
);

router.get(
  '/flow/:flowId/module' + ControllerMiddleware.getOneRoute(),
  AppMiddleware.fetchWithPublicKey,
  AuthMiddleware.authenticate,
  fetchFlow(),
  PolicyController.addPolicy(flowIdPolicy()),
  moduleController.getOne()
);

router.post(
  '/flow/:flowId/module' + ControllerMiddleware.postRoute(),
  AppMiddleware.fetchWithPublicKey,
  AuthMiddleware.authenticate,
  fetchFlow(),
  PolicyController.addPolicy(flowIdPolicy()),
  AuthMiddleware.checkUserRoleAccess('adminThreeRoles'),
  // AppMiddleware.addAppIdToBody('appId'),
  moduleController.post({ignoreOutput: false, ignoreSend: true}),
  addModuleToFlow()
);

router.put(
  '/flow/:flowId/module' + ControllerMiddleware.putRoute(),
  AppMiddleware.fetchWithPublicKey,
  AuthMiddleware.authenticate,
  fetchFlow(),
  PolicyController.addPolicy(flowIdPolicy()),
  AuthMiddleware.checkUserRoleAccess('adminThreeRoles'),
  // AppMiddleware.addAppIdToBody('appId'),
  moduleController.put()
);

router.delete(
  '/flow/:flowId/module' + ControllerMiddleware.deleteRoute(),
  AppMiddleware.fetchWithPublicKey,
  AuthMiddleware.authenticate,
  fetchFlow(),
  PolicyController.addPolicy(flowIdPolicy()),
  AuthMiddleware.checkUserRoleAccess('adminThreeRoles'),
  moduleController.delete()
);

router.get(
  '/report' + ControllerMiddleware.getAllRoute(),
  AppMiddleware.fetchWithPublicKey,
  AuthMiddleware.authenticate,
  AuthMiddleware.checkUserRoleAccess('adminThreeRoles'),
  reportController.prepareQueryFromReq(),
  reportController.getAll(null, {enableLastModifiedCaching: false})
);

router.get(
  '/report' + ControllerMiddleware.getOneRoute(),
  AppMiddleware.fetchWithPublicKey,
  AuthMiddleware.authenticate,
  AuthMiddleware.checkUserRoleAccess('adminThreeRoles'),
  reportController.getOne()
);

router.get(
  '/report' + ControllerMiddleware.getOneRoute() + '/run',
  AppMiddleware.fetchWithPublicKey,
  AuthMiddleware.authenticate,
  AuthMiddleware.checkUserRoleAccess('adminThreeRoles'),
  reportController.getOne({ignoreDownload: true, ignoreSend: true, ignoreOutput: true}),
  runReport(),
  reportController.sendLocals('output')
);

router.post(
  '/report' + ControllerMiddleware.postRoute(),
  AppMiddleware.fetchWithPublicKey,
  AuthMiddleware.authenticate,
  AuthMiddleware.checkUserRoleAccess('adminThreeRoles'),
  // AppMiddleware.addAppIdToBody('appId'),
  reportController.post()
);

router.put(
  '/report' + ControllerMiddleware.putRoute(),
  AppMiddleware.fetchWithPublicKey,
  AuthMiddleware.authenticate,
  AuthMiddleware.checkUserRoleAccess('adminThreeRoles'),
  // AppMiddleware.addAppIdToBody('appId'),
  reportController.put()
);

router.delete(
  '/report' + ControllerMiddleware.deleteRoute(),
  AppMiddleware.fetchWithPublicKey,
  AuthMiddleware.authenticate,
  AuthMiddleware.checkUserRoleAccess('adminThreeRoles'),
  reportController.delete()
);



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
    CheckerFlowModel.getOneWithQuery({appId: res.locals.app._id, _id: flowId}).then((element) => {
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
    const flow: CheckerFlowModel = res.locals.flow;
    const rightInstance = flow instanceof CheckerFlowModel;
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
    const rightInstance = res.locals.element instanceof CheckerFlowModel;
    if (!rightInstance) return next(new Error('Invalid flow'));
    const flowId = (res.locals.element as CheckerFlowModel)._id;

    ThreeCheckerReportModel.deco.db.collection(ThreeCheckerReportModel.deco.collectionName).update({
      flows: flowId
    }, {$pull: {flows: flowId}}, {multi: true}).then(() => {
      next();
    }).catch(next);
  }
}

function deleteAllModules() {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!res.locals.app) return next(new Error('Missing app')); // not required anymore as this is handled by policy
    if (!res.locals.element) return next(new Error('Missing element'));
    const rightInstance = res.locals.element instanceof CheckerFlowModel;
    if (!rightInstance) return next(new Error('Invalid flow'));
    const flow = (res.locals.element as CheckerFlowModel);

    CheckerModuleBaseModel.deco.db.collection(CheckerModuleBaseModel.deco.collectionName).remove({_id: {$in: flow.modulesIds}}).then(() => {
      next();
    }).catch(next);
  }
}

function runFlow() {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!res.locals.app) return next(new Error('Missing app')); // not required anymore as this is handled by policy
    if (!req.params.flowId) return next(new Error('Missing flowId'));
    if (!res.locals.flow) return next(new Error('Missing flow'));
    const flow: CheckerFlowModel = res.locals.flow;
    const rightInstance = flow instanceof CheckerFlowModel;
    if (!rightInstance) return next(new Error('Invalid flow instance'));
    
    flow.process().then(async () => {
      const flowOutput: FlowOutput = {
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
        let scene: THREE.Scene | undefined = undefined;
        const reportOutput: ReportOutput = {
          name: report.name,
          description: report.description,
          flows: []
        };
        for (const flowId of report.flows) {
          const flow = await CheckerFlowModel.getOneWithId(flowId);
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
