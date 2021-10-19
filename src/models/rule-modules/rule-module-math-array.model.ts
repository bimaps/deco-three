import { AppModel, io, model, mongo, ObjectId, query, type, validate } from '@bim/deco-api';
import { RULE_MODULE_MONGO_COLLECTION_NAME, RuleModuleBaseModel } from './rule-module-base.model';
import { RuleModuleType } from '../checkers';
import { RuleModel } from '../rule.model';
import { ruleModule } from './rule-module.decorator';
import { RuleModuleSelector } from './rule-module-selector';

class ColumnFormula {
  @io.all
  @type.string
  public column: string;

  @io.all
  @type.string
  public formula: string;
}

/** Handles Math.js operation on IFC data */
@ruleModule('math-array')
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
  @type.string
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
  @type.any
  @io.all
  public selector?: RuleModuleSelector;

  /** @inheritDoc */
  @type.string
  @io.all
  @validate.required
  public prefix: string;

  /** @inheritDoc */
  @type.string
  @io.all
  public outputSummary: string;

  @type.boolean
  @io.all
  public childModule: boolean;

  @type.model({ model: RuleModuleMathArrayModel })
  @io.all
  public parentModuleId: ObjectId;

  @type.object
  @io.all
  public _parentModule: RuleModuleMathArrayModel;

  @type.array
  @io.all
  public columnFormulas: ColumnFormula[];

  /** @inheritDoc */
  public async process(flow: RuleModel): Promise<void> {
    super.process(flow);

    // TODO
  }
}
