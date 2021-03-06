import { ThreeSiteModel } from './site.model';
import { model, Model, type, io, query, validate, ObjectId, Metadata, AppModel, mongo } from 'deco-api';
import { CheckerFlowModel } from './checkers/checker-internals';
let debug = require('debug')('app:models:three:checker-config');

@model('checker_report')
export class ThreeCheckerReportModel extends Model {

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

  @type.string
  @io.all
  @query.filterable({type: 'text'})
  @validate.required
  public name: string;

  @type.string
  @io.all
  public description: string;

  // @type.models({model: ThreeCheckerConfigModel})
  // @io.all
  // public checkers: Array<ObjectId> = [];

  @type.models({model: CheckerFlowModel})
  @io.all
  @query.filterable({type: 'auto'})
  public flows: Array<ObjectId> = [];

  @type.metadata
  @io.all
  public metadata: Array<Metadata> = [];
  
}