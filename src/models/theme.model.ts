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
    style: ThreeStyleModel;
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
  public themeGroupId?: ObjectId;

  /**
   * Application roles which give access to this theme
   */
  public applicationRoleIds?: ObjectId[];

  /**
   * Read-only properties, to be used by front-end applications
   */
  public _themeGroup?: ThemeGroupModel;
  public _preApproverGroup?: ThemeGroupModel;
  public _topicGroup?: ThemeGroupModel;
  public _applicationRoles?: ApplicationRole[];
}
