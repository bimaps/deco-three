import { model, Model, type, io, query, validate, mongo } from '@bim/deco-api';

/** Referential data can be any data easily editable and used by business users */
@model('referential')
export class ReferentialModel extends Model {
  @type.string
  @io.all
  @query.filterable({ type: 'auto' })
  @validate.required
  @mongo.index({ type: 'single' })
  public referentialType!: string;

  @type.string
  @io.all
  @validate.required
  value!: string;

  /**
   * The business (office) concerned by this referential data
   */
  @type.string
  @io.all
  business?: string;

  @type.boolean
  @io.all
  @validate.required
  active!: boolean;

  @type.string
  @io.all
  description?: string;
}
