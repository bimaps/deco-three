import { Model, ObjectId, Metadata } from 'deco-api';
import * as THREE from 'three';
export declare class ThreeSiteModel extends Model {
    _id: ObjectId;
    appId: ObjectId;
    ifcSiteId: string;
    name: string;
    metadata: Array<Metadata>;
    center: THREE.Vector3;
    originalCameraPosition: THREE.Vector3;
    originalCameraZoom: number;
    originalCameraLookAt: THREE.Vector3;
    bcfProjectId?: string;
    location?: Array<number>;
    refDirection?: Array<number>;
    axis?: Array<number>;
}
//# sourceMappingURL=site.model.d.ts.map