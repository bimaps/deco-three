import { CheckerModuleType, CheckerModuleFilter } from './checker-internals';
import { CheckerModuleBaseModel, CheckerFlowModel, CheckerModuleIOType, CheckerModuleIOTypeOptions } from './checker-internals';
import { CheckerModuleTypeOptions } from './checker-internals';
import { CheckerObjectCondition, CheckerConditionOperator } from './checker-internals';
import { ThreeSiteModel } from '../site.model';
import { model, type, io, query, validate, ObjectId, mongo, AppModel } from '@bim/deco-api';
let debug = require('debug')('app:models:three:checker:module-filter');

@model('checker_module')
export class CheckerModuleFilterModel extends CheckerModuleBaseModel implements CheckerModuleFilter {

  @type.id
  public _id: ObjectId;

  @type.model({model: AppModel})
  @io.input
  @io.toDocument
  @query.filterable()
  @validate.required
  @mongo.index({type: 'single'})
  public appId: ObjectId;

  @type.model({model: ThreeSiteModel})
  @io.all
  @query.filterable()
  @validate.required
  @mongo.index({type: 'single'})
  public siteId: ObjectId;

  @type.select({options: CheckerModuleIOTypeOptions, multiple: true})
  @io.toDocument
  @io.output
  public allowedInputTypes: Array<CheckerModuleIOType> = ['three-objects', 'scene'];
  
  @type.select({options: CheckerModuleTypeOptions})
  @io.toDocument
  @io.output
  @validate.required
  public moduleType: CheckerModuleType = 'filter';

  @type.string
  @io.all
  public name: string = '';

  @type.string
  @io.all
  @validate.required
  public inputVarName?: string;

  @type.string
  @io.all
  @validate.required
  public outputVarName: string;

  @type.select({options: CheckerModuleIOTypeOptions, multiple: false})
  @io.toDocument
  @io.output
  public outputType: CheckerModuleIOType = 'three-objects'

  public outputValue: THREE.Object3D[];

  @type.string
  @io.toDocument
  @io.output
  public outputSummary: string;

  @type.array({
    type: 'object',
    options: {
      keys: {
        key: {type: 'string'},
        operation: {type: 'string'},
        value: {type: 'string'}
      }
    }
  })
  @io.all
  public conditions: Array<CheckerObjectCondition>;

  @type.select({options: ['or', 'and']})
  @io.all
  public conditionsOperator: CheckerConditionOperator = 'and';

  private inputObjects: Array<THREE.Object3D> = [];

  public async process(flow: CheckerFlowModel): Promise<void> {
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
