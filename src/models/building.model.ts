import { ThreeSiteModel } from './site.model';
import { AppModel, io, Metadata, model, Model, mongo, ObjectId, query, type, validate } from '@bim/deco-api';

let debug = require('debug')('app:models:three:building');

@model('three_building')
export class ThreeBuildingModel extends Model {
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
  @io.output
  @io.toDocument
  @query.filterable()
  @validate.required
  @mongo.index({ type: 'single' })
  public siteId: ObjectId;

  @type.string
  @io.all
  public ifcBuildingId: string;

  @type.string
  @io.output
  @io.toDocument
  @query.filterable({ type: 'text' })
  public importId: string;

  @type.string
  @io.all
  @query.filterable({ type: 'text' })
  public name: string;

  @type.array({ type: 'float' })
  @io.all
  public location?: Array<number>;

  @type.array({ type: 'float' })
  @io.all
  public refDirection?: Array<number>;

  @type.array({ type: 'float' })
  @io.all
  public axis?: Array<number>;

  @type.object({ allowOtherKeys: true })
  @io.all
  @query.filterable()
  public userData: { [key: string]: any };

  @type.metadata
  @io.all
  public metadata: Array<Metadata> = [];
}
