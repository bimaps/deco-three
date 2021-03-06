import { CheckerModuleType } from './checker-internals';
import { CheckerModuleBaseModel, CheckerFlowModel, CheckerModuleIOType, CheckerModuleIOTypeOptions, CheckerModuleIORef } from './checker-internals';
import { CheckerModuleReducer, CheckerModuleTypeOptions, CheckerModuleReducerOperation, CheckerModuleReducerOperationOptions } from './checker-internals';
import { ThreeSiteModel } from '../site.model';
import { model, type, io, query, validate, ObjectId, mongo, AppModel } from 'deco-api';
let debug = require('debug')('app:models:three:checker:module-reducer');

@model('checker_module')
export class CheckerModuleReducerModel extends CheckerModuleBaseModel implements CheckerModuleReducer {

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
  public allowedInputTypes: Array<CheckerModuleIOType> = ['three-objects', 'numbers', 'strings'];
  
  @type.select({options: CheckerModuleTypeOptions})
  @io.toDocument
  @io.output
  @validate.required
  public moduleType: CheckerModuleType = 'reducer';

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

  @type.select({options: CheckerModuleIOTypeOptions, multiple: false})
  @io.toDocument
  @io.output
  public outputType: CheckerModuleIOType;

  public outputValue: string[] | string | number[] | number | boolean[] | boolean;

  @type.string
  @io.toDocument
  @io.output
  public outputSummary: string;

  @type.select({options: CheckerModuleReducerOperationOptions})
  @io.all
  public operation: CheckerModuleReducerOperation;

  public async process(flow: CheckerFlowModel): Promise<void> {
    super.process(flow);

    if (!Array.isArray(this.currentInput)) {
      throw new Error('Reducer module only accepts array as input');
    }

    let mathInput: number[];
    if (this.operation === 'min' || this.operation === 'max' || this.operation === 'average' || this.operation === 'sum') {
      if (this.currentInputType === 'numbers') {
        mathInput = this.currentInput as number[];
      } else if (this.currentInputType === 'strings') {
        mathInput = (this.currentInput as string[]).map(s => parseFloat(s));
      } else {
        throw new Error('Min, max, average and sum reducers modules only accepts number, numbers, string and strings as input');
      }
      this.outputType = 'number';
      if (this.operation === 'min') {
        // this.outputValue = Math.min(...mathInput); // very bad perf with spread for large arrays
        // const min = mathInput.reduce((m, n) => Math.min(m, n)); // average perf with reduce for large arrays
        const min = Math.min.apply(null, mathInput); // best perf with min.apply for large arras
        const refKeys = [...Object.keys(mathInput)].filter(i => mathInput[parseInt(i, 10)] === min);
        this.outputValue = min;
        const inputRefs = (this.currentInputRef as CheckerModuleIORef[]) || [];
        this.outputReference = inputRefs.filter((v, i) => refKeys.includes(i.toString()));
      } else if (this.operation === 'max') {
        // this.outputValue = Math.max(...mathInput);  // very bad perf with spread for large arrays
        // const max = mathInput.reduce((m, n) => Math.max(m, n)); // average perf with reduce for large arrays
        const max = Math.max.apply(null, mathInput); // best perf with max.apply for large arras
        const refKeys = [...Object.keys(mathInput)].filter(i => mathInput[parseInt(i, 10)] === max);
        this.outputValue = max;
        const inputRefs = (this.currentInputRef as CheckerModuleIORef[]) || [];
        this.outputReference = inputRefs.filter((v, i) => refKeys.includes(i.toString()));
      } else if (this.operation === 'sum') {
        this.outputReference = this.currentInputRef;
        this.outputValue = mathInput.reduce((a, b) => a + b, 0);
      } else if (this.operation === 'average') {
        this.outputValue = mathInput.reduce((a, b) => a + b, 0) / mathInput.length;
        this.outputReference = this.currentInputRef;
      }
    } else if (this.operation === 'count') {
      this.outputType = 'number';
      this.outputValue = this.currentInput.length;
      this.outputReference = this.currentInputRef;
    }
  }

  public async summary(): Promise<void> {
    let out = this.outputValue !== undefined ? this.outputValue : '';
    if (typeof out === 'number') {
      out = Math.round(out * 1000) / 1000;
    }
    this.outputSummary = out.toString();
    await this.update(['outputSummary']);
  }

}
