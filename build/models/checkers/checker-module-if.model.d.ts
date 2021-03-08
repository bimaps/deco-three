import { CheckerModuleIOStyle } from './checker-interfaces';
import { CheckerModuleType } from './checker-internals';
import { CheckerModuleBaseModel, CheckerFlowModel, CheckerModuleIOType } from './checker-internals';
import { CheckerModuleIf, CheckerModuleIfOperations, CheckerValueCondition } from './checker-internals';
import { ObjectId } from 'deco-api';
export declare class CheckerModuleIfModel extends CheckerModuleBaseModel implements CheckerModuleIf {
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
    defaultOutputValue: number | string | boolean;
    defaultOutputStyle: CheckerModuleIOStyle;
    operations: CheckerModuleIfOperations;
    private flow;
    process(flow: CheckerFlowModel): Promise<void>;
    processOperationsForInput(input: boolean | number | string, operations: CheckerModuleIfOperations): {
        value: boolean | number | string | undefined;
        style: CheckerModuleIOStyle;
    };
    isConditionTrue(input: boolean | number | string, condition: CheckerValueCondition): boolean;
    summary(): Promise<void>;
}
//# sourceMappingURL=checker-module-if.model.d.ts.map