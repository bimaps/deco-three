import { model, Model, type, io, query, validate } from '@bim/deco-api';

@model('application_role')
export class ApplicationRole extends Model {
  @type.string
  @io.all
  @validate.required
  @query.filterable({ type: 'auto' })
  @query.searchable
  key!: string;

  @type.string
  @io.all
  @validate.required
  @query.filterable({ type: 'auto' })
  @query.searchable
  value!: string;

  @type.string
  @io.all
  @validate.required
  application!: string;

  @type.string
  @io.all
  description?: string;
}
