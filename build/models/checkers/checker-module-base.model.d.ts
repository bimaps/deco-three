import { CheckerModuleIOStyle } from './checker-interfaces';
import { CheckerModuleBase, CheckerModuleType, CheckerModuleIOType, CheckerModuleIOTypeValue, CheckerFlowModel } from './checker-internals';
import { CheckerModuleIORef } from './checker-internals';
import { ObjectId, Model, InstanceFromDocumentOptions } from 'deco-api';
import { Request, Response } from 'express';
export declare class CheckerModuleBaseModel extends Model implements CheckerModuleBase {
    _id: ObjectId;
    appId: ObjectId;
    siteId: ObjectId;
    moduleType: CheckerModuleType;
    name: string;
    allowedInputTypes?: Array<CheckerModuleIOType>;
    inputVarName?: string;
    outputVarName: string;
    outputType: CheckerModuleIOType;
    outputValue: CheckerModuleIOTypeValue;
    outputReference: CheckerModuleIORef | CheckerModuleIORef[];
    outputStyle: CheckerModuleIOStyle | CheckerModuleIOStyle[];
    outputSummary: string;
    protected currentInput: CheckerModuleIOTypeValue;
    protected currentInputType: CheckerModuleIOType;
    protected currentInputRef: CheckerModuleIORef | CheckerModuleIORef[];
    process(flow: CheckerFlowModel): Promise<void>;
    summary(): Promise<void>;
    static instanceFromDocument<T extends typeof Model>(this: T, document: any, options?: InstanceFromDocumentOptions): Promise<InstanceType<T>>;
    static instanceFromRequest<T extends typeof Model>(this: T, req: Request, res: Response): Promise<InstanceType<T>>;
}
//# sourceMappingURL=checker-module-base.model.d.ts.map