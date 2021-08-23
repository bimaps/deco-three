export * from './checker-interfaces';
export * from './three-module-base.model';
export * from './three-module-filter.model';
export * from './three-module-extract.model';
export * from './three-module-math.model';
export * from './three-module-reducer.model';
export * from './three-module-if.model';
export * from './three-module-projection.model';
export * from './three-module-distance.model';
export * from './three-module-normal-distance.model';
export * from './checker-module-output.model';
export * from './three-rule.model';

// import { CheckerModuleBaseModel } from './checker-module-base.model';
import { ThreeModuleFilterModel } from './three-module-filter.model';
import { ThreeModuleExtractModel } from './three-module-extract.model';
import { ThreeModuleMathModel } from './three-module-math.model';
import { ThreeModuleReducerModel } from './three-module-reducer.model';
import { ThreeModuleIfModel } from './three-module-if.model';
import { ThreeModuleProjectionModel } from './three-module-projection.model';
import { ThreeModuleDistanceModel } from './three-module-distance.model';
import { ThreeModuleNormalDistanceModel } from './three-module-normal-distance.model';
import { CheckerModuleOutputModel } from './checker-module-output.model';

export const modelsByType: {
  [key: string]: 
    typeof ThreeModuleFilterModel
    | typeof ThreeModuleExtractModel
    | typeof ThreeModuleMathModel
    | typeof ThreeModuleReducerModel
    | typeof ThreeModuleIfModel
    | typeof ThreeModuleProjectionModel
    | typeof ThreeModuleDistanceModel
    | typeof ThreeModuleNormalDistanceModel
 //   | typeof CheckerModuleOutputModel
} = {
  filter: ThreeModuleFilterModel,
  extract: ThreeModuleExtractModel,
  math: ThreeModuleMathModel,
  reducer: ThreeModuleReducerModel,
  if: ThreeModuleIfModel,
  projection: ThreeModuleProjectionModel,
  distance: ThreeModuleDistanceModel,
  "normal-distance": ThreeModuleNormalDistanceModel,
 // output: CheckerModuleOutputModel,
};