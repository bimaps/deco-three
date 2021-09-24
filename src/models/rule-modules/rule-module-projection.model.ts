import {
  RULE_MODULE_MONGO_COLLECTION_NAME,
  RuleModel,
  RuleModuleBaseModel,
  RuleModuleIOType,
  RuleModuleIOTypeOptions,
  RuleModuleProjection,
  RuleModuleType,
  RuleModuleTypeOptions,
} from "../checkers/checker-internals";
import {
  AppModel,
  io,
  model,
  mongo,
  ObjectId,
  query,
  type,
  validate,
} from "@bim/deco-api";

let debug = require("debug")("app:models:three:checker:module-projection");

@model(RULE_MODULE_MONGO_COLLECTION_NAME)
export class RuleModuleProjectionModel
  extends RuleModuleBaseModel
  implements RuleModuleProjection
{
  @type.id
  public _id: ObjectId;

  @type.model({ model: AppModel })
  @io.input
  @io.toDocument
  @query.filterable()
  @validate.required
  @mongo.index({ type: "single" })
  public appId: ObjectId;

  @type.select({ options: RuleModuleIOTypeOptions, multiple: true })
  @io.toDocument
  @io.output
  public allowedInputTypes: Array<RuleModuleIOType> = [
    "numbers",
    "strings",
    "number",
    "string",
  ];

  @type.select({ options: RuleModuleTypeOptions })
  @io.toDocument
  @io.output
  @validate.required
  public moduleType: RuleModuleType = "projection";

  @type.string
  @io.all
  @validate.required
  public name: string = "";

  @type.string
  @io.all
  public description: string = "";

  @type.string
  @io.all
  @validate.required
  public inputVarName?: string;

  @type.string
  @io.all
  @validate.required
  public outputVarName: string;

  @type.select({ options: RuleModuleIOTypeOptions, multiple: false })
  @io.toDocument
  @io.output
  public outputType: RuleModuleIOType;

  public outputValue:
    | string[]
    | string
    | number[]
    | number
    | boolean[]
    | boolean;

  @type.string
  @io.toDocument
  @io.output
  public outputSummary: string;

  /* Add here properties for this module */

  @type.select({ options: ["x", "y", "z"] })
  @io.all
  public projectionAxis: "x" | "y" | "z";

  public async process(flow: RuleModel): Promise<void> {
    super.process(flow);
    /* Implement here the process */
  }

  public async summary(): Promise<void> {
    super.summary();
    /* Implement here the summary method that saves inside outputSummary */
  }
}
