import { AppModel, NotificationEmailService } from "@bim/deco-api";
import { Response } from "express";
import { Attachment } from "nodemailer/lib/mailer";
import path from "path";

let debug = require("debug")("app:actions:three:send-report");

export class ThreeSendReportAction {
  public static async run(res: Response) {
    debug("run");
    if (!res.locals.actions?.variables?.email) {
      throw new Error("Three Report Action: Missing email variable");
    }
    if (!res.locals.actions?.variables?.threeReportFile) {
      throw new Error("Three Report Action: Missing threeReportFile variable");
    }
    if (!res.locals.actions?.variables?.threeReportOutput) {
      throw new Error(
        "Three Report Action: Missing threeReportOutput variable"
      );
    }
    const app = res.locals.app;
    if (app instanceof AppModel) {
    } else {
      throw new Error("Three Report Action: Missing app");
    }
    debug("email", res.locals.actions?.variables?.email);

    const file = res.locals.actions.variables.threeReportFile;

    const attachedFile: Attachment = {
      filename: "ifc-checker.pdf",
      content: Buffer.from(file),
    };

    const emailService = NotificationEmailService.serviceForApp(res.locals.app);
    const emailsRoot = path.join(__dirname, "../../../emails");
    const emailResult = await emailService.send(
      res.locals.actions.variables.email,
      "send-report",
      {
        operationId: res.locals.currentOperation?.id,
        app: res.locals.app,
        ifcFilename: res.locals.actions?.variables?.ifcFilename,
      },
      { rootPath: emailsRoot },
      [attachedFile]
    );

    debug("emailResult", emailResult);
  }
}
