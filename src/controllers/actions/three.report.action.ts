import { ReportOutput } from './../../models/checkers/checker-internals';
import { ThreeCheckerReportModel } from '../../models/checker-report.model';
import { PdfChecker } from '../../helpers/pdf.checker';
import { Response } from 'express';
import { RuleModel } from '../../models';

let debug = require('debug')('app:actions:three:report');

export class ThreeReportAction {
  public static async run(res: Response) {
    debug('run');
    if (!res.locals.actions?.variables?.reportId) {
      throw new Error('Three Report Action: Missing reportId variable');
    }
    debug('reportId', res.locals.actions?.variables?.reportId);
    const report = await ThreeCheckerReportModel.getOneWithId(res.locals.actions.variables.reportId);
    if (!report) {
      debug('report not found');
      throw new Error('Three Report Action: Report not found');
    }

    let scene: THREE.Scene | undefined = undefined;
    const reportOutput: ReportOutput = {
      name: report.name,
      description: report.description,
      flows: [],
    };
    debug('start processing', report.rules.length, 'flows');
    for (const flowId of report.ruleIds) {
      debug('flowId', flowId);
      const flow = await RuleModel.getOneWithId(flowId);
      if (!flow) {
        throw new Error('Required flow not found');
      }
      scene = await flow.process(scene);
      reportOutput.flows.push({
        name: flow.name,
        description: flow.description,
        summaries: flow._modules.map((m) => m.outputSummary),
        outputs: flow.outputs,
      });
    }
    res.locals.actions.variables.threeReportOutput = reportOutput;
    debug('reportOutput', reportOutput);

    // generate PDF
    const pdf = new PdfChecker();
    await pdf.create();
    pdf.printReportHead(reportOutput);
    for (const flowOutput of reportOutput.flows) {
      pdf.printFlowHead(flowOutput);
      pdf.printFlowOutputs(flowOutput);
    }
    const file = await pdf.document.save();
    res.locals.actions.variables.threeReportFile = file;
    debug('file saved in res.locals.actions.variables.threeReportFile with length', file.length);
  }
}
