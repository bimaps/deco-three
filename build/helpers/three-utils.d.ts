import * as THREE from 'three';
export declare class ThreeUtils {
    static bboxFromObject(object: THREE.Object3D): THREE.Box3;
    static bboxFromObjects(objects: Array<THREE.Object3D>): THREE.Box3 | null;
    static isBbox000(bbox: THREE.Box3): boolean;
    static centroidFromBbox(bbox: THREE.Box3): THREE.Vector3;
    static centroidFromObject(object: THREE.Object3D): THREE.Vector3;
    static centroidFromObjects(objects: Array<THREE.Object3D>): THREE.Vector3 | null;
    static edgesFromObject(object: THREE.Mesh): THREE.Line3[];
    static PlaneHelper(plane: THREE.Plane, size?: number): THREE.Mesh;
    static geometryFromBuffer(bufferGeometry: THREE.BufferGeometry): THREE.Geometry;
    static sliceGeometry(geometry: THREE.Geometry, plane: THREE.Plane, DIRECTION?: string): THREE.Geometry;
    static sliceFace(plane: THREE.Plane, geom: THREE.Geometry, points: any, DIRECTION: any): void;
    static addFace(geom: THREE.Geometry, points: any): void;
    static facePoints(geom: THREE.Geometry, face: THREE.Face3, faceIndex: number): {
        vertex: THREE.Vector3;
        normal: THREE.Vector3;
        uv: THREE.Vector2 | undefined;
    }[];
    static intersectPlane(p1: any, p2: any, plane: any): {
        vertex: any;
        normal: any;
        uv: any;
    } | null;
    static facePosition(plane: any, points: any): string;
    static vertexPosition(plane: THREE.Plane, vertex: any): string;
    static objectToAxisPolygon(object: THREE.Mesh, positionOnAxis: any, planeNormalAxis?: string): any[];
    static objectToPolygon(object: THREE.Mesh, plane: THREE.Plane, scene?: null): any[];
    /**
     *
     * Input: an array of polygons where each element is a ring
     * Output: coordinates of MultiPolygon, compatible with GeoJSON
     */
    static intersectingLines(object: THREE.Mesh, plane: THREE.Plane): any[];
    static intersectingGeometry(object: THREE.Mesh, plane: THREE.Plane, scene: any): THREE.Geometry;
    static centroidOfPolygon(arr: any): number[];
    static isPointInsidePolygon(point: any, polygon: any): boolean;
}
//# sourceMappingURL=three-utils.d.ts.map