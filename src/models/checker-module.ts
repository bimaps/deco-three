// import { ThreeSiteModel } from './site.model';
// import { model, Model, type, io, query, validate, ObjectId, AppModel, mongo } from '@bim/deco-api';
// let debug = require('debug')('app:models:three:checker-module');

// @model('checker_module')
// export class ThreeCheckerConfigModel extends Model {

//   @type.id
//   public _id: ObjectId;

//   @type.model({model: AppModel})
//   @io.input
//   @io.toDocument
//   @query.filterable()
//   @validate.required
//   @mongo.index({type: 'single'})
//   public appId: ObjectId;

//   @type.model({model: ThreeSiteModel})
//   @io.all
//   @query.filterable()
//   @validate.required
//   @mongo.index({type: 'single'})
//   public siteId: ObjectId;

//   @type.string
//   @io.all
//   @query.filterable({type: 'text'})
//   @validate.required
//   public name: string;

//   @type.string
//   @io.all
//   public description: string;

  
  
// }

