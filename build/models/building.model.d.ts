import { Model, ObjectId, Metadata } from 'deco-api';
export declare class ThreeBuildingModel extends Model {
    _id: ObjectId;
    appId: ObjectId;
    siteId: ObjectId;
    ifcBuildingId: string;
    importId: string;
    name: string;
    location?: Array<number>;
    refDirection?: Array<number>;
    axis?: Array<number>;
    userData: {
        [key: string]: any;
    };
    metadata: Array<Metadata>;
}
//# sourceMappingURL=building.model.d.ts.map