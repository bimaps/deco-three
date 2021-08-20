import { ThreeSpaceModel } from './space.model';
import { ThreeStoreyModel } from './storey.model';
import { ThreeBuildingModel } from './building.model';
import { ThreeSiteModel } from './site.model';
import { model, Model, type, io, query, validate, ObjectId, AppModel, mongo } from '@bim/deco-api';
import * as THREE from 'three';
let debug = require('debug')('app:models:three:object');

@mongo.collectionIndex({type: 'text', properties: ['uuid', 'material']})
@model('three_object')
export class ThreeObjectModel extends Model {

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
  @io.output
  @io.toDocument
  @query.filterable()
  @validate.required
  @mongo.index({type: 'single'})
  public siteId: ObjectId;

  @type.model({model: ThreeBuildingModel})
  @io.all
  @query.filterable()
  public buildingId: ObjectId;

  @type.models({model: ThreeStoreyModel})
  @io.all
  @query.filterable()
  public storeys: Array<ObjectId>;

  @type.model({model: ThreeSpaceModel})
  @io.all
  @query.filterable()
  public spaceId: ObjectId;

  @type.string
  @io.output
  @io.toDocument
  @query.filterable({type: 'text'})
  public importId: string;

  @type.string
  @io.all
  public formatVersion: string;

  @type.string
  @io.all
  @query.filterable({type: 'text'})
  public uuid: string;

  @type.string
  @io.all
  @query.filterable({type: 'text'})
  public name: string;

  @type.string
  @io.all
  @query.filterable({type: 'text'})
  public type: string;

  @type.object({allowOtherKeys: true})
  @io.all
  public matrix: THREE.Matrix4;

  @type.any()
  @io.all
  @query.filterable({type: 'text'})
  public material: string | Array<string>;

  @type.any()
  @io.all
  @query.filterable({type: 'text'})
  public geometry: string | Array<string>;

  @type.integer
  @io.all
  public layers: number;

  @type.integer
  @io.all
  public color: number;

  @type.integer
  @io.all
  public intensity: number;

  @type.object({allowOtherKeys: true})
  @io.all
  @query.filterable()
  public userData: {[key: string]: any;};

  @type.array()
  @io.all
  @query.filterable()
  public childrenIds: Array<ObjectId>;

  @type.id
  @io.all
  @query.filterable()
  public parentId: ObjectId;

  @type.boolean
  @io.all
  @query.filterable()
  public visible: boolean;

  @type.object({keys: {
    x: {type: 'float', required: true},
    y: {type: 'float', required: true},
    z: {type: 'float', required: true}
  }, allowOtherKeys: true})
  @io.input
  @io.toDocument
  @io.output
  @query.filterable()
  public _min: THREE.Vector3;

  @type.object({keys: {
    x: {type: 'float', required: true},
    y: {type: 'float', required: true},
    z: {type: 'float', required: true},
  }, allowOtherKeys: true})
  @io.input
  @io.toDocument
  @io.output
  @query.filterable()
  public _max: THREE.Vector3;
  
}