import { CheckerModuleType } from './checker-internals';
import { CheckerModuleBaseModel, CheckerFlowModel, CheckerModuleIOType } from './checker-internals';
import { CheckerModuleExtract, CheckerExtractType } from './checker-internals';
import { ObjectId } from 'deco-api';
export declare class CheckerModuleExtractModel extends CheckerModuleBaseModel implements CheckerModuleExtract {
    _id: ObjectId;
    appId: ObjectId;
    siteId: ObjectId;
    allowedInputTypes: Array<CheckerModuleIOType>;
    moduleType: CheckerModuleType;
    name: string;
    inputVarName?: string;
    outputVarName: string;
    outputType: CheckerModuleIOType;
    outputValue: CheckerModuleIOType;
    outputSummary: string;
    extractType: CheckerExtractType;
    value: any;
    forceOutputAsNumber: boolean;
    private inputObjects;
    private multiple;
    process(flow: CheckerFlowModel): Promise<void>;
    summary(): Promise<void>;
    private extractFaces;
    private extractWireframe;
    private extractEdges;
    private extractVertices;
}
//# sourceMappingURL=checker-module-extract.model.d.ts.map