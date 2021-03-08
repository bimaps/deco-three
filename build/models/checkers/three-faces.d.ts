import { Vector3 } from "three";
export declare class Face {
    normal: Vector3;
    midpoint: Vector3;
    area: number;
    constant: number;
    outside: null;
    mark: number;
    edge: HalfEdge | null;
    static create(a: VertexNode, b: VertexNode, c: VertexNode): any;
    getEdge(i: number): HalfEdge | null;
    compute(): any;
    distanceToPoint(point: any): number;
}
export declare class HalfEdge {
    vertex: any;
    prev: HalfEdge | null;
    next: HalfEdge | null;
    twin: HalfEdge | null;
    face: Face;
    constructor(vertex: any, face: Face);
    head(): any;
    tail(): any;
    length(): any;
    lengthSquared(): any;
}
export declare class VertexNode {
    point: Vector3;
    prev: null;
    next: null;
    face: Face | null;
    constructor(point: Vector3);
}
//# sourceMappingURL=three-faces.d.ts.map