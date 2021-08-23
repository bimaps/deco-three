import { ThreeModuleType } from './checker-internals';
import { ThreeModuleBaseModel, ThreeRuleModel, ThreeModuleIOType, ThreeModuleIOTypeOptions } from './checker-internals';
import { ThreeModuleMath, ThreeModuleTypeOptions } from './checker-internals';
import { ThreeSiteModel } from '../site.model';
import { model, type, io, query, validate, ObjectId, mongo, AppModel } from '@bim/deco-api';
import * as math from 'mathjs';
let debug = require('debug')('app:models:three:checker:module-extract');

@model('three_module')
export class ThreeModuleMathModel extends ThreeModuleBaseModel implements ThreeModuleMath {

  @type.id
  public _id: ObjectId;

  @type.model({model: AppModel})
  @io.input
  @io.toDocument
  @query.filterable()
  @validate.required
  @mongo.index({type: 'single'})
  public appId: ObjectId;

  @type.select({options: ThreeModuleIOTypeOptions, multiple: true})
  @io.toDocument
  @io.output
  public allowedInputTypes: Array<ThreeModuleIOType> = ['numbers', 'strings', 'number', 'string'];
  
  @type.select({options: ThreeModuleTypeOptions})
  @io.toDocument
  @io.output
  @validate.required
  public moduleType: ThreeModuleType = 'math';

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

  @type.select({options: ThreeModuleIOTypeOptions, multiple: false})
  @io.toDocument
  @io.output
  public outputType: ThreeModuleIOType;

  public outputValue: string[] | string | number[] | number | boolean[] | boolean;

  @type.string
  @io.toDocument
  @io.output
  public outputSummary: string;

  @type.string
  @io.all
  public expression: string;

  private inputObjects: number[];
  private multiple = true;

  public async process(flow: ThreeRuleModel): Promise<void> {
    super.process(flow);
    
    let arrayLength = 0;

    const inputs: {[key: string]: any} = {};
    // detect all required inputs
    for (let mod of flow.modules) {
      if (this.expression.indexOf(mod.outputVarName) !== -1) {
        if (mod.outputVarName.indexOf(' ') !== -1) {
          throw new Error('Variable names used in Mathematical expression must not contain space');
        }
        const value = mod.outputValue;
        if (Array.isArray(value)) {
          const length = value.length;
          if (arrayLength === 0) {
            arrayLength = length;
          } else if (arrayLength === length) {
            // good
          } else {
            throw new Error('All array variables used in Mathematical expression must have the same length');
          }
        }
        inputs[mod.outputVarName] = mod.outputValue;
      }
    }

    this.multiple = arrayLength !== 0;

    const fct = math.compile(this.expression);

    if (!this.multiple) {
      const result = fct.evaluate(inputs);
      this.outputType = 'number';
      this.outputValue = result;
    } else {
      const results: number[] = [];
      for (let k = 0; k < arrayLength; k++) {
        const scope: {[key: string]: any} = {};
        for (const key in inputs) {
          const valueOrValues = inputs[key];
          if (Array.isArray(valueOrValues)) {
            scope[key] = valueOrValues[k];
          } else {
            scope[key] = valueOrValues;
          }
        }
        results.push(fct.evaluate(scope));
      }
      this.outputType = 'numbers';
      this.outputValue = results;
    }

  }

  

  public async summary(): Promise<void> {
    if (Array.isArray(this.outputValue)) {
      this.outputSummary = this.outputValue.slice(0, 3).join(', ');
    } else {
      this.outputSummary = this.outputValue.toString();
    }
    await this.update(['outputSummary']);
  }

}
