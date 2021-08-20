import { CheckerModuleIOStyle } from './checker-interfaces';
import { CheckerModuleBase, CheckerModuleType, CheckerModuleIOType, CheckerModuleIOTypeValue, CheckerFlowModel } from './checker-internals';
import { CheckerModuleIORef, modelsByType } from './checker-internals';
import { model, ObjectId, Model, InstanceFromDocumentOptions } from '@bim/deco-api';
import { Request, Response } from 'express';

let debug = require('debug')('app:models:three:checker:module-base');

@model('checker_module')
export class CheckerModuleBaseModel extends Model implements CheckerModuleBase {

  public _id: ObjectId;
  public appId: ObjectId;
  public siteId: ObjectId;
  public moduleType: CheckerModuleType;
  public name: string;
  public allowedInputTypes?: Array<CheckerModuleIOType>;
  public inputVarName?: string;
  public outputVarName: string;
  public outputType: CheckerModuleIOType;
  public outputValue: CheckerModuleIOTypeValue;
  public outputReference: CheckerModuleIORef | CheckerModuleIORef[];
  public outputStyle: CheckerModuleIOStyle | CheckerModuleIOStyle[] = 'default';
  public outputSummary: string;

  protected currentInput: CheckerModuleIOTypeValue;
  protected currentInputType: CheckerModuleIOType;
  protected currentInputRef: CheckerModuleIORef | CheckerModuleIORef[];

  public async process(flow: CheckerFlowModel): Promise<void> {
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
