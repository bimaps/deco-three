import { ThreeModuleType } from './checker-internals';
import { ThreeModuleBaseModel, ThreeRuleModel, ThreeModuleIOType, ThreeModuleIOTypeOptions } from './checker-internals';
import { ThreeModuleTypeOptions } from './checker-internals';
import { ThreeSiteModel } from '../site.model';
import { model, type, io, query, validate, ObjectId, mongo, AppModel } from '@bim/deco-api';

let debug = require('debug')('app:models:three:checker:module-extract');

@model('three_module')
export class ThreeModuleBlueprintModel extends ThreeModuleBaseModel /*implements CheckerModuleReducer (add here the interface implementation of the module) */ {

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
  public moduleType: ThreeModuleType = 'math'; /* write here the correct module Type */

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

  /* Add here properties for this module */

  public async process(flow: ThreeRuleModel): Promise<void> {
    super.process(flow);
    /* Implement here the process */
    
  }

  public async summary(): Promise<void> {
    super.summary();
    /* Implement here the summary method that saves inside outputSummary */
  }

}
