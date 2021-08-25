import { RuleModuleIOStyle } from './checker-interfaces';
import { RuleModuleShape, RuleModuleType, RuleModuleIOType, RuleModuleIOTypeValue, RuleModel } from './checker-internals';
import { RuleModuleIORef, modelsByType } from './checker-internals';
import { model, ObjectId, Model, InstanceFromDocumentOptions } from '@bim/deco-api';
import { Request, Response } from 'express';

let debug = require('debug')('app:models:three:checker:module-base');

/** THe name of the MongoDbCollection for all types of rule modules */
export const RULE_MODULE_MONGO_COLLECTION_NAME = 'rule_module';

@model(RULE_MODULE_MONGO_COLLECTION_NAME)
export class RuleModuleBaseModel extends Model implements RuleModuleShape {


  public _id: ObjectId;
  public appId: ObjectId;
  public moduleType: RuleModuleType;
  public name: string;
  public description: string;
  public allowedInputTypes?: Array<RuleModuleIOType>;
  public inputVarName?: string;
  public outputVarName: string;
  public outputType: RuleModuleIOType;
  public outputValue: RuleModuleIOTypeValue;
  public outputReference: RuleModuleIORef | RuleModuleIORef[];
  public outputStyle: RuleModuleIOStyle | RuleModuleIOStyle[] = 'default';
  public outputSummary: string;

  protected currentInput: RuleModuleIOTypeValue;
  protected currentInputType: RuleModuleIOType;
  protected currentInputRef: RuleModuleIORef | RuleModuleIORef[];

  public async process(flow: RuleModel): Promise<void> {
    if (!this.inputVarName) {
      throw new Error('Missing inputVarName');
    }
    const inputValueType = flow.fetchInput(this.inputVarName);
    if (!inputValueType) {
      throw new Error('Input requested not found');
    }
    if (!this.allowedInputTypes?.includes(inputValueType.type)) {
      throw new Error('Invalid input type');
    }
    this.currentInput = inputValueType.value;
    this.currentInputType = inputValueType.type;
    this.currentInputRef = inputValueType.ref;
  }

  public async summary(): Promise<void> {
    this.outputSummary = '';
  }

  static async instanceFromDocument<T extends typeof Model>(this: T, document: any, options: InstanceFromDocumentOptions = {keepCopyOriginalValues: false}): Promise<InstanceType <T>> {
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

  static async instanceFromRequest<T extends typeof Model>(this: T, req: Request, res: Response): Promise<InstanceType <T>> {
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
