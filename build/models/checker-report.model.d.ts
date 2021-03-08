import { Model, ObjectId, Metadata } from 'deco-api';
export declare class ThreeCheckerReportModel extends Model {
    _id: ObjectId;
    appId: ObjectId;
    siteId: ObjectId;
    name: string;
    description: string;
    flows: Array<ObjectId>;
    metadata: Array<Metadata>;
}
//# sourceMappingURL=checker-report.model.d.ts.map