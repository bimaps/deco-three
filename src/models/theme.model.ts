import { AppModel, io, model, Model, mongo, ObjectId, query, type, validate } from '@bim/deco-api';
import { ThreeStyleModel } from './style.model';
import { RuleModel } from './rule.model';

let debug = require('debug')('app:models:three:theme');

export class RuleAssociation {
  public ruleId: ObjectId;
  public _rule: RuleModel;
  public styleAssociations: Array<{
    property: string;
    value: string;
    style: ThreeStyleModel;
  }>;
}

@model('three_theme')
export class ThreeThemeModel extends Model {
  @type.id
  public _id: ObjectId;

  @type.model({ model: AppModel })
  @io.input
  @io.toDocument
  @query.filterable()
  @validate.required
  @mongo.index({ type: 'single' })
  public appId: ObjectId;

  @type.string
  @io.all
  @validate.required
  public name: string;

  @type.array
  @io.all
  public ruleAssociations: RuleAssociation[];

  @type.float
  @io.all
  public spaceHeight: number = 0; // 0 => real height from data
}
