import { CheckerJsonOutput, CheckerModuleIOTypeValue } from './checker-interfaces';
import { CheckerModuleType } from './checker-internals';
import { CheckerModuleBaseModel, CheckerFlowModel, CheckerModuleIOType, CheckerModuleIOTypeOptions } from './checker-internals';
import { CheckerModuleOutput, CheckerOutput, CheckerModuleTypeOptions } from './checker-internals';
import { ThreeSiteModel } from '../site.model';
import { model, type, io, query, validate, ObjectId, mongo, AppModel } from '@bim/deco-api';
let debug = require('debug')('app:models:three:checker:module-reducer');

@model('checker_module')
export class CheckerModuleOutputModel extends CheckerModuleBaseModel implements CheckerModuleOutput {

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
  public allowedInputTypes: Array<CheckerModuleIOType> = ['number', 'numbers', 'string', 'strings', 'boolean', 'booleans'];
  
  @type.select({options: CheckerModuleTypeOptions})
  @io.toDocument
  @io.output
  @validate.required
  public moduleType: CheckerModuleType = 'output';

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
  public outputType: CheckerModuleIOType = 'json'

  public outputValue: CheckerModuleIOTypeValue;

  @type.string
  @io.toDocument
  @io.output
  public outputSummary: string;

  @type.array({type: 'object', options: {
    keys: {
      prefix: {type: 'string'},
      varName: {type: 'string'},
      suffix: {type: 'string'},
      display: {type: 'select', options: ['paragraph', 'blocks']}
    }
  }})
  @io.all
  public outputs: CheckerOutput[] = [];

  public async process(flow: CheckerFlowModel): Promise<void> {
    
    const output: CheckerJsonOutput[] = [];
    for (const outputConfig of this.outputs) {
      const inputValueType = flow.fetchInput(outputConfig.varName) || {
        type: 'string',
        value: '',
        ref: undefined,
        style: 'default'
      };
      // FIX: input is not required anymore
      // if (!inputValueType) {
      //   throw new Error('Input requested not found');
      // }
      if (!this.allowedInputTypes?.includes(inputValueType.type)) {
        throw new Error('Invalid input type');
      }
      if (Array.isArray(inputValueType.value)) {
        if (Array.isArray(inputValueType.ref) && inputValueType.ref.length !== inputValueType.value.length) {
          throw new Error('Ref array length must be the same than value array length');
        }
        if (Array.isArray(inputValueType.style) && inputValueType.style.length !== inputValueType.value.length) {
          throw new Error('Style array length must be the same than value array length');
        }
        for (let index = 0; index < inputValueType.value.length; index++) {
          const value = inputValueType.value[index];
          const ref = Array.isArray(inputValueType.ref) ? inputValueType.ref[index] : inputValueType.ref;
          const style = Array.isArray(inputValueType.style) ? inputValueType.style[index] : inputValueType.style;
          const type: any = inputValueType.type && inputValueType.type.substr(-1, 1) === 's' ? inputValueType.type.substr(0, inputValueType.type.length - 1) : inputValueType.type;
          output.push({
            prefix: outputConfig.prefix,
            value: value,
            type: type,
            ref: ref,
            style: style,
            suffix: outputConfig.suffix,
            display: outputConfig.display,
          });    
        }
      } else {
        output.push({
          prefix: outputConfig.prefix,
          value: inputValueType.value,
          type: inputValueType.type,
          ref: inputValueType.ref,
          style: inputValueType.style,
          suffix: outputConfig.suffix,
          display: outputConfig.display,
        });
      }
    }
    this.outputValue = output;
    flow.outputs.push({
      name: this.name,
      outputs: this.outputValue
    });
  }

  public async summary(): Promise<void> {
    let out = '';
    if (Array.isArray(this.outputValue)) {
      out = JSON.stringify((this.outputValue as any[]).map(ov => Object.assign({}, ov, {ref: undefined})));
    } else if (typeof this.outputValue === 'object') {
      out = JSON.stringify(Object.assign({}, this.outputValue, {ref: undefined}));
    }
    this.outputSummary = out.length > 200 ? out.substr(0, 200) : out;
    await this.update(['outputSummary']);
  }

}
