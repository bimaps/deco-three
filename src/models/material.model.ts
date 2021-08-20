import { ThreeSiteModel } from './site.model';
import { model, Model, type, io, query, validate, ObjectId, mongo, AppModel } from '@bim/deco-api';
import * as THREE from 'three';
let debug = require('debug')('app:models:three:material');

@model('three_material')
export class ThreeMaterialModel extends Model {

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

  @type.string
  @io.toDocument
  @io.output
  public importId: string;

  @type.string
  @io.all
  public formatVersion: string;

  @type.string
  @io.all
  @query.filterable('text')
  public uuid: string;

  @type.string
  @io.all
  @query.filterable('text')
  public name: string;

  @type.string
  @io.all
  public type: string;

  @type.any
  @io.all
  public color: THREE.Color;

  @type.any
  @io.all
  public ambient: THREE.Color;

  @type.any
  @io.all
  public emissive: THREE.Color;

  @type.any
  @io.all
  public specular: THREE.Color;

  @type.float
  @io.all
  public shininess: number;

  @type.any
  @io.all
  public roughness: any;

  @type.any
  @io.all
  public metalness: any;

  @type.float
  @io.all
  public opacity: number;

  @type.boolean
  @io.all
  public transparent: boolean = false;

  @type.any
  @io.all
  public side: any;

  @type.any
  @io.all
  public children: any;

  @type.any
  @io.all
  public depthFunc: THREE.DepthModes;

  @type.boolean
  @io.all
  public depthTest: boolean;

  @type.boolean
  @io.all
  public depthWrite: boolean;

  @type.boolean
  @io.all
  public stencilWrite: boolean;

  @type.integer
  @io.all
  public stencilFunc: number;


  @type.integer
  @io.all
  public stencilRef: number;


  @type.integer
  @io.all
  public stencilMask: number;


  @type.integer
  @io.all
  public stencilFail: number;


  @type.integer
  @io.all
  public stencilZFail: number;


  @type.integer
  @io.all
  public stencilZPass: number;

  @type.object({allowOtherKeys: true})
  @io.all
  public userData: {[key: string]: any;};

  static uniqueHashFromData(data: any, ignoreNameInMaterialId: boolean = false) {
    let values: Array<string> = [];
    for (let key in ThreeMaterialModel.deco.propertyTypes) {
      if (key === 'name' && ignoreNameInMaterialId) {
        continue;
      }
      values.push(data[key]);
    }
    return values.join('-');
  }

}