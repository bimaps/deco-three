import { CheckerJsonOutput, ReportOutput, FlowOutput } from './../models/checkers/checker-internals';
import { PDF, PDFTextBlock } from 'deco-api';

export class PdfChecker extends PDF {

  public fontSizeHeader: {[key: number]: number} = {
    1: 32,
    2: 20,
    3: 14,
    4: 10,
    5: 10,
    6: 10
  };

  public printReportHead(reportOutput: ReportOutput) {
    const block = new PDFTextBlock(this);
    block.fontSizeHeader = this.fontSizeHeader;
    block.fontSize = 10;
    block.text = `# ${reportOutput.name}`;
    block.text += "\n ";
    if (reportOutput.description) {
      block.text += "\n "
      block.text += `${reportOutput.description}`;
    }
    block.apply();
  }

  public colors: {[key: string]: string} = {
    default: '',
    correct: '0.2,0.8,0',
    incorrect: '1,0,0',
    danger: '1,0.5,0',
    info: '0,0,1',
  };

  public printFlowHead(flowOutput: FlowOutput) {
    const block = new PDFTextBlock(this);
    block.fontSizeHeader = this.fontSizeHeader;
    block.fontSize = 10;
    block.text = `## ${flowOutput.name}`;
    block.text += "\n ";
    if (flowOutput.description) {
      block.text += "\n "
      block.text += `${flowOutput.description}`;
    }
    block.apply();
  }

  public printFlowOutputs(flowOutput: FlowOutput) {
    const block = new PDFTextBlock(this);
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
        this.printValue(block, output)
        if (output.display === 'blocks') {
          block.text += "\n ";
        }
        block.text += `${output.suffix}`;
        block.text += "\n ";
      }
    }
    block.apply();
  }

  public printValue(block: PDFTextBlock, output: CheckerJsonOutput): void {
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
    const s: any = output.style;
    const color: string = this.colors[s];
    if (value && color) {
      value = ` (color:${color}) **${value}** (color:0) `;
    }
    block.text += `${value}`;
  }

  
}