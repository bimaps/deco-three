import { RuleModuleMathArrayModel } from '../rule-modules/rule-module-math-array.model';
import { RuleModuleBaseModel } from '../rule-modules/rule-module-base.model';

export * from './checker-interfaces';

export const modelsByType: {
  [key: string]: typeof RuleModuleBaseModel;
} = {
  'math-array': RuleModuleMathArrayModel,
};
