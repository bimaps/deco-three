import { ThreeSiteModel } from './site.model';
import { AppModel, io, Metadata, model, Model, mongo, ObjectId, query, type, validate } from '@bim/deco-api';

let debug = require('debug')('app:models:three:checker-config');

@model('checker_config')
export class ThreeCheckerConfigModel extends Model {
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
  @io.all
  @query.filterable()
  @validate.required
  @mongo.index({ type: 'single' })
  public siteId: ObjectId;

  @type.string
  @io.all
  @query.filterable({ type: 'text' })
  @validate.required
  public name: string;

  @type.string
  @io.all
  public description: string;

  @type.array({
    type: 'object',
    options: {
      keys: {
        key: { type: 'string' },
        operator: { type: 'select', options: ['=', '<', '>', '!=', '*'] },
        value: { type: 'any' },
      },
    },
  })
  @io.all
  public conditions: Array<Condition> = [];

  @type.select({ options: ['count', 'compare-key-value', 'add-key-value'] })
  @io.all
  public operation: CheckerOperation;

  @type.any
  @io.all
  public operationSettings: any = {};

  @type.metadata
  @io.all
  public metadata: Array<Metadata> = [];
}

export interface Condition {
  key: string;
  operator: '=' | '<' | '>' | '!=' | '*';
  value: string | number | Date;
}

export type CheckerOperation = 'count' | 'compare-key-value' | 'add-key-value';
