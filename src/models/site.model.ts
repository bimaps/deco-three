import { model, Model, type, io, query, validate, ObjectId, Metadata, mongo, AppModel } from 'deco-api';
import * as THREE from 'three';
let debug = require('debug')('app:models:three:site');

@model('three_site')
export class ThreeSiteModel extends Model {

  @type.id
  public _id: ObjectId;

  @type.model({model: AppModel})
  @io.input
  @io.toDocument
  @query.filterable()
  @validate.required
  @mongo.index({type: 'single'})
  public appId: ObjectId;

  @type.string
  @io.all
  public ifcSiteId: string;

  @type.string
  @io.all
  @validate.required
  @query.filterable({type: 'auto'})
  public name: string;

  @type.metadata
  @io.all
  public metadata: Array<Metadata> = [];

  @type.any
  @io.all
  public center: THREE.Vector3;

  @type.any
  @io.all
  public originalCameraPosition: THREE.Vector3 = new THREE.Vector3(0, 0, 0);

  @type.float
  @io.all
  public originalCameraZoom: number = 10
  
  @type.any
  @io.all
  public originalCameraLookAt: THREE.Vector3 = new THREE.Vector3(0, 0, 0);

  @type.string
  @io.all
  @query.filterable()
  public bcfProjectId?: string;

  @type.array({type: 'float'})
  @io.all
  public location?: Array<number>;

  @type.array({type: 'float'})
  @io.all
  public refDirection?: Array<number>;

  @type.array({type: 'float'})
  @io.all
  public axis?: Array<number>;

}