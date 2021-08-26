export * from './checker-interfaces';
export * from './rule-module-base.model';
export * from './rule-module-filter.model';
export * from './rule-module-extract.model';
export * from './rule-module-math.model';
export * from './rule-module-reducer.model';
export * from './rule-module-if.model';
export * from './rule-module-projection.model';
export * from './rule-module-distance.model';
export * from './rule-module-normal-distance.model';
export * from './checker-module-output.model';
export * from './rule.model';

// import { CheckerModuleBaseModel } from './checker-module-base.model';
import { RuleModuleFilterModel } from './rule-module-filter.model';
import { RuleModuleExtractModel } from './rule-module-extract.model';
import { RuleModuleMathModel } from './rule-module-math.model';
import { RuleModuleReducerModel } from './rule-module-reducer.model';
import { RuleModuleIfModel } from './rule-module-if.model';
import { RuleModuleProjectionModel } from './rule-module-projection.model';
import { RuleModuleDistanceModel } from './rule-module-distance.model';
import { RuleModuleNormalDistanceModel } from './rule-module-normal-distance.model';
import { CheckerModuleOutputModel } from './checker-module-output.model';

export const modelsByType: {
  [key: string]: 
    typeof RuleModuleFilterModel
    | typeof RuleModuleExtractModel
    | typeof RuleModuleMathModel
    | typeof RuleModuleReducerModel
    | typeof RuleModuleIfModel
    | typeof RuleModuleProjectionModel
    | typeof RuleModuleDistanceModel
    | typeof RuleModuleNormalDistanceModel
 //   | typeof CheckerModuleOutputModel
} = {
  filter: RuleModuleFilterModel,
  extract: RuleModuleExtractModel,
  math: RuleModuleMathModel,
  reducer: RuleModuleReducerModel,
  if: RuleModuleIfModel,
  projection: RuleModuleProjectionModel,
  distance: RuleModuleDistanceModel,
  "normal-distance": RuleModuleNormalDistanceModel,
 // output: CheckerModuleOutputModel,
};