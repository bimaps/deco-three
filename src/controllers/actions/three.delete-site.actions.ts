import { ThreeSiteModel } from "./../../models/site.model";
import { Response } from "express";

let debug = require("debug")("app:actions:three:send-report");

export class ThreeDeleteSiteAction {
  public static async run(res: Response) {
    debug("run");
    if (!res.locals.actions?.variables?.siteId) {
      throw new Error("Three Report Action: Missing siteId variable");
    }
    const siteId = res.locals.actions.variables.siteId;
    debug("siteId", siteId);

    const site = await ThreeSiteModel.getOneWithId(siteId);
    if (!site) {
      throw new Error("Site not found");
    }

    let deletePromises: Array<Promise<any>> = [];
    const collectionNames: Array<string> = [
      "three_geometry",
      "three_material",
      "three_object",
      "three_building",
      "three_storey",
      "three_space",
      "three_theme",
      "three_style",
      "checker_report",
      "checker_module",
      "checker_flow",
    ];
    let query = { siteId: siteId };
    for (let collectionName of collectionNames) {
      deletePromises.push(
        ThreeSiteModel.deco.db
          .collection(collectionName)
          .deleteMany(query)
          .then((result) => {
            return {
              model: collectionName,
              nbDeleted: result.deletedCount,
            };
          })
      );
    }
    const deleteResult = await Promise.all(deletePromises);
    debug(deleteResult);
  }
}
