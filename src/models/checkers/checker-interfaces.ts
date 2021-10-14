import * as THREE from 'three';
import { ObjectId } from '@bim/deco-api';

export const RuleModuleTypeOptions = ['math-array'] as const;
export type RuleModuleType = typeof RuleModuleTypeOptions[number];

export const RuleModuleIOTypeOptions = [
  'scene',
  'three-objects',
  'three-object',
  'triangles',
  'triangle',
  'line3s',
  'line3',
  'vector3s',
  'vector3',
  'vector2s',
  'vector2',
  'box3s',
  'box3',
  'strings',
  'string',
  'numbers',
  'number',
  'booleans',
  'boolean',
  'json',
] as const;
export type RuleModuleIOType = typeof RuleModuleIOTypeOptions[number];
export type RuleModuleIOTypeValue =
  | THREE.Scene
  | THREE.Object3D[]
  | THREE.Object3D
  | THREE.Triangle
  | THREE.Triangle[]
  | THREE.Line3
  | THREE.Line3[]
  | THREE.Vector3
  | THREE.Vector3[]
  | THREE.Vector2
  | THREE.Vector2[]
  | THREE.Box3
  | THREE.Box3[]
  | string[]
  | string
  | number[]
  | number
  | boolean[]
  | boolean
  | CheckerJsonOutput[];

export type RuleModuleIOStyle = 'default' | 'correct' | 'incorrect' | 'danger' | 'info';
export const RuleModuleIOStyleOptions = ['default', 'correct', 'incorrect', 'danger', 'info'];
export interface CheckerJsonOutput {
  prefix: string;
  value: any;
  type: RuleModuleIOType;
  ref: RuleModuleIORef | RuleModuleIORef[] | { ifcId: string } | { ifcId: string }[];
  style?: RuleModuleIOStyle | RuleModuleIOStyle[];
  suffix: string;
  display: 'paragraph' | 'blocks';
}

export type ReportOutput = {
  name: string;
  description: string;
  flows: RuleOutput[];
};

export type RuleOutput = {
  name: string;
  description: string;
  summaries: string[];
  outputs: { name: string; outputs: CheckerJsonOutput[] }[];
};

export type RuleModuleConditionOperator = 'or' | 'and';

export type ThreeExtractType = 'faces' | 'edges' | 'vertices' | 'wireframe' | 'property';
export const RuleModuleExtractTypeOptions = ['faces', 'edges', 'vertices', 'wireframe', 'property'];

export interface RuleModuleObjectCondition {
  key: string;
  operation: string;
  value: string | Date;
}

export interface RuleModuleValueCondition {
  operation: string;
  value: string | Date;
}

export type RuleModuleIORef = THREE.Object3D | THREE.Object3D[] | undefined;

export type RuleModuleReducerOperation = 'min' | 'max' | 'average' | 'count' | 'sum';
export const RuleModuleReducerOperationOptions = ['min', 'max', 'average', 'count', 'sum'];

export interface CheckerOutput {
  prefix: string;
  varName: string;
  suffix: string;
  display: 'paragraph' | 'blocks';
}

export interface ThreeFlow {
  name: string;
  description: string;
  modulesIds: Array<ObjectId>;
}
