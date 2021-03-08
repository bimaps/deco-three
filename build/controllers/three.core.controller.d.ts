import { Request, Response, NextFunction } from 'express';
import { ControllerMiddleware, Query } from 'deco-api';
export declare class ThreeCoreControllerMiddleware extends ControllerMiddleware {
    extendGetAllQuery(query: Query, req: Request, res: Response): Promise<void>;
    importJSON(req: Request, res: Response, next: NextFunction): void;
    importIFC(req: Request, res: Response, next: NextFunction): void;
    deleteData(req: Request, res: Response, next: NextFunction): void;
    clearImport(req: Request, res: Response, next: NextFunction): void;
    fetchBuildingsInfos(): (req: Request, res: Response, next: NextFunction) => void;
    fetchKeyValues(): (req: Request, res: Response, next: NextFunction) => void;
}
//# sourceMappingURL=three.core.controller.d.ts.map