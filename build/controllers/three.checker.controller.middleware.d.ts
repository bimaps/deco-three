import { Condition, CheckerOperation } from './../models/checker-config.model';
import { Request, Response, NextFunction } from 'express';
import { ControllerMiddleware } from 'deco-api';
export declare class ThreeCheckerControllerMiddleware extends ControllerMiddleware {
    static runReport(pdf?: boolean): (req: Request, res: Response, next: NextFunction) => Promise<void>;
    static run(pdf?: boolean): (req: Request, res: Response, next: NextFunction) => Promise<void>;
    private static prepareScene;
    private static runChecker;
    private static preparePathKey;
    private static compare;
    private static makeNumberIfPossible;
    private static printReportHead;
    private static printChecker;
}
export interface CheckerResult {
    name: string;
    description?: string;
    isValid?: boolean;
    valueBeforeExpression?: number | string;
    value?: number | string;
    conditions: Array<Condition>;
    nbValid?: number;
    nbInvalid?: number;
    nbObjectsWithValue?: number;
    operation: CheckerOperation;
    operationSettings: any;
    set: Array<CheckerResultSetItem>;
}
export interface CheckerResultSetItem {
    name: string;
    ifcId?: string;
    isValid?: boolean;
    value?: number;
    testValue?: any;
}
export interface ReportResult {
    name: string;
    description?: string;
    results: CheckerResult[];
}
//# sourceMappingURL=three.checker.controller.middleware.d.ts.map