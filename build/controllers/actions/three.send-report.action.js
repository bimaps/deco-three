"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThreeSendReportAction = void 0;
const deco_api_1 = require("deco-api");
const path_1 = __importDefault(require("path"));
let debug = require('debug')('app:actions:three:send-report');
class ThreeSendReportAction {
    static run(res) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
        return __awaiter(this, void 0, void 0, function* () {
            debug('run');
            if (!((_b = (_a = res.locals.actions) === null || _a === void 0 ? void 0 : _a.variables) === null || _b === void 0 ? void 0 : _b.email)) {
                throw new Error('Three Report Action: Missing email variable');
            }
            if (!((_d = (_c = res.locals.actions) === null || _c === void 0 ? void 0 : _c.variables) === null || _d === void 0 ? void 0 : _d.threeReportFile)) {
                throw new Error('Three Report Action: Missing threeReportFile variable');
            }
            if (!((_f = (_e = res.locals.actions) === null || _e === void 0 ? void 0 : _e.variables) === null || _f === void 0 ? void 0 : _f.threeReportOutput)) {
                throw new Error('Three Report Action: Missing threeReportOutput variable');
            }
            const app = res.locals.app;
            if (app instanceof deco_api_1.AppModel) {
            }
            else {
                throw new Error('Three Report Action: Missing app');
            }
            debug('email', (_h = (_g = res.locals.actions) === null || _g === void 0 ? void 0 : _g.variables) === null || _h === void 0 ? void 0 : _h.email);
            const file = res.locals.actions.variables.threeReportFile;
            const attachedFile = {
                filename: 'ifc-checker.pdf',
                content: Buffer.from(file),
            };
            const emailService = deco_api_1.NotificationEmailService.serviceForApp(res.locals.app);
            const emailsRoot = path_1.default.join(__dirname, '../../../emails');
            const emailResult = yield emailService.send(res.locals.actions.variables.email, 'send-report', {
                operationId: (_j = res.locals.currentOperation) === null || _j === void 0 ? void 0 : _j.id,
                app: res.locals.app,
                ifcFilename: (_l = (_k = res.locals.actions) === null || _k === void 0 ? void 0 : _k.variables) === null || _l === void 0 ? void 0 : _l.ifcFilename,
            }, { rootPath: emailsRoot }, [attachedFile]);
            debug('emailResult', emailResult);
        });
    }
}
exports.ThreeSendReportAction = ThreeSendReportAction;
//# sourceMappingURL=three.send-report.action.js.map