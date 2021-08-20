import { ThreeSiteModel } from './../models/site.model';
export interface ObjFileResponse {
    ifcPath: string;
    objPath: string;
    mtlPath: string;
}
export interface ConvertFileResponse {
    ifcPath: string;
    objPath?: string;
    mtlPath?: string;
    jsonPath?: string;
}
export declare class IfcHelper {
    static IFC_SERVICE_HOST: string | undefined;
    static IFC_SERVICE_API_KEY: string | undefined;
    static convertWithMicroservice(filepath: string, formats?: ('json' | 'obj')[]): Promise<ConvertFileResponse>;
    private static waitForOperationCompletion;
    static convert2obj(filepath: string): Promise<ObjFileResponse>;
    static parseIfcMetadata(filepath: string, site: ThreeSiteModel, importId: string): Promise<void>;
    private static psetInMetadata;
    private static applyUserDataFromIfc;
}
//# sourceMappingURL=ifc.helper.d.ts.map