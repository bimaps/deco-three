import { RuleModuleBaseModel } from './rule-module-base.model';
import { modelsByType } from '../checkers';

export const RULE_MODULE_KEY = Symbol('rule module key');

/**
 * Decorates a rule module model class
 * @param key The key of the module
 */
export const ruleModule = (key: string) => (target: typeof RuleModuleBaseModel) => {
  // Saving the module name onto the type
  Reflect.set(target, RULE_MODULE_KEY, key);

  // Registering the module
  modelsByType[key] = target;
};
