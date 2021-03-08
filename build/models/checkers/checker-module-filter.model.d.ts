import { CheckerModuleType, CheckerModuleFilter } from './checker-internals';
import { CheckerModuleBaseModel, CheckerFlowModel, CheckerModuleIOType } from './checker-internals';
import { CheckerObjectCondition, CheckerConditionOperator } from './checker-internals';
import { ObjectId } from 'deco-api';
export declare class CheckerModuleFilterModel extends CheckerModuleBaseModel implements CheckerModuleFilter {
    _id: ObjectId;
    appId: ObjectId;
    siteId: ObjectId;
    allowedInputTypes: Array<CheckerModuleIOType>;
    moduleType: CheckerModuleType;
    name: string;
    inputVarName?: string;
    outputVarName: string;
    outputType: CheckerModuleIOType;
    outputValue: THREE.Object3D[];
    outputSummary: string;
    conditions: Array<CheckerObjectCondition>;
    conditionsOperator: CheckerConditionOperator;
    private inputObjects;
    process(flow: CheckerFlowModel): Promise<void>;
    summary(): Promise<void>;
}
//# sourceMappingURL=checker-module-filter.model.d.ts.map