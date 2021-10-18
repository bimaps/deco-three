import { AppModel, io, model, Model, mongo, ObjectId, query, type, validate } from '@bim/deco-api';
import { ThreeStyleModel } from './style.model';
import { RuleModel } from './rule.model';
import { ThemeGroupModel } from './theme-group.model';
import { ApplicationRole } from './authorization/application-role';

let debug = require('debug')('app:models:three:theme');

/**
 * Rule associations hold the link between a theme and its associated rules and styles.
 */
export class RuleAssociation {
  public ruleId: ObjectId;
  public _rule: RuleModel;
  public styleAssociations: Array<{
    property: string;
    value: string;
    styleId: ObjectId;
    _style: ThreeStyleModel;
  }>;
}

@model('three_theme')
export class ThreeThemeModel extends Model {
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

  @type.array
  @io.all
  public ruleAssociations: RuleAssociation[];

  @type.float
  @io.all
  public spaceHeight: number = 0; // 0 => real height from data

  /**
   * The business (office) concerned by this theme
   */
  @type.string
  @io.all
  public business?: string;

  /**
   * A human-readable identifier for easy reading by the business users
   */
  @type.string
  @io.all
  public businessId?: string;

  // TODO For now, it is the theme which holds the relationship themeGroup-themes. Store this relationship in themeGroup
  @type.any
  @io.all
  public themeGroupId?: ObjectId;

  /**
   * Application roles which give access to this theme
   */
  @type.any
  @io.all
  public applicationRoleIds?: ObjectId[];

  /** Read-only properties, to be used by front-end applications */
  @type.any
  @io.output
  public _themeGroup?: ThemeGroupModel;
  @type.any
  @io.output
  public _preApproverGroup?: ThemeGroupModel;
  @type.any
  @io.output
  public _topicGroup?: ThemeGroupModel;
  @type.any
  @io.output
  public _applicationRoles?: ApplicationRole[];
}
