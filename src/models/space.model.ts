import { ThreeStoreyModel } from './storey.model';
import { ThreeBuildingModel } from './building.model';
import { ThreeSiteModel } from './site.model';
import { AppModel, io, Metadata, model, Model, mongo, ObjectId, query, type, validate } from '@bim/deco-api';
import GeoJSON from 'geojson';

let debug = require('debug')('app:models:three:space');

@model('three_space')
export class ThreeSpaceModel extends Model {
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

  @type.model({ model: ThreeBuildingModel })
  @io.all
  @query.filterable()
  @validate.required
  @mongo.index({ type: 'single' })
  public buildingId: ObjectId;

  @type.models({ model: ThreeStoreyModel })
  @io.all
  @query.filterable()
  @validate.required
  @mongo.index({ type: 'single' })
  public storeyIds: ObjectId[] = [];

  @type.string
  @io.all
  public ifcSpaceId: string;

  @type.string
  @io.output
  @io.toDocument
  @query.filterable({ type: 'text' })
  public importId: string;

  @type.string
  @io.all
  @query.filterable({ type: 'text' })
  public name: string;

  @type.object({ allowOtherKeys: true })
  @io.all
  @query.filterable()
  public userData: { [key: string]: any };

  @type.geojsonFeature
  @io.all
  public boundary: GeoJSON.Feature;

  @type.array({ type: 'float' })
  @io.all
  public location?: Array<number>;

  @type.array({ type: 'float' })
  @io.all
  public refDirection?: Array<number>;

  @type.array({ type: 'float' })
  @io.all
  public axis?: Array<number>;

  @type.metadata
  @io.all
  public metadata: Array<Metadata> = [];
}
