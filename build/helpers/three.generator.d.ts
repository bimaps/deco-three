import { ThreeSpaceModel } from './../models/space.model';
import * as THREE from 'three';
export declare class ThreeGenerator {
    materials: {
        [key: string]: THREE.Material | THREE.Material[];
    };
    shapeFromGeoJSON(feature: GeoJSON.Feature, scale?: number): THREE.Shape | null;
    extrudeFromGeoJSON(feature: GeoJSON.Feature, material: THREE.Material, options: THREE.ExtrudeGeometryOptions & {
        scale?: number;
    }): THREE.Mesh | null;
    space2mesh(space: ThreeSpaceModel, material: THREE.Material, defaultHeight?: number, options?: {
        alwaysUseDefaultHeight: boolean;
    }): THREE.Mesh | null;
    getMaterial(color: string, opacity?: number, type?: 'Basic' | 'Phong'): THREE.Material | THREE.Material[];
    centeredCube(length?: number, material?: THREE.Material): THREE.Mesh;
    groundAnd3Cubes(): THREE.Object3D;
    testAllGeometries(): THREE.Object3D[];
}
//# sourceMappingURL=three.generator.d.ts.map