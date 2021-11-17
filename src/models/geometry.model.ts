import { ThreeSiteModel } from './site.model';
import { model, Model, type, io, query, validate, ObjectId, AppModel, mongo } from 'deco-api';
import * as THREE from 'three';
let debug = require('debug')('app:models:three:geometry');

@model('three_geometry')
export class ThreeGeometryModel extends Model {

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
  @io.output
  @io.toDocument
  public importId: string;

  @type.string
  @io.all
  public formatVersion: string;

  @type.string
  @io.all
  @query.filterable({type: 'categories', ObjectId: false})
  public uuid: string;

  @type.string
  @io.all
  public type: string;

  @type.array({type: 'object', options: {
    keys: {
      x: {type: 'float', required: true},
      y: {type: 'float', required: true},
      z: {type: 'float', required: true}
    }
  }, allowOtherKeys: true})
  @io.all
  public vertices: Array<THREE.Vector3>;

  @type.array({type: 'any'})
  @io.all
  public colors: Array<any>;

  @type.array({type: 'any'})
  @io.all
  public faces: Array<THREE.Face3>;

  @type.any
  @io.all
  public faceVertexUvs: any;

  @type.any
  @io.all
  public morphTargets: any;

  @type.any
  @io.all
  public morphNormals: any;

  @type.any
  @io.all
  public skinWeights: any;

  @type.any
  @io.all
  public skinIndices: any;

  @type.any
  @io.all
  public lineDistances: any;
  
  @type.any
  @io.all
  public boundingBox: THREE.Box3;

  @type.any
  @io.all
  public boundingSphere: THREE.Sphere;

  @type.any
  @io.all
  public index: THREE.BufferAttribute;

  @type.any
  @io.all
	public attributes: {
		[name: string]: THREE.BufferAttribute | THREE.InterleavedBufferAttribute;
  };
  
  @type.any
  @io.all
  public morphAttributes: {
		[name: string]: ( THREE.BufferAttribute | THREE.InterleavedBufferAttribute )[];
  };
  
  @type.any
  @io.all
  public groups: { start: number; count: number; materialIndex?: number }[];
  
  @type.any
  @io.all
  public drawRange: { start: number; count: number };
  
  @type.object({allowOtherKeys: true})
  @io.all
  public userData: {[key: string]: any};
  
  @type.boolean
  @io.all
  public isBufferGeometry: boolean;
  
  @type.any
  @io.all
  public data: any;

  @type.any
  @io.all
  public scale: any;

  @type.any
  @io.all
  public visible: any;

  @type.any
  @io.all
  public castShadow: any;

  @type.any
  @io.all
  public receiveShadow: any;

  @type.any
  @io.all
  public doubleSided: any;

  @type.float
  @io.all
  public radius: number;

  @type.float
  @io.all
  public radiusTop: number;

  @type.float
  @io.all
  public radiusBottom: number;
  
  @type.float
  @io.all
  public width: number;

  @type.float
  @io.all
  public height: number;

  @type.float
  @io.all
  public depth: number;

  @type.any
  @io.all
  public segments: any;

  @type.float
  @io.all
  public radialSegments: number;

  @type.float
  @io.all
  public tubularSegments: number;
  
  @type.float
  @io.all
  public radiusSegments: number;
  
  @type.float
  @io.all
  public widthSegments: number;
  
  @type.float
  @io.all
  public heightSegments: number;

  @type.boolean
  @io.all
  public openEnded: boolean;

  @type.float
  @io.all
  public thetaStart: number;

  @type.float
  @io.all
  public thetaLength: number;

}