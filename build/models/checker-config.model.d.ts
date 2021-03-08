import { Model, ObjectId, Metadata } from 'deco-api';
export declare class ThreeCheckerConfigModel extends Model {
    _id: ObjectId;
    appId: ObjectId;
    siteId: ObjectId;
    name: string;
    description: string;
    conditions: Array<Condition>;
    operation: CheckerOperation;
    operationSettings: any;
    metadata: Array<Metadata>;
}
export interface Condition {
    key: string;
    operator: '=' | '<' | '>' | '!=' | '*';
    value: string | number | Date;
}
export declare type CheckerOperation = 'count' | 'compare-key-value' | 'add-key-value';
//# sourceMappingURL=checker-config.model.d.ts.map