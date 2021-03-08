import { ThreeJsonData } from './three.importer';
export interface ReduceMaterialsOptions {
    ignoreNameInMaterialId?: boolean;
}
export declare class ThreeMaterialHelper {
    static reduceMaterials(json: ThreeJsonData, options?: ReduceMaterialsOptions): any;
    private static mapChildrenWithMaterial;
}
//# sourceMappingURL=three.material.d.ts.map