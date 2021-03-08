import { Model, ObjectId } from 'deco-api';
export interface ThreeThemeRule {
    [key: string]: any;
    styles: string[];
}
export declare class ThreeThemeModel extends Model {
    _id: ObjectId;
    appId: ObjectId;
    siteId: ObjectId;
    name: string;
    rules: Array<ThreeThemeRule>;
    spaceHeight: number;
}
//# sourceMappingURL=theme.model.d.ts.map