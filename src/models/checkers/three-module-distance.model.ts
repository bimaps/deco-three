import { CheckerModuleType } from './checker-internals';
import { ThreeModuleBaseModel, ThreeRuleModel, CheckerModuleIOType, CheckerModuleIOTypeOptions } from './checker-internals';
import { CheckerModuleTypeOptions, CheckerModuleDistance } from './checker-internals';
import { ThreeSiteModel } from '../site.model';
import { model, type, io, query, validate, ObjectId, mongo, AppModel } from '@bim/deco-api';

let debug = require('debug')('app:models:three:checker:module-distance');

@model('three_module')
export class ThreeModuleDistanceModel extends ThreeModuleBaseModel implements CheckerModuleDistance {

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
  public allowedInputTypes: Array<CheckerModuleIOType> = ['vector3s', 'vector3', 'vector2s', 'vector2'];
  
  @type.select({options: CheckerModuleTypeOptions})
  @io.toDocument
  @io.output
  @validate.required
  public moduleType: CheckerModuleType = 'distance';

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
  public input2VarName?: string;

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

  @type.select({options: ['2d-2d', '3d-3d']})
  @io.all
  public distanceType: '2d-2d' | '3d-3d';

  public async process(flow: ThreeRuleModel): Promise<void> {
    super.process(flow);
    /* Implement here the process */


    // distanceTo()
    
  }

  public async summary(): Promise<void> {
    super.summary();
    /* Implement here the summary method that saves inside outputSummary */
  }

}
