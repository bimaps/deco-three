import { ThreeSiteModel } from './site.model';
import { AppModel, io, model, Model, mongo, ObjectId, query, type, validate } from '@bim/deco-api';

let debug = require('debug')('app:models:three:style');

export interface ThreePos {
  x: number;
  y: number;
  z: number;
}

@model('three_style')
export class ThreeStyleModel extends Model {
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

  @type.string
  @io.all
  public description: string;

  @type.select({ options: ['visibility', 'colour', 'label', 'icon', 'geometry'] })
  @io.all
  public type: string;

  @type.boolean
  @io.all
  public display?: boolean;

  @type.string
  @io.all
  public color?: string;

  @type.select({ options: ['original', 'basic', 'phong', 'texture'] })
  @io.all
  public material?: 'original' | 'basic' | 'phong' | 'texture';

  @type.file({ accept: ['image/*'] })
  @io.all
  public image?: any;

  @type.float
  @io.all
  public opacity?: number;

  @type.integer
  @io.all
  public renderOrder?: number;

  @type.boolean
  @io.all
  public displayLabel?: boolean;

  @type.string
  @io.all
  public labelKey?: string;

  @type.string
  @io.all
  public labelTemplate?: string;

  @type.string
  @io.all
  public labelBackgroundColor?: string;

  @type.string
  @io.all
  public labelTextColor?: string;

  @type.float
  @io.all
  public labelScale?: number = 1;

  @type.select({ options: ['auto', 'bbox', 'polylabel'] })
  @io.all
  public labelCentroidMethod?: 'auto' | 'bbox' | 'polylabel' = 'auto';

  @type.object({
    keys: {
      x: { type: 'float' },
      y: { type: 'float' },
      z: { type: 'float' },
    },
    allowOtherKeys: true,
  })
  @io.all
  public labelPosition?: ThreePos;

  @type.float
  @io.all
  public labelOpacity?: number;

  @type.boolean
  @io.all
  public icon?: boolean;

  @type.string
  @io.all
  public iconKey?: string;

  @type.string
  @io.all
  public iconDefault?: string;

  @type.string
  @io.all
  public iconBackground?: string;

  @type.string
  @io.all
  public iconForeground?: string;

  @type.float
  @io.all
  public iconScale?: number;

  @type.select({ options: ['auto', 'bbox', 'polylabel'] })
  @io.all
  public iconCentroidMethod?: 'auto' | 'bbox' | 'polylabel' = 'auto';

  @type.object({
    keys: {
      x: { type: 'float' },
      y: { type: 'float' },
      z: { type: 'float' },
    },
    allowOtherKeys: true,
  })
  @io.all
  public iconPosition?: ThreePos;

  @type.float
  @io.all
  public iconOpacity?: number;

  @type.boolean
  @io.all
  public replaceGeometry?: boolean;

  @type.select({ options: ['cone', 'sphere', 'cube', 'cylinder'] })
  @io.all
  public geometryShape: 'cone' | 'sphere' | 'cube' | 'cylinder';

  @type.float
  @io.all
  public geometryScale?: number;

  @type.object({
    keys: {
      x: { type: 'float' },
      y: { type: 'float' },
      z: { type: 'float' },
    },
    allowOtherKeys: true,
  })
  @io.all
  public geometryPosition?: ThreePos;

  @type.object({
    keys: {
      x: { type: 'float' },
      y: { type: 'float' },
      z: { type: 'float' },
    },
  })
  @io.all
  public geometryRotation?: ThreePos;

  @type.boolean
  @io.all
  public edgesDisplay?: boolean;
}
