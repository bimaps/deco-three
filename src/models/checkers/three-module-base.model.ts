import { ThreeModuleIOStyle } from './checker-interfaces';
import { ThreeModuleShape, ThreeModuleType, ThreeModuleIOType, ThreeModuleIOTypeValue, ThreeRuleModel } from './checker-internals';
import { ThreeModuleIORef, modelsByType } from './checker-internals';
import { model, ObjectId, Model, InstanceFromDocumentOptions } from '@bim/deco-api';
import { Request, Response } from 'express';

let debug = require('debug')('app:models:three:checker:module-base');

@model('three_module')
export class ThreeModuleBaseModel extends Model implements ThreeModuleShape {

  public _id: ObjectId;
  public appId: ObjectId;
  public moduleType: ThreeModuleType;
  public name: string;
  public allowedInputTypes?: Array<ThreeModuleIOType>;
  public inputVarName?: string;
  public outputVarName: string;
  public outputType: ThreeModuleIOType;
  public outputValue: ThreeModuleIOTypeValue;
  public outputReference: ThreeModuleIORef | ThreeModuleIORef[];
  public outputStyle: ThreeModuleIOStyle | ThreeModuleIOStyle[] = 'default';
  public outputSummary: string;

  protected currentInput: ThreeModuleIOTypeValue;
  protected currentInputType: ThreeModuleIOType;
  protected currentInputRef: ThreeModuleIORef | ThreeModuleIORef[];

  public async process(flow: ThreeRuleModel): Promise<void> {
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
