import { RuleModuleBaseModel } from '../rule-modules';

export * from './checker-interfaces';

/**
 * Modules repository
 * Could be removed thanks to the rule-module decorator, and module querying could be performed in a more modern way
 * */
export const modelsByType: {
  [key: string]: typeof RuleModuleBaseModel;
} = {};
