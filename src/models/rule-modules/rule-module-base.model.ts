import { modelsByType, RuleModuleType } from '../checkers/checker-internals';
import { InstanceFromDocumentOptions, model, Model, ObjectId } from '@bim/deco-api';
import { Request, Response } from 'express';
import { RuleModel } from '../rule.model';

let debug = require('debug')('app:models:three:checker:module-base');

/** THe name of the MongoDbCollection for all types of rule modules */
export const RULE_MODULE_MONGO_COLLECTION_NAME = 'rule_module';

@model(RULE_MODULE_MONGO_COLLECTION_NAME)
export class RuleModuleBaseModel extends Model {
  /** The application id */
  public appId: ObjectId;
  /** The model discriminator (see mongoose inheritance) for inheritance handling */
  public moduleType: RuleModuleType;
  /** The name of the module instance */
  public name: string = '';
  /** The description of the module instance */
  public description: string = '';
  /** The selector determining on which element the module is being executed */
  public selector?: any; // TODO Math array selector
  /** The output namespace the results will be plugged to */
  public prefix: string;
  /** Status */
  public outputSummary: string;
  /**
   * Processes the current module instance in the context of the specified rule
   * @param flow The rule
   */
  public async process(flow: RuleModel): Promise<void> {
    // TODO
  }

  /** Is called when a status is requested */
  public async summary(): Promise<string> {
    return Promise.resolve('');
  }

  static async instanceFromDocument<T extends typeof Model>(
    this: T,
    document: any,
    options: InstanceFromDocumentOptions = { keepCopyOriginalValues: false },
  ): Promise<InstanceType<T>> {
    if (document.__checkerModuleInstanceDefined) {
      return (await super.instanceFromDocument(document, options)) as unknown as InstanceType<T>;
    }
    const model = modelsByType[document?.moduleType];
    if (!model) {
      throw new Error('Invalid module type');
    }
    document.__checkerModuleInstanceDefined = true;
    const instance = await model.instanceFromDocument(document, options);
    return instance as unknown as InstanceType<T>;
  }

  static async instanceFromRequest<T extends typeof Model>(this: T, req: Request, res: Response): Promise<InstanceType<T>> {
    if (res.locals.__checkerModuleInstanceDefined) {
      return (await super.instanceFromRequest(req, res)) as unknown as InstanceType<T>;
    }
    const model = modelsByType[req.body.moduleType];
    if (!model) {
      throw new Error('Invalid module type');
    }
    res.locals.__checkerModuleInstanceDefined = true;
    const instance = await model.instanceFromRequest(req, res);
    return instance as unknown as InstanceType<T>;
  }
}
