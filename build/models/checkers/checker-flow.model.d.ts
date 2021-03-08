import { CheckerJsonOutput, CheckerModuleIOStyle } from './checker-interfaces';
import { CheckerModuleBaseModel, CheckerValueCondition, CheckerFlow, CheckerModuleIORef } from './checker-internals';
import { CheckerModuleIOTypeValue, CheckerModuleIOType, CheckerObjectCondition } from './checker-internals';
import { Model, ObjectId } from 'deco-api';
import * as THREE from 'three';
export declare class CheckerFlowModel extends Model implements CheckerFlow {
    _id: ObjectId;
    appId: ObjectId;
    siteId: ObjectId;
    name: string;
    description: string;
    modulesIds: Array<ObjectId>;
    scene: THREE.Scene;
    modules: Array<CheckerModuleBaseModel>;
    outputs: {
        name: string;
        outputs: CheckerJsonOutput[];
    }[];
    process(scene?: THREE.Scene): Promise<THREE.Scene>;
    private prepareScene;
    fetchInput(varname: string): {
        value: CheckerModuleIOTypeValue;
        type: CheckerModuleIOType;
        ref: CheckerModuleIORef | CheckerModuleIORef[];
        style: CheckerModuleIOStyle | CheckerModuleIOStyle[];
    } | undefined;
    fetchProp(object: THREE.Object3D, propPath: string): any;
    compareObject(object: THREE.Object3D, condition: CheckerObjectCondition): boolean;
    compareValue(value: string | boolean | number | Date, condition: CheckerObjectCondition | CheckerValueCondition): boolean;
    private makeNumberIfPossible;
    getOutputs(convertObjectToIfcId?: boolean): {
        name: string;
        outputs: CheckerJsonOutput[];
    }[];
}
//# sourceMappingURL=checker-flow.model.d.ts.map