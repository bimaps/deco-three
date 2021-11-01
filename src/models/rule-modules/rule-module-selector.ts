/** a ruleModule selector filter expression */
export interface RuleModuleSelectorExpression {
  /** The key operand */
  key: string;

  /** The value operand */
  value: string;

  /** The key/value comparison operation
   * * '>' superior
   * * '<' inferior
   * * '=' equals
   * * '<>' different
   * * 'contains' string contains
   * */
  operator: '<' | '>' | '=' | '<>' | 'contains';
}

/** Describes the RuleModule selector data */
export interface RuleModuleSelector {
  /** The way the selector expressions are aggregated */
  aggregation: 'and' | 'or';

  /** The list of selector expressions */
  expressions: RuleModuleSelectorExpression[];
}
