import { Model, ObjectId } from 'deco-api';
import * as THREE from 'three';
export declare class ThreeMaterialModel extends Model {
    _id: ObjectId;
    appId: ObjectId;
    siteId: ObjectId;
    importId: string;
    formatVersion: string;
    uuid: string;
    name: string;
    type: string;
    color: THREE.Color;
    ambient: THREE.Color;
    emissive: THREE.Color;
    specular: THREE.Color;
    shininess: number;
    roughness: any;
    metalness: any;
    opacity: number;
    transparent: boolean;
    side: any;
    children: any;
    depthFunc: THREE.DepthModes;
    depthTest: boolean;
    depthWrite: boolean;
    stencilWrite: boolean;
    stencilFunc: number;
    stencilRef: number;
    stencilMask: number;
    stencilFail: number;
    stencilZFail: number;
    stencilZPass: number;
    userData: {
        [key: string]: any;
    };
    static uniqueHashFromData(data: any, ignoreNameInMaterialId?: boolean): string;
}
//# sourceMappingURL=material.model.d.ts.map