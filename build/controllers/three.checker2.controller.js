"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThreeCheckerController = void 0;
const pdf_checker_1 = require("../helpers/pdf.checker");
const checker_report_model_1 = require("./../models/checker-report.model");
const checker_internals_1 = require("./../models/checkers/checker-internals");
const checker_internals_2 = require("./../models/checkers/checker-internals");
const three_core_controller_1 = require("./three.core.controller");
const express_1 = require("express");
const deco_api_1 = require("deco-api");
let debug = require('debug')('app:controller:three:geometry');
const router = express_1.Router();
let flowController = new three_core_controller_1.ThreeCoreControllerMiddleware(checker_internals_1.CheckerFlowModel);
let reportController = new three_core_controller_1.ThreeCoreControllerMiddleware(checker_report_model_1.ThreeCheckerReportModel);
class CheckerModuleControllerMiddleware extends deco_api_1.ControllerMiddleware {
    getOneElement(element, req, res) {
        return Promise.resolve(element);
    }
    getOneElementId(elementId, req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.setModelFromModuleType(elementId, req, res);
        });
    }
    putElementId(elementId, req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.setModelFromModuleType(elementId, req, res);
        });
    }
    setModelFromModuleType(elementId, req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // here the idea is to fetch the type of the element and set the .model property accordingly
            if (typeof elementId === 'string') {
                try {
                    elementId = new deco_api_1.ObjectId(elementId);
                }
                catch (_error) {
                    throw new Error('Invalid elementId');
                }
            }
            const data = yield this.model.deco.db.collection(this.model.deco.collectionName).findOne({ _id: elementId });
            const model = checker_internals_1.modelsByType[data === null || data === void 0 ? void 0 : data.moduleType];
            if (!model) {
                throw new Error('Invalid module type');
            }
            this.model = model;
            return Promise.resolve(elementId);
        });
    }
}
let moduleController = new CheckerModuleControllerMiddleware(checker_internals_2.CheckerModuleBaseModel);
router.use(flowController.registerPolicyMountingPoint(['three.flow']));
router.use(reportController.registerPolicyMountingPoint(['three.report']));
router.get('/flow' + deco_api_1.ControllerMiddleware.getAllRoute(), deco_api_1.AppMiddleware.fetchWithPublicKey, flowController.registerPolicyMountingPoint(['three.flow.get']), 
// CacheLastModified.init(),
flowController.prepareQueryFromReq(), flowController.getAll(null, { enableLastModifiedCaching: false }));
router.get('/flow' + deco_api_1.ControllerMiddleware.getOneRoute(), deco_api_1.AppMiddleware.fetchWithPublicKey, flowController.registerPolicyMountingPoint(['three.flow.get']), flowController.getOne());
router.post('/flow' + deco_api_1.ControllerMiddleware.postRoute(), deco_api_1.AppMiddleware.fetchWithPublicKey, flowController.registerPolicyMountingPoint(['three.flow.write', 'three.flow.post']), flowController.post());
router.post('/flow/:flowId/run', deco_api_1.AppMiddleware.fetchWithPublicKey, fetchFlow(), deco_api_1.PolicyController.addPolicy(flowIdPolicy()), flowController.registerPolicyMountingPoint(['three.flow.run']), runFlow(), reportController.sendLocals('output'));
router.put('/flow' + deco_api_1.ControllerMiddleware.putRoute(), deco_api_1.AppMiddleware.fetchWithPublicKey, flowController.registerPolicyMountingPoint(['three.flow.write', 'three.flow.put']), flowController.put());
router.delete('/flow' + deco_api_1.ControllerMiddleware.deleteRoute(), deco_api_1.AppMiddleware.fetchWithPublicKey, flowController.registerPolicyMountingPoint(['three.flow.write', 'three.flow.delete']), flowController.getOne({ ignoreDownload: true, ignoreOutput: true, ignoreSend: true }), removeFlowFromAllReports(), deleteAllModules(), flowController.delete());
router.get('/flow/:flowId/module' + deco_api_1.ControllerMiddleware.getAllRoute(), deco_api_1.CacheLastModified.init(), deco_api_1.AppMiddleware.fetchWithPublicKey, fetchFlow(), deco_api_1.PolicyController.addPolicy(flowIdPolicy()), flowController.registerPolicyMountingPoint(['three.flow.module', 'three.flow.module.get']), moduleController.prepareQueryFromReq(), moduleController.getAll(null, { enableLastModifiedCaching: false }));
router.get('/flow/:flowId/module' + deco_api_1.ControllerMiddleware.getOneRoute(), deco_api_1.AppMiddleware.fetchWithPublicKey, fetchFlow(), deco_api_1.PolicyController.addPolicy(flowIdPolicy()), flowController.registerPolicyMountingPoint(['three.flow.module', 'three.flow.module.get']), moduleController.getOne());
router.post('/flow/:flowId/module' + deco_api_1.ControllerMiddleware.postRoute(), deco_api_1.AppMiddleware.fetchWithPublicKey, fetchFlow(), deco_api_1.PolicyController.addPolicy(flowIdPolicy()), flowController.registerPolicyMountingPoint(['three.flow.module', 'three.flow.module.write', 'three.flow.module.post']), moduleController.post({ ignoreOutput: false, ignoreSend: true }), addModuleToFlow());
router.put('/flow/:flowId/module' + deco_api_1.ControllerMiddleware.putRoute(), deco_api_1.AppMiddleware.fetchWithPublicKey, fetchFlow(), deco_api_1.PolicyController.addPolicy(flowIdPolicy()), flowController.registerPolicyMountingPoint(['three.flow.module', 'three.flow.module.write', 'three.flow.module.put']), moduleController.put());
router.delete('/flow/:flowId/module' + deco_api_1.ControllerMiddleware.deleteRoute(), deco_api_1.AppMiddleware.fetchWithPublicKey, fetchFlow(), deco_api_1.PolicyController.addPolicy(flowIdPolicy()), flowController.registerPolicyMountingPoint(['three.flow.module', 'three.flow.module.write', 'three.flow.module.delete']), moduleController.delete());
router.get('/report' + deco_api_1.ControllerMiddleware.getAllRoute(), deco_api_1.AppMiddleware.fetchWithPublicKey, reportController.prepareQueryFromReq(), flowController.registerPolicyMountingPoint(['three.report.get']), reportController.getAll(null, { enableLastModifiedCaching: false }));
router.get('/report' + deco_api_1.ControllerMiddleware.getOneRoute(), deco_api_1.AppMiddleware.fetchWithPublicKey, flowController.registerPolicyMountingPoint(['three.report.get']), reportController.getOne());
router.get('/report' + deco_api_1.ControllerMiddleware.getOneRoute() + '/run', deco_api_1.AppMiddleware.fetchWithPublicKey, flowController.registerPolicyMountingPoint(['three.report.run']), reportController.getOne({ ignoreDownload: true, ignoreSend: true, ignoreOutput: true }), runReport(), reportController.sendLocals('output'));
router.post('/report' + deco_api_1.ControllerMiddleware.postRoute(), flowController.registerPolicyMountingPoint(['three.report.write', 'three.report.post']), deco_api_1.AppMiddleware.fetchWithPublicKey, reportController.post());
router.put('/report' + deco_api_1.ControllerMiddleware.putRoute(), flowController.registerPolicyMountingPoint(['three.report.write', 'three.report.put']), deco_api_1.AppMiddleware.fetchWithPublicKey, reportController.put());
router.delete('/report' + deco_api_1.ControllerMiddleware.deleteRoute(), flowController.registerPolicyMountingPoint(['three.report.write', 'three.report.delete']), deco_api_1.AppMiddleware.fetchWithPublicKey, reportController.delete());
exports.ThreeCheckerController = router;
function fetchFlow() {
    return (req, res, next) => {
        if (!res.locals.app)
            return next(new Error('Missing app')); // not required anymore as this is handled by policy
        if (!req.params.flowId)
            return next(new Error('Missing flowId'));
        let flowId;
        try {
            flowId = new deco_api_1.ObjectId(req.params.flowId);
        }
        catch (error) {
            return next(new Error('Invalid flowId'));
        }
        checker_internals_1.CheckerFlowModel.getOneWithQuery({ appId: res.locals.app._id, _id: flowId }).then((element) => {
            if (element) {
                res.locals.flow = element;
                req.body.flowId = element._id.toString();
                return next();
            }
            throw new Error('Flow not found');
        }).catch(next);
    };
}
function flowIdPolicy() {
    return deco_api_1.PolicyFactory.keyMustEqual('flowId', 'res.locals', 'flow._id');
}
function addModuleToFlow() {
    return (req, res, next) => {
        if (!res.locals.app)
            return next(new Error('Missing app')); // not required anymore as this is handled by policy
        if (!res.locals.element)
            return next(new Error('Missing element'));
        if (!res.locals.element.id)
            return next(new Error('Missing element id'));
        if (!req.params.flowId)
            return next(new Error('Missing flowId'));
        if (!res.locals.flow)
            return next(new Error('Missing flow'));
        const flow = res.locals.flow;
        const rightInstance = flow instanceof checker_internals_1.CheckerFlowModel;
        if (!rightInstance)
            return next(new Error('Invalid flow instance'));
        if (!Array.isArray(flow.modulesIds)) {
            flow.modulesIds = [];
        }
        flow.modulesIds.push(res.locals.element.id);
        flow.update(['modulesIds']).then(() => {
            res.send(res.locals.element);
        }).catch((error) => {
            next(error);
        });
    };
}
function removeFlowFromAllReports() {
    return (req, res, next) => {
        if (!res.locals.app)
            return next(new Error('Missing app')); // not required anymore as this is handled by policy
        if (!res.locals.element)
            return next(new Error('Missing element'));
        const rightInstance = res.locals.element instanceof checker_internals_1.CheckerFlowModel;
        if (!rightInstance)
            return next(new Error('Invalid flow'));
        const flowId = res.locals.element._id;
        checker_report_model_1.ThreeCheckerReportModel.deco.db.collection(checker_report_model_1.ThreeCheckerReportModel.deco.collectionName).update({
            flows: flowId
        }, { $pull: { flows: flowId } }, { multi: true }).then(() => {
            next();
        }).catch(next);
    };
}
function deleteAllModules() {
    return (req, res, next) => {
        if (!res.locals.app)
            return next(new Error('Missing app')); // not required anymore as this is handled by policy
        if (!res.locals.element)
            return next(new Error('Missing element'));
        const rightInstance = res.locals.element instanceof checker_internals_1.CheckerFlowModel;
        if (!rightInstance)
            return next(new Error('Invalid flow'));
        const flow = res.locals.element;
        checker_internals_2.CheckerModuleBaseModel.deco.db.collection(checker_internals_2.CheckerModuleBaseModel.deco.collectionName).remove({ _id: { $in: flow.modulesIds } }).then(() => {
            next();
        }).catch(next);
    };
}
function runFlow() {
    return (req, res, next) => {
        if (!res.locals.app)
            return next(new Error('Missing app')); // not required anymore as this is handled by policy
        if (!req.params.flowId)
            return next(new Error('Missing flowId'));
        if (!res.locals.flow)
            return next(new Error('Missing flow'));
        const flow = res.locals.flow;
        const rightInstance = flow instanceof checker_internals_1.CheckerFlowModel;
        if (!rightInstance)
            return next(new Error('Invalid flow instance'));
        flow.process().then(() => __awaiter(this, void 0, void 0, function* () {
            const flowOutput = {
                name: flow.name,
                description: flow.description,
                summaries: flow.modules.map(m => m.outputSummary),
                outputs: flow.getOutputs()
            };
            res.locals.output = flowOutput;
            if (!req.query.pdf) {
                next();
            }
            else {
                // generate PDF
                const pdf = new pdf_checker_1.PdfChecker();
                yield pdf.create();
                pdf.printFlowHead(flowOutput);
                pdf.printFlowOutputs(flowOutput);
                const file = yield pdf.document.save();
                const fileName = flowOutput.name + '.pdf';
                res.writeHead(200, {
                    'Content-Type': 'application/pdf',
                    'Content-Disposition': 'attachment; filename=' + fileName,
                    'Content-Length': file.length
                });
                res.end(Buffer.from(file));
            }
        })).catch((error) => {
            next(error);
        });
    };
}
function runReport() {
    return (req, res, next) => {
        if (!res.locals.app)
            return next(new Error('Missing app')); // not required anymore as this is handled by policy
        if (!res.locals.element)
            return next(new Error('Missing element'));
        const rightInstance = res.locals.element instanceof checker_report_model_1.ThreeCheckerReportModel;
        if (!rightInstance)
            return next(new Error('Invalid report instance'));
        const report = res.locals.element;
        new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                let scene = undefined;
                const reportOutput = {
                    name: report.name,
                    description: report.description,
                    flows: []
                };
                for (const flowId of report.flows) {
                    const flow = yield checker_internals_1.CheckerFlowModel.getOneWithId(flowId);
                    if (!flow) {
                        throw new Error('Required flow not found');
                    }
                    scene = yield flow.process(scene);
                    reportOutput.flows.push({
                        name: flow.name,
                        description: flow.description,
                        summaries: flow.modules.map(m => m.outputSummary),
                        outputs: flow.getOutputs()
                    });
                }
                if (req.query.pdf) {
                    // generate PDF
                    const pdf = new pdf_checker_1.PdfChecker();
                    yield pdf.create();
                    pdf.printReportHead(reportOutput);
                    for (const flowOutput of reportOutput.flows) {
                        pdf.printFlowHead(flowOutput);
                        pdf.printFlowOutputs(flowOutput);
                    }
                    const file = yield pdf.document.save();
                    const fileName = reportOutput.name + '.pdf';
                    res.writeHead(200, {
                        'Content-Type': 'application/pdf',
                        'Content-Disposition': 'attachment; filename=' + fileName,
                        'Content-Length': file.length
                    });
                    res.end(Buffer.from(file));
                }
                resolve(reportOutput);
            }
            catch (error) {
                reject(error);
            }
        })).then(output => {
            res.locals.output = output;
            if (!req.query.pdf) {
                next();
            }
        }).catch(next);
    };
}
//# sourceMappingURL=three.checker2.controller.js.map