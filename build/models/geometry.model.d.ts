import { Model, ObjectId } from 'deco-api';
import * as THREE from 'three';
export declare class ThreeGeometryModel extends Model {
    _id: ObjectId;
    appId: ObjectId;
    siteId: ObjectId;
    importId: string;
    formatVersion: string;
    uuid: string;
    type: string;
    vertices: Array<THREE.Vector3>;
    colors: Array<any>;
    faces: Array<THREE.Face3>;
    faceVertexUvs: any;
    morphTargets: any;
    morphNormals: any;
    skinWeights: any;
    skinIndices: any;
    lineDistances: any;
    boundingBox: THREE.Box3;
    boundingSphere: THREE.Sphere;
    index: THREE.BufferAttribute;
    attributes: {
        [name: string]: THREE.BufferAttribute | THREE.InterleavedBufferAttribute;
    };
    morphAttributes: {
        [name: string]: (THREE.BufferAttribute | THREE.InterleavedBufferAttribute)[];
    };
    groups: {
        start: number;
        count: number;
        materialIndex?: number;
    }[];
    drawRange: {
        start: number;
        count: number;
    };
    userData: {
        [key: string]: any;
    };
    isBufferGeometry: boolean;
    data: any;
    scale: any;
    visible: any;
    castShadow: any;
    receiveShadow: any;
    doubleSided: any;
    radius: number;
    radiusTop: number;
    radiusBottom: number;
    width: number;
    height: number;
    depth: number;
    segments: any;
    radialSegments: number;
    tubularSegments: number;
    radiusSegments: number;
    widthSegments: number;
    heightSegments: number;
    openEnded: boolean;
    thetaStart: number;
    thetaLength: number;
}
//# sourceMappingURL=geometry.model.d.ts.map