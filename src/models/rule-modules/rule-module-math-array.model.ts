import { AppModel, io, model, mongo, ObjectId, query, type, validate } from '@bim/deco-api';
import { RULE_MODULE_MONGO_COLLECTION_NAME, RuleModuleBaseModel } from './rule-module-base.model';

import { RuleModel, RuleModuleType, RuleModuleTypeOptions } from '../checkers';

/** Handles Math.js operation on IFC data */
@model(RULE_MODULE_MONGO_COLLECTION_NAME)
export class RuleModuleMathArrayModel extends RuleModuleBaseModel {
  /** @inheritDoc */
  @type.id
  public _id: ObjectId;

  /** @inheritDoc */
  @type.model({ model: AppModel })
  @io.all
  @query.filterable()
  @validate.required
  @mongo.index({ type: 'single' })
  public appId: ObjectId;

  /** @inheritDoc */
  @type.select({ options: RuleModuleTypeOptions })
  @io.all
  @validate.required
  public moduleType: RuleModuleType = 'math-array';

  /** @inheritDoc */
  @type.string
  @io.all
  @validate.required
  public name: string = '';

  /** @inheritDoc */
  @type.string
  @io.all
  public description: string = '';

  /** @inheritDoc */
  @type.any // TODO Math array selector
  @io.all
  @validate.required
  public selector?: string;

  /** @inheritDoc */
  @type.string
  @io.all
  @validate.required
  public prefix: string;

  /** @inheritDoc */
  @type.string
  @io.all
  public outputSummary: string;

  /** @inheritDoc */
  public async process(flow: RuleModel): Promise<void> {
    super.process(flow);

    // TODO
  }
}
