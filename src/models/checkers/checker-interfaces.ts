import * as THREE from 'three';
import { ObjectId } from '@bim/deco-api';

export const RuleModuleTypeOptions = ['filter', 'extract', 'math', 'reducer', 'if', 'projection', 'distance', 'normal-distance'] as const;
export type RuleModuleType = typeof RuleModuleTypeOptions[number];

export const RuleModuleIOTypeOptions = ['scene', 'three-objects', 'three-object', 'triangles', 'triangle', 'line3s', 'line3', 'vector3s', 'vector3', 'vector2s', 'vector2', 'box3s', 'box3', 'strings', 'string', 'numbers', 'number', 'booleans', 'boolean', 'json'] as const;
export type RuleModuleIOType = typeof RuleModuleIOTypeOptions[number];
export type RuleModuleIOTypeValue = THREE.Scene | THREE.Object3D[] | THREE.Object3D | THREE.Triangle | THREE.Triangle[] | THREE.Line3 | THREE.Line3[] | THREE.Vector3 | THREE.Vector3[] | THREE.Vector2 | THREE.Vector2[] | THREE.Box3 | THREE.Box3[] | string[] | string | number[] | number | boolean[] | boolean | CheckerJsonOutput[];

export type RuleModuleIOStyle = 'default' | 'correct' | 'incorrect' | 'danger' | 'info';
export const RuleModuleIOStyleOptions = ['default', 'correct', 'incorrect', 'danger', 'info'];
export interface CheckerJsonOutput {
    prefix: string;
    value: any;
    type: RuleModuleIOType;
    ref: RuleModuleIORef | RuleModuleIORef[] | {ifcId: string} | {ifcId: string}[];
    style?: RuleModuleIOStyle | RuleModuleIOStyle[];
    suffix: string;
    display: 'paragraph' | 'blocks';
}

export type ReportOutput = {
    name: string;
    description: string;
    flows: RuleOutput[]
};

export type RuleOutput = {
    name: string;
    description: string;
    summaries: string[],
    outputs: {name: string, outputs: CheckerJsonOutput[]}[]
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

export abstract class ThreeModule {
    public abstract process(): Promise<void>;
}


export type RuleModuleIORef = THREE.Object3D | THREE.Object3D[] | undefined;

export interface RuleModuleShape {
    moduleType: RuleModuleType;
    name: string;
    allowedInputTypes?: Array<RuleModuleIOType>;
    inputVarName?: string;
    outputVarName: string;
    outputType: RuleModuleIOType;
    outputValue: RuleModuleIOTypeValue;
    outputReference: RuleModuleIORef | RuleModuleIORef[];
    outputSummary?: string;
}

export interface RuleModuleFilter extends RuleModuleShape {
    // allowedInputType = ['three-objects'];
    conditions: Array<RuleModuleObjectCondition>;
    conditionsOperator: RuleModuleConditionOperator;
    // outputType = 'three-objects';
}

export interface RuleModuleExtract extends RuleModuleShape {
    // allowedInputType = ['three-objects', 'three-object'];
    extractType: ThreeExtractType;
    value: any;
    forceOutputAsNumber: boolean;
    // outputType = 'numbers' | 'strings' | 'booleans';
}

export interface RuleModuleMath extends RuleModuleShape {
    // allowedInputType = ['numbers', 'number'];
    expression: string;
    // outputType = 'numbers' | 'number';
}

export type RuleModuleReducerOperation = 'min' | 'max' | 'average' | 'count' | 'sum';
export const RuleModuleReducerOperationOptions = ['min', 'max', 'average', 'count', 'sum'];
export interface RuleModuleReducer extends RuleModuleShape {
    // allowedInputType = ['numbers', 'number'];
    operation: RuleModuleReducerOperation;
    // outputType = 'numbers' | 'number';
}

export type RuleModuleIfOperation = {
    conditions: Array<RuleModuleValueCondition>;
    conditionsOperator: RuleModuleConditionOperator;
    outputValue: number | string | boolean;
    outputStyle: RuleModuleIOStyle;
}
export type RuleModuleIfOperations = Array<RuleModuleIfOperation>;
export interface RuleModuleIf extends RuleModuleShape {
    // allowedInputType = ['numbers', 'number'];
    defaultOutputValue: number | string | boolean;
    defaultOutputStyle: RuleModuleIOStyle;
    operations: RuleModuleIfOperations;
    // outputType = 'numbers' | 'strings' | 'booleans';
}

export interface RuleModuleBbbox extends RuleModuleShape {

}

export interface RuleModuleProjection extends RuleModuleShape {
  projectionAxis: 'x' | 'y' | 'z';
}

export interface RuleModuleDistance extends RuleModuleShape {
    distanceType: '2d-2d' | '3d-3d';
}

export interface RuleModuleNormalDistance extends RuleModuleShape {
    operation: 'min' | 'max';
}

export interface CheckerOutput {
    prefix: string;
    varName: string;
    suffix: string;
    display: 'paragraph' | 'blocks';
}

export interface RuleModuleOutput extends RuleModuleShape {
    outputs: CheckerOutput[];
}

export interface ThreeFlow {
    name: string;
    description: string;
    modulesIds: Array<ObjectId>;
}