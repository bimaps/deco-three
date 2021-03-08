import { CheckerModuleType } from './checker-internals';
import { CheckerModuleBaseModel, CheckerFlowModel, CheckerModuleIOType } from './checker-internals';
import { CheckerModuleMath } from './checker-internals';
import { ObjectId } from 'deco-api';
export declare class CheckerModuleMathModel extends CheckerModuleBaseModel implements CheckerModuleMath {
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
    expression: string;
    private inputObjects;
    private multiple;
    process(flow: CheckerFlowModel): Promise<void>;
    summary(): Promise<void>;
}
//# sourceMappingURL=checker-module-math.model.d.ts.map