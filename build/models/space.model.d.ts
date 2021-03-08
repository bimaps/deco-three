import { Model, ObjectId, Metadata } from 'deco-api';
import GeoJSON from 'geojson';
export declare class ThreeSpaceModel extends Model {
    _id: ObjectId;
    appId: ObjectId;
    siteId: ObjectId;
    buildingId: ObjectId;
    storeyIds: ObjectId[];
    ifcSpaceId: string;
    importId: string;
    name: string;
    userData: {
        [key: string]: any;
    };
    boundary: GeoJSON.Feature;
    location?: Array<number>;
    refDirection?: Array<number>;
    axis?: Array<number>;
    metadata: Array<Metadata>;
}
//# sourceMappingURL=space.model.d.ts.map