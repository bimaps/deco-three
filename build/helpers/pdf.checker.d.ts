import { CheckerJsonOutput, ReportOutput, FlowOutput } from './../models/checkers/checker-internals';
import { PDF, PDFTextBlock } from 'deco-api';
export declare class PdfChecker extends PDF {
    fontSizeHeader: {
        [key: number]: number;
    };
    printReportHead(reportOutput: ReportOutput): void;
    colors: {
        [key: string]: string;
    };
    printFlowHead(flowOutput: FlowOutput): void;
    printFlowOutputs(flowOutput: FlowOutput): void;
    printValue(block: PDFTextBlock, output: CheckerJsonOutput): void;
}
//# sourceMappingURL=pdf.checker.d.ts.map