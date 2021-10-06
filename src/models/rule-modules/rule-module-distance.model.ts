import {
  RULE_MODULE_MONGO_COLLECTION_NAME,
  RuleModel,
  RuleModuleBaseModel,
  RuleModuleDistance,
  RuleModuleIOType,
  RuleModuleIOTypeOptions,
  RuleModuleType,
  RuleModuleTypeOptions,
} from '../checkers/checker-internals';
import { AppModel, io, model, mongo, ObjectId, query, type, validate } from '@bim/deco-api';

let debug = require('debug')('app:models:three:checker:module-distance');

@model(RULE_MODULE_MONGO_COLLECTION_NAME)
export class RuleModuleDistanceModel extends RuleModuleBaseModel implements RuleModuleDistance {
  @type.id
  public _id: ObjectId;

  @type.model({ model: AppModel })
  @io.all
  @query.filterable()
  @validate.required
  @mongo.index({ type: 'single' })
  public appId: ObjectId;

  @type.select({ options: RuleModuleIOTypeOptions, multiple: true })
  @io.toDocument
  @io.output
  public allowedInputTypes: Array<RuleModuleIOType> = ['vector3s', 'vector3', 'vector2s', 'vector2'];

  @type.select({ options: RuleModuleTypeOptions })
  @io.all
  @validate.required
  public moduleType: RuleModuleType = 'distance';

  @type.string
  @io.all
  @validate.required
  public name: string = '';

  @type.string
  @io.all
  public description: string = '';

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

  @type.select({ options: RuleModuleIOTypeOptions, multiple: false })
  @io.all
  public outputType: RuleModuleIOType;

  public outputValue: string[] | string | number[] | number | boolean[] | boolean;

  @type.string
  @io.all
  public outputSummary: string;

  @type.select({ options: ['2d-2d', '3d-3d'] })
  @io.all
  public distanceType: '2d-2d' | '3d-3d';

  public async process(flow: RuleModel): Promise<void> {
    super.process(flow);
    /* Implement here the process */

    // distanceTo()
  }

  public async summary(): Promise<void> {
    super.summary();
    /* Implement here the summary method that saves inside outputSummary */
  }
}
