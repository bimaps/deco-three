import { ThreeSiteModel } from './site.model';
import { model, Model, type, io, query, validate, ObjectId, mongo, AppModel } from 'deco-api';
let debug = require('debug')('app:models:three:theme');

export interface ThreeThemeRule {
  [key: string]: any;
  styles: string[];
}

@model('three_theme')
export class ThreeThemeModel extends Model {

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
  @io.input
  @io.toDocument
  @query.filterable()
  @validate.required
  @mongo.index({type: 'single'})
  public siteId: ObjectId;

  @type.string
  @io.all
  @validate.required
  public name: string;

  @type.array()
  @io.all
  public rules: Array<ThreeThemeRule> = [];

  @type.float
  @io.all
  public spaceHeight: number = 0; // 0 => real height from data
  
}