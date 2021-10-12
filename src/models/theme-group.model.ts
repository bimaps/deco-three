import { io, Model, model, mongo, ObjectId, query, type, validate } from '@bim/deco-api';
import { ReferentialModel } from './referential.model';
import { ThreeThemeModel } from './theme.model';

/**
 * Theme groups hold themes together and allow certain themes to be accessible to specific population.
 */
@model('theme_group')
export class ThemeGroupModel extends Model {
  @type.string
  @io.all
  @validate.required
  @query.filterable({ type: 'auto' })
  @query.searchable
  nameGroup!: string;

  @type.string
  @io.all
  @validate.required
  @query.filterable({ type: 'auto' })
  @query.searchable
  themeGroupId!: string;

  /** The parentgroup id if any */
  @type.model({ model: ThemeGroupModel })
  @io.output
  @io.toDocument
  @query.filterable()
  @mongo.index({ type: 'single' })
  parentGroupId?: ObjectId;

  parentGroup?: ThemeGroupModel;

  /** The referential id */
  @type.model({ model: ReferentialModel })
  @io.output
  @io.toDocument
  @validate.required
  @query.filterable()
  @mongo.index({ type: 'single' })
  business!: ObjectId;

  /** The IDs of the themes belonging to this group */
  @type.array({ type: 'any' })
  @io.all
  threeThemeIds?: ObjectId[];

  threeThemes!: ThreeThemeModel[];
}
