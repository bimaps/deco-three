import { Model, ObjectId, Metadata } from 'deco-api';
export declare class ThreeStoreyModel extends Model {
    _id: ObjectId;
    appId: ObjectId;
    siteId: ObjectId;
    buildingId: ObjectId;
    ifcStoreyId: string;
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
//# sourceMappingURL=storey.model.d.ts.map