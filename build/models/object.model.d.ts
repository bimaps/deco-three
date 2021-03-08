import { Model, ObjectId } from 'deco-api';
import * as THREE from 'three';
export declare class ThreeObjectModel extends Model {
    _id: ObjectId;
    appId: ObjectId;
    siteId: ObjectId;
    buildingId: ObjectId;
    storeys: Array<ObjectId>;
    spaceId: ObjectId;
    importId: string;
    formatVersion: string;
    uuid: string;
    name: string;
    type: string;
    matrix: THREE.Matrix4;
    material: string | Array<string>;
    geometry: string | Array<string>;
    layers: number;
    color: number;
    intensity: number;
    userData: {
        [key: string]: any;
    };
    childrenIds: Array<ObjectId>;
    parentId: ObjectId;
    visible: boolean;
    _min: THREE.Vector3;
    _max: THREE.Vector3;
}
//# sourceMappingURL=object.model.d.ts.map