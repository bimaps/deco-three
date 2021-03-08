import { CheckerModuleType } from './checker-internals';
import { CheckerModuleBaseModel, CheckerFlowModel, CheckerModuleIOType } from './checker-internals';
import { CheckerModuleReducer, CheckerModuleReducerOperation } from './checker-internals';
import { ObjectId } from 'deco-api';
export declare class CheckerModuleReducerModel extends CheckerModuleBaseModel implements CheckerModuleReducer {
    _id: ObjectId;
    appId: ObjectId;
    siteId: ObjectId;
    allowedInputTypes: Array<CheckerModuleIOType>;
    moduleType: CheckerModuleType;
    name: string;
    inputVarName?: string;
    outputVarName: string;
    outputType: CheckerModuleIOType;
    outputValue: string[] | string | number[] | number | boolean[] | boolean;
    outputSummary: string;
    operation: CheckerModuleReducerOperation;
    process(flow: CheckerFlowModel): Promise<void>;
    summary(): Promise<void>;
}
//# sourceMappingURL=checker-module-reducer.model.d.ts.map