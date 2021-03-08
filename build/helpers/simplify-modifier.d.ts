/**
 *	@author zz85 / http://twitter.com/blurspline / http://www.lab4games.net/zz85/blog
 *
 *	Simplification Geometry Modifier
 *    - based on code and technique
 *	  - by Stan Melax in 1998
 *	  - Progressive Mesh type Polygon Reduction Algorithm
 *    - http://www.melax.com/polychop/
 */
import { BufferGeometry, Geometry, Vector3 } from 'three';
export declare class SimplifyModifier {
    constructor();
    modify(geometry: BufferGeometry | Geometry, count: number): BufferGeometry;
}
export declare class Vertex {
    position: Vector3;
    id: number;
    faces: any[];
    neighbors: Vertex[];
    collapseCost: number;
    collapseNeighbor: any;
    minCost: number;
    totalCost: number;
    costCount: number;
    constructor(v: Vector3, id: number);
    addUniqueNeighbor(vertex: Vertex): void;
    removeIfNonNeighbor(n: Vertex): void;
}
export declare class Triangle {
    a: number;
    b: number;
    c: number;
    v1: Vertex;
    v2: Vertex;
    v3: Vertex;
    normal: Vector3;
    constructor(v1: Vertex, v2: Vertex, v3: Vertex, a: number, b: number, c: number);
    computeNormal(): void;
    hasVertex(v: Vertex): boolean;
    replaceVertex(oldv: Vertex, newv: Vertex): void;
}
//# sourceMappingURL=simplify-modifier.d.ts.map