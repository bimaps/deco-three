import { ThreeSiteModel } from './site.model';
import { model, Model, type, io, query, validate, ObjectId, mongo, AppModel } from '@bim/deco-api';
import { RuleModel } from './checkers';

let debug = require('debug')('app:models:three:theme');

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

  @type.model({ model: ThreeSiteModel })
  @io.input
  @io.toDocument
  @query.filterable()
  @validate.required
  @mongo.index({ type: 'single' })
  public siteId: ObjectId;

  @type.string
  @io.all
  @validate.required
  public name: string;

  @type.models({ model: RuleModel })
  @io.all
  @query.filterable({ type: 'auto' })
  public ruleIds: Array<ObjectId> = [];

  public rules: Array<RuleModel> = [];

  @type.float
  @io.all
  public spaceHeight: number = 0; // 0 => real height from data

}