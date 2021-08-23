import * as THREE from 'three';
import { ObjectId } from '@bim/deco-api';

export type ThreeModuleType = 'filter' | 'extract' | 'math' | 'reducer' | 'if' | 'projection' | 'distance' | 'normal-distance' | 'output';
export const ThreeModuleTypeOptions = ['filter', 'extract', 'math', 'reducer', 'if', 'projection', 'distance', 'normal-distance', 'output'];

export type ThreeModuleIOType = 'scene' | 'three-objects' | 'three-object' | 'triangles' | 'triangle' | 'line3s' | 'line3' | 'vector3s' | 'vector3' | 'vector2s' | 'vector2' | 'box3s' | 'box3' | 'strings' | 'string' | 'numbers' | 'number' | 'booleans' | 'boolean' | 'json';
export const ThreeModuleIOTypeOptions = ['scene', 'three-objects', 'three-object', 'triangles', 'triangle', 'line3s', 'line3', 'vector3s', 'vector3', 'vector2s', 'vector2', 'box3s', 'box3', 'strings', 'string', 'numbers', 'number', 'booleans', 'boolean', 'json'];
export type ThreeModuleIOTypeValue = THREE.Scene | THREE.Object3D[] | THREE.Object3D | THREE.Triangle | THREE.Triangle[] | THREE.Line3 | THREE.Line3[] | THREE.Vector3 | THREE.Vector3[] | THREE.Vector2 | THREE.Vector2[] | THREE.Box3 | THREE.Box3[] | string[] | string | number[] | number | boolean[] | boolean | CheckerJsonOutput[];

export type ThreeModuleIOStyle = 'default' | 'correct' | 'incorrect' | 'danger' | 'info';
export const ThreeModuleIOStyleOptions = ['default', 'correct', 'incorrect', 'danger', 'info'];
export interface CheckerJsonOutput {
    prefix: string;
    value: any;
    type: ThreeModuleIOType;
    ref: ThreeModuleIORef | ThreeModuleIORef[] | {ifcId: string} | {ifcId: string}[];
    style?: ThreeModuleIOStyle | ThreeModuleIOStyle[];
    suffix: string;
    display: 'paragraph' | 'blocks';
}

export type ReportOutput = {
    name: string;
    description: string;
    flows: ThreeRuleOutput[]
};

export type ThreeRuleOutput = {
    name: string;
    description: string;
    summaries: string[],
    outputs: {name: string, outputs: CheckerJsonOutput[]}[]
};

export type ThreeModuleConditionOperator = 'or' | 'and';

export type ThreeExtractType = 'faces' | 'edges' | 'vertices' | 'wireframe' | 'property';
export const ThreeModuleExtractTypeOptions = ['faces', 'edges', 'vertices', 'wireframe', 'property'];

export interface ThreeModuleObjectCondition {
    key: string;
    operation: string;
    value: string | Date;
}

export interface ThreeModuleValueCondition {
    operation: string;
    value: string | Date;
}

export abstract class ThreeModule {
    public abstract process(): Promise<void>;
}


export type ThreeModuleIORef = THREE.Object3D | THREE.Object3D[] | undefined;

export interface ThreeModuleShape {
    moduleType: ThreeModuleType;
    name: string;
    allowedInputTypes?: Array<ThreeModuleIOType>;
    inputVarName?: string;
    outputVarName: string;
    outputType: ThreeModuleIOType;
    outputValue: ThreeModuleIOTypeValue;
    outputReference: ThreeModuleIORef | ThreeModuleIORef[];
    outputSummary?: string;
}

export interface ThreeModuleFilter extends ThreeModuleShape {
    // allowedInputType = ['three-objects'];
    conditions: Array<ThreeModuleObjectCondition>;
    conditionsOperator: ThreeModuleConditionOperator;
    // outputType = 'three-objects';
}

export interface ThreeModuleExtract extends ThreeModuleShape {
    // allowedInputType = ['three-objects', 'three-object'];
    extractType: ThreeExtractType;
    value: any;
    forceOutputAsNumber: boolean;
    // outputType = 'numbers' | 'strings' | 'booleans';
}

export interface ThreeModuleMath extends ThreeModuleShape {
    // allowedInputType = ['numbers', 'number'];
    expression: string;
    // outputType = 'numbers' | 'number';
}

export type ThreeModuleReducerOperation = 'min' | 'max' | 'average' | 'count' | 'sum';
export const ThreeModuleReducerOperationOptions = ['min', 'max', 'average', 'count', 'sum'];
export interface ThreeModuleReducer extends ThreeModuleShape {
    // allowedInputType = ['numbers', 'number'];
    operation: ThreeModuleReducerOperation;
    // outputType = 'numbers' | 'number';
}

export type ThreeModuleIfOperation = {
    conditions: Array<ThreeModuleValueCondition>;
    conditionsOperator: ThreeModuleConditionOperator;
    outputValue: number | string | boolean;
    outputStyle: ThreeModuleIOStyle;
}
export type ThreeModuleIfOperations = Array<ThreeModuleIfOperation>;
export interface ThreeModuleIf extends ThreeModuleShape {
    // allowedInputType = ['numbers', 'number'];
    defaultOutputValue: number | string | boolean;
    defaultOutputStyle: ThreeModuleIOStyle;
    operations: ThreeModuleIfOperations;
    // outputType = 'numbers' | 'strings' | 'booleans';
}

export interface ThreeModuleBbbox extends ThreeModuleShape {

}

export interface ThreeModuleProjection extends ThreeModuleShape {
  projectionAxis: 'x' | 'y' | 'z';
}

export interface ThreeModuleDistance extends ThreeModuleShape {
    distanceType: '2d-2d' | '3d-3d';
}

export interface ThreeModuleNormalDistance extends ThreeModuleShape {
    operation: 'min' | 'max';
}

export interface CheckerOutput {
    prefix: string;
    varName: string;
    suffix: string;
    display: 'paragraph' | 'blocks';
}

export interface ThreeModuleOutput extends ThreeModuleShape {
    outputs: CheckerOutput[];
}

export interface ThreeFlow {
    name: string;
    description: string;
    modulesIds: Array<ObjectId>;
}