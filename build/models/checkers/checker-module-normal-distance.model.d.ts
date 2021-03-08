import { CheckerModuleType } from './checker-internals';
import { CheckerModuleBaseModel, CheckerFlowModel, CheckerModuleIOType } from './checker-internals';
import { CheckerModuleNormalDistance } from './checker-internals';
import { ObjectId } from 'deco-api';
import * as THREE from 'three';
export declare class CheckerModuleNormalDistanceModel extends CheckerModuleBaseModel implements CheckerModuleNormalDistance {
    _id: ObjectId;
    appId: ObjectId;
    siteId: ObjectId;
    allowedInputTypes: Array<CheckerModuleIOType>;
    moduleType: CheckerModuleType;
    name: string;
    inputVarName?: string;
    input2VarName?: string;
    outputVarName: string;
    outputType: CheckerModuleIOType;
    outputValue: string[] | string | number[] | number | boolean[] | boolean;
    outputSummary: string;
    operation: 'min' | 'max';
    private sameInputs;
    process(flow: CheckerFlowModel): Promise<void>;
    pointPoint(i1: THREE.Vector3, i2: THREE.Vector3): number;
    pointLine(i1: THREE.Vector3, i2: THREE.Line3): number;
    pointFace(i1: THREE.Vector3, i2: THREE.Triangle): number;
    LineLine(i1: THREE.Line3, i2: THREE.Line3): number;
    LineFace(i1: THREE.Line3, i2: THREE.Triangle): number;
    FaceFace(i1: THREE.Triangle, i2: THREE.Triangle): number;
    summary(): Promise<void>;
}
//# sourceMappingURL=checker-module-normal-distance.model.d.ts.map