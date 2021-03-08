"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PdfChecker = void 0;
const deco_api_1 = require("deco-api");
class PdfChecker extends deco_api_1.PDF {
    constructor() {
        super(...arguments);
        this.fontSizeHeader = {
            1: 32,
            2: 20,
            3: 14,
            4: 10,
            5: 10,
            6: 10
        };
        this.colors = {
            default: '',
            correct: '0.2,0.8,0',
            incorrect: '1,0,0',
            danger: '1,0.5,0',
            info: '0,0,1',
        };
    }
    printReportHead(reportOutput) {
        const block = new deco_api_1.PDFTextBlock(this);
        block.fontSizeHeader = this.fontSizeHeader;
        block.fontSize = 10;
        block.text = `# ${reportOutput.name}`;
        block.text += "\n ";
        if (reportOutput.description) {
            block.text += "\n ";
            block.text += `${reportOutput.description}`;
        }
        block.apply();
    }
    printFlowHead(flowOutput) {
        const block = new deco_api_1.PDFTextBlock(this);
        block.fontSizeHeader = this.fontSizeHeader;
        block.fontSize = 10;
        block.text = `## ${flowOutput.name}`;
        block.text += "\n ";
        if (flowOutput.description) {
            block.text += "\n ";
            block.text += `${flowOutput.description}`;
        }
        block.apply();
    }
    printFlowOutputs(flowOutput) {
        const block = new deco_api_1.PDFTextBlock(this);
        block.fontSizeHeader = this.fontSizeHeader;
        block.fontSize = 10;
        for (const out of flowOutput.outputs) {
            block.text = `### ${out.name}`;
            block.text += "\n ";
            for (const output of out.outputs) {
                block.text += "\n ";
                block.text += `${output.prefix}`;
                if (output.display === 'blocks') {
                    block.text += "\n ";
                }
                this.printValue(block, output);
                if (output.display === 'blocks') {
                    block.text += "\n ";
                }
                block.text += `${output.suffix}`;
                block.text += "\n ";
            }
        }
        block.apply();
    }
    printValue(block, output) {
        let value = output.value;
        if (typeof value === 'number') {
            value = Math.round(value * 10000) / 10000;
        }
        if (typeof value !== 'string' && value.toString) {
            value = value.toString();
        }
        if (typeof value !== 'string') {
            throw new Error('Invalid value');
        }
        const s = output.style;
        const color = this.colors[s];
        if (value && color) {
            value = ` (color:${color}) **${value}** (color:0) `;
        }
        block.text += `${value}`;
    }
}
exports.PdfChecker = PdfChecker;
//# sourceMappingURL=pdf.checker.js.map