import { RuleModuleBaseModel, RuleModuleMathArrayModel } from '../rule-modules';

export * from './checker-interfaces';

export const modelsByType: {
  [key: string]: typeof RuleModuleBaseModel;
} = {
  'math-array': RuleModuleMathArrayModel,
};
