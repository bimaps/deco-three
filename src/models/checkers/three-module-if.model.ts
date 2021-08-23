import { CheckerModuleIOStyle, CheckerModuleIOStyleOptions } from './checker-interfaces';
import { CheckerModuleType } from './checker-internals';
import { ThreeModuleBaseModel, ThreeRuleModel, CheckerModuleIOType, CheckerModuleIOTypeOptions } from './checker-internals';
import { CheckerModuleTypeOptions, CheckerModuleIf, CheckerModuleIfOperations, CheckerValueCondition } from './checker-internals';
import { ThreeSiteModel } from '../site.model';
import { model, type, io, query, validate, ObjectId, mongo, AppModel } from '@bim/deco-api';

let debug = require('debug')('app:models:three:checker:module-if');

@model('three_module')
export class ThreeModuleIfModel extends ThreeModuleBaseModel implements CheckerModuleIf {

  @type.id
  public _id: ObjectId;

  @type.model({model: AppModel})
  @io.input
  @io.toDocument
  @query.filterable()
  @validate.required
  @mongo.index({type: 'single'})
  public appId: ObjectId;

  @type.model({model: ThreeSiteModel})
  @io.all
  @query.filterable()
  @validate.required
  @mongo.index({type: 'single'})
  public siteId: ObjectId;

  @type.select({options: CheckerModuleIOTypeOptions, multiple: true})
  @io.toDocument
  @io.output
  public allowedInputTypes: Array<CheckerModuleIOType> = ['numbers', 'strings', 'number', 'string'];
  
  @type.select({options: CheckerModuleTypeOptions})
  @io.toDocument
  @io.output
  @validate.required
  public moduleType: CheckerModuleType = 'if';

  @type.string
  @io.all
  public name: string = '';

  @type.string
  @io.all
  @validate.required
  public inputVarName?: string;

  @type.string
  @io.all
  @validate.required
  public outputVarName: string;

  @type.select({options: CheckerModuleTypeOptions, multiple: false})
  @io.toDocument
  @io.output
  public outputType: CheckerModuleIOType;

  public outputValue: string[] | string | number[] | number | boolean[] | boolean;

  @type.string
  @io.toDocument
  @io.output
  public outputSummary: string;

  @type.any
  @io.all
  public defaultOutputValue: number | string | boolean;

  @type.select({options: CheckerModuleIOStyleOptions})
  @io.all
  public defaultOutputStyle: CheckerModuleIOStyle;
  
  @type.array({type: 'object', options: {
    keys: {
      conditions: {type: 'array', options: {type: 'object', options: {
        keys: {
          operation: {type: 'string'},
          value: {type: 'any'},
        }
      }}},
      conditionsOperator: {type: 'select', options: ['and', 'or']},
      outputValue: {type: 'any'},
      outputStyle: {type: 'select', options: CheckerModuleIOStyleOptions}
    }
  }})
  @io.all
  public operations: CheckerModuleIfOperations;

  private flow: ThreeRuleModel;

  public async process(flow: ThreeRuleModel): Promise<void> {
    this.flow = flow;
    super.process(flow);

    if (this.defaultOutputValue && typeof this.defaultOutputValue !== 'string' && typeof this.defaultOutputValue !== 'number' && typeof this.defaultOutputValue !== 'boolean') {
      throw new Error('If output value type must be string, number or boolean');
    }

    for (const operation of this.operations) {
      if (this.defaultOutputValue && operation.outputValue && typeof operation.outputValue !== typeof this.defaultOutputValue) {
        throw new Error('All output value must be of identical type');
      }
    }

    if (this.currentInputType === 'numbers' || this.currentInputType === 'strings' || this.currentInputType === 'booleans') {
      const inputs = this.currentInput as number[] | string[] | boolean[];
      const outputs: number[] | string[] | boolean[] = []
      const styles: CheckerModuleIOStyle[] = [];
      for (const key in inputs) {
        const input = inputs[key];
        const out = this.processOperationsForInput(input, this.operations);
        outputs[key] = out.value || '';
        styles[key] = out.style;
      }
      this.outputValue = outputs;
      this.outputStyle = styles;
    } else if (this.currentInputType === 'number' || this.currentInputType === 'string' || this.currentInput === 'boolean') {
      const input = this.currentInput as string | number | boolean;
      const out = this.processOperationsForInput(input, this.operations);
      this.outputValue = out.value || '';
      this.outputStyle = out.style;
    }

    this.outputType = (typeof this.defaultOutputValue) as 'string' | 'number' | 'boolean';
    this.outputReference = this.currentInputRef;
    if (Array.isArray(this.outputValue)) {
      this.outputType += 's';
    }
  }

  public processOperationsForInput(input: boolean | number | string, operations: CheckerModuleIfOperations): {value: boolean | number | string | undefined, style: CheckerModuleIOStyle} {
    for (const operation of operations) {
      let valid = false;
      for (let condition of operation.conditions) {
        valid = this.flow.compareValue(input, condition);
        if (valid && operation.conditionsOperator === 'or') {
          break;
        }
        if (!valid && operation.conditionsOperator === 'and') {
          break;
        }
      }
      if (valid) {
        return {value: operation.outputValue || input, style: operation.outputStyle};
      }
    }
    return {value: this.defaultOutputValue || input, style: this.defaultOutputStyle};
  }

  public isConditionTrue(input: boolean | number | string, condition: CheckerValueCondition): boolean {
    return false;
  }

  public async summary(): Promise<void> {
    if (Array.isArray(this.outputValue)) {
      this.outputSummary = this.outputValue.slice(0, 3).join(', ');
    } else {
      const out = this.outputValue || '';
      this.outputSummary = out.toString();
    }
  }

}
