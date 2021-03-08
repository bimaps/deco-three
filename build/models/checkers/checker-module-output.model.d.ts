import { CheckerModuleIOTypeValue } from './checker-interfaces';
import { CheckerModuleType } from './checker-internals';
import { CheckerModuleBaseModel, CheckerFlowModel, CheckerModuleIOType } from './checker-internals';
import { CheckerModuleOutput, CheckerOutput } from './checker-internals';
import { ObjectId } from 'deco-api';
export declare class CheckerModuleOutputModel extends CheckerModuleBaseModel implements CheckerModuleOutput {
    _id: ObjectId;
    appId: ObjectId;
    siteId: ObjectId;
    allowedInputTypes: Array<CheckerModuleIOType>;
    moduleType: CheckerModuleType;
    name: string;
    inputVarName?: string;
    outputVarName: string;
    outputType: CheckerModuleIOType;
    outputValue: CheckerModuleIOTypeValue;
    outputSummary: string;
    outputs: CheckerOutput[];
    process(flow: CheckerFlowModel): Promise<void>;
    summary(): Promise<void>;
}
//# sourceMappingURL=checker-module-output.model.d.ts.map