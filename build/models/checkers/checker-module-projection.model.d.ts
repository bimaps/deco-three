import { CheckerModuleType } from './checker-internals';
import { CheckerModuleBaseModel, CheckerFlowModel, CheckerModuleIOType } from './checker-internals';
import { CheckerModuleProjection } from './checker-internals';
import { ObjectId } from 'deco-api';
export declare class CheckerModuleProjectionModel extends CheckerModuleBaseModel implements CheckerModuleProjection {
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
    projectionAxis: 'x' | 'y' | 'z';
    process(flow: CheckerFlowModel): Promise<void>;
    summary(): Promise<void>;
}
//# sourceMappingURL=checker-module-projection.model.d.ts.map