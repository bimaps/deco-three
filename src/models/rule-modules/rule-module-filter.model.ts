import {
  RULE_MODULE_MONGO_COLLECTION_NAME,
  RuleModel,
  RuleModuleBaseModel,
  RuleModuleConditionOperator,
  RuleModuleFilter,
  RuleModuleIOType,
  RuleModuleIOTypeOptions,
  RuleModuleObjectCondition,
  RuleModuleType,
  RuleModuleTypeOptions,
} from '../checkers/checker-internals';
import { AppModel, io, model, mongo, ObjectId, query, type, validate } from '@bim/deco-api';

let debug = require('debug')('app:models:three:checker:module-filter');

@model(RULE_MODULE_MONGO_COLLECTION_NAME)
export class RuleModuleFilterModel extends RuleModuleBaseModel implements RuleModuleFilter {
  @type.id
  public _id: ObjectId;

  @type.model({ model: AppModel })
  @io.all
  @query.filterable()
  @validate.required
  @mongo.index({ type: 'single' })
  public appId: ObjectId;

  @type.select({ options: RuleModuleIOTypeOptions, multiple: true })
  @io.all
  public allowedInputTypes: Array<RuleModuleIOType> = ['three-objects', 'scene'];

  @type.select({ options: RuleModuleTypeOptions })
  @io.all
  @validate.required
  public moduleType: RuleModuleType = 'filter';

  @type.string
  @io.all
  @validate.required
  public name: string = '';

  @type.string
  @io.all
  public description: string = '';

  @type.string
  @io.all
  @validate.required
  public inputVarName?: string;

  @type.string
  @io.all
  @validate.required
  public outputVarName: string;

  @type.select({ options: RuleModuleIOTypeOptions, multiple: false })
  @io.all
  public outputType: RuleModuleIOType = 'three-objects';

  public outputValue: THREE.Object3D[];

  @type.string
  @io.all
  public outputSummary: string;

  @type.array({
    type: 'object',
    options: {
      keys: {
        key: { type: 'string' },
        operation: { type: 'string' },
        value: { type: 'string' },
      },
    },
  })
  @io.all
  public conditions: Array<RuleModuleObjectCondition>;

  @type.select({ options: ['or', 'and'] })
  @io.all
  public conditionsOperator: RuleModuleConditionOperator = 'and';

  private inputObjects: Array<THREE.Object3D> = [];

  public async process(flow: RuleModel): Promise<void> {
    super.process(flow);
    if (this.currentInput && this.currentInputType === 'three-objects') {
      this.inputObjects = this.currentInput as THREE.Object3D[];
      // process filtering
    } else if (this.currentInput && this.currentInputType === 'scene') {
      this.inputObjects = [];
      flow.scene.traverse((obj) => {
        this.inputObjects.push(obj);
      });
    } else {
      throw new Error('Invalid filter input');
    }

    const output: THREE.Object3D[] = [];
    for (const object of this.inputObjects) {
      let keep = false;
      for (let condition of this.conditions) {
        keep = flow.compareObject(object, condition);
        if (keep && this.conditionsOperator === 'or') {
          break;
        }
        if (!keep && this.conditionsOperator === 'and') {
          break;
        }
      }
      if (keep) {
        output.push(object);
      }
    }

    this.outputType = 'three-objects';
    this.outputValue = output;
  }

  public async summary(): Promise<void> {
    if (Array.isArray(this.outputValue)) {
      this.outputSummary = `${this.outputValue.length} elements`;
    } else {
      this.outputSummary = '';
    }
    await this.update(['outputSummary']);
  }
}
