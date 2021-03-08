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
exports.ThreeReportAction = void 0;
const checker_internals_1 = require("./../../models/checkers/checker-internals");
const checker_report_model_1 = require("../../models/checker-report.model");
const pdf_checker_1 = require("../../helpers/pdf.checker");
let debug = require('debug')('app:actions:three:report');
class ThreeReportAction {
    static run(res) {
        var _a, _b, _c, _d;
        return __awaiter(this, void 0, void 0, function* () {
            debug('run');
            if (!((_b = (_a = res.locals.actions) === null || _a === void 0 ? void 0 : _a.variables) === null || _b === void 0 ? void 0 : _b.reportId)) {
                throw new Error('Three Report Action: Missing reportId variable');
            }
            debug('reportId', (_d = (_c = res.locals.actions) === null || _c === void 0 ? void 0 : _c.variables) === null || _d === void 0 ? void 0 : _d.reportId);
            const report = yield checker_report_model_1.ThreeCheckerReportModel.getOneWithId(res.locals.actions.variables.reportId);
            if (!report) {
                debug('report not found');
                throw new Error('Three Report Action: Report not found');
            }
            let scene = undefined;
            const reportOutput = {
                name: report.name,
                description: report.description,
                flows: []
            };
            debug('start processing', report.flows.length, 'flows');
            for (const flowId of report.flows) {
                debug('flowId', flowId);
                const flow = yield checker_internals_1.CheckerFlowModel.getOneWithId(flowId);
                if (!flow) {
                    throw new Error('Required flow not found');
                }
                scene = yield flow.process(scene);
                reportOutput.flows.push({
                    name: flow.name,
                    description: flow.description,
                    summaries: flow.modules.map(m => m.outputSummary),
                    outputs: flow.outputs
                });
            }
            res.locals.actions.variables.threeReportOutput = reportOutput;
            debug('reportOutput', reportOutput);
            // generate PDF
            const pdf = new pdf_checker_1.PdfChecker();
            yield pdf.create();
            pdf.printReportHead(reportOutput);
            for (const flowOutput of reportOutput.flows) {
                pdf.printFlowHead(flowOutput);
                pdf.printFlowOutputs(flowOutput);
            }
            const file = yield pdf.document.save();
            res.locals.actions.variables.threeReportFile = file;
            debug('file saved in res.locals.actions.variables.threeReportFile with length', file.length);
        });
    }
}
exports.ThreeReportAction = ThreeReportAction;
//# sourceMappingURL=three.report.action.js.map