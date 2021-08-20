import { ThreeSpaceModel } from './../models/space.model';
import { PDF, PDFTextBlock } from '@bim/deco-api';
import { ThreeGenerator } from '../helpers/three.generator';
import { ThreeMaterialModel } from './../models/material.model';
import { ThreeObjectModel } from './../models/object.model';
import { ThreeCheckerConfigModel, Condition, CheckerOperation } from './../models/checker-config.model';
import { ThreeCheckerReportModel } from './../models/checker-report.model';
import { ThreeGeometryModel } from './../models/geometry.model';
import { ThreeSiteModel } from './../models/site.model';
import { Request, Response, NextFunction } from 'express';
import { ControllerMiddleware, Query, ObjectId } from '@bim/deco-api';
import * as THREE from 'three';
import resolvePath from 'object-resolve-path';
import moment from 'moment';
import * as math from 'mathjs';

let debug = require('debug')('app:models:three:controller:core');

export class ThreeCheckerControllerMiddleware extends ControllerMiddleware {

  public static runReport(pdf: boolean = false) {
    return (req: Request, res: Response, next: NextFunction) => {
      return new Promise(async (resolve, reject) => {
        try {
          const scene = await ThreeCheckerControllerMiddleware.prepareScene(req.params.siteId);
          const report = await ThreeCheckerReportModel.getOneWithId(req.params.reportId);
          if (!report) {
            return reject(new Error('Report not found'));
          }
          const checkerResults: CheckerResult[] = [];
          // for (let checkerId of report.checkers) {
          //   const result = await ThreeCheckerControllerMiddleware.runChecker(scene, checkerId);
          //   checkerResults.push(result);
          // }
          const result: ReportResult = {
            name: report.name,
            description: report.description,
            results: checkerResults
          };
          resolve(result);
        } catch (error) {
          reject(error);
        }
      }).then(async (result) => {
        if (pdf) {
          const pdf = new PDF();
          await pdf.create()
          await ThreeCheckerControllerMiddleware.printReportHead(pdf, result as ReportResult);
          for (let res of (result as ReportResult).results) {
            await ThreeCheckerControllerMiddleware.printChecker(pdf, res);
          }
          const file = await pdf.document.save();
          const fileName = (result as any).name + '.pdf';
          res.writeHead(200, {
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'attachment; filename=' + fileName,
            'Content-Length': file.length
          });
          res.end(Buffer.from(file));
        } else {
          res.send(result);
        }
      }).catch((error) => {
        return next(error);
      });
    }
  }

  public static run(pdf: boolean = false) {
    return (req: Request, res: Response, next: NextFunction) => {
      return new Promise(async (resolve, reject) => {
        const scene = await ThreeCheckerControllerMiddleware.prepareScene(req.params.siteId);
        const result = await ThreeCheckerControllerMiddleware.runChecker(scene, req.params.configId);
        resolve(result);
      }).then(async (result) => {
        if (pdf) {
          const pdf = new PDF();
          await pdf.create()
          await ThreeCheckerControllerMiddleware.printChecker(pdf, result as CheckerResult);
          const file = await pdf.document.save();
          const fileName = (result as any).name + '.pdf';
          res.writeHead(200, {
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'attachment; filename=' + fileName,
            'Content-Length': file.length
          });
          res.end(Buffer.from(file));
        } else {
          res.send(result);
        }
      }).catch((error) => {
        return next(error);
      });
    }
  }

  private static async prepareScene(siteId: string) {
    const site = await ThreeSiteModel.getOneWithId(siteId);
    if (!site) {
      throw new Error('Site not found');
    }
    const objects = await ThreeObjectModel.getAll(new Query({siteId: site._id})) || [];
    const matIds = objects.map(o => o.material);
    const materials = await ThreeMaterialModel.getAll(new Query({uuid: {$in: matIds}}));
    const geoIds = objects.map(o => o.geometry);
    const geometries = await ThreeGeometryModel.getAll(new Query({uuid: {$in: geoIds}}));
    const spaces = await ThreeSpaceModel.getAll(new Query({siteId: site._id}));
    const sceneJson = {
      metadata: {
        version: 4.5,
        type: 'Object',
        generator: 'swissdata'
      },
      geometries: geometries,
      materials: materials,
      object: {
        children: objects,
        layers: 1,
        matrix: [
            1,
            0,
            0,
            0,
            0,
            1,
            0,
            0,
            0,
            0,
            1,
            0,
            0,
            0,
            0,
            1
        ],
        type: 'Scene'
      }
    };
    const loader = new THREE.ObjectLoader();
    const scene: THREE.Object3D = await new Promise((resolve2, reject2) => {
      loader.parse(sceneJson, (object) => {
        resolve2(object);
      });
    });
    const generator = new ThreeGenerator();
    const spaceMaterial = new THREE.MeshBasicMaterial();
    for (const space of spaces) {
      const mesh = generator.space2mesh(space, spaceMaterial);
      if (mesh) {
        scene.add(mesh);
      }
    }
    return scene;
  }

  private static async runChecker(scene: THREE.Object3D, checkerId: string | ObjectId): Promise<CheckerResult> {
    const config = await ThreeCheckerConfigModel.getOneWithId(checkerId);
    if (!config) {
      throw new Error('Checker config not found');
    }
    const objectsSet: Array<THREE.Object3D> = [];
    scene.traverse((obj) => {
      for (let condition of config.conditions) {
        if (!ThreeCheckerControllerMiddleware.compare(obj, condition)) {
          return;
        }
      }
      objectsSet.push(obj);
    });
    const result: CheckerResult = {
      name: config.name,
      description: config.description,
      conditions: config.conditions,
      operation: config.operation,
      operationSettings: config.operationSettings,
      set: objectsSet.map(o => {return {name: o.userData.name, ifcId: o.userData.ifcId}})
    };
    if (config.operation === 'count') {
      result.value = objectsSet.length;
    } else if (config.operation === 'add-key-value') {
      let value = 0;
      let nbObjectsWithValue = 0;
      for (let index = 0; index < objectsSet.length; index++) {
        const obj = objectsSet[index];
        const key = ThreeCheckerControllerMiddleware.preparePathKey(config.operationSettings.key);
        const objValue = resolvePath(obj, key);
        if (objValue !== undefined) {
          nbObjectsWithValue++;
          result.set[index].value = parseFloat(objValue);
          value += parseFloat(objValue);
        }
      }
      result.nbObjectsWithValue = nbObjectsWithValue;
      result.value = value;
    } else if (config.operation === 'compare-key-value') {
      let nbValid = 0;
      let nbInvalid = 0;
      for (let index = 0; index < objectsSet.length; index++) {
        const obj = objectsSet[index];
        const key = ThreeCheckerControllerMiddleware.preparePathKey(config.operationSettings.key);
        const objValue = resolvePath(obj, key);
        result.set[index].testValue = objValue;
        result.set[index].isValid = ThreeCheckerControllerMiddleware.compare(obj, config.operationSettings);            
        if (result.set[index].isValid) {
          nbValid++;
        } else {
          nbInvalid++;
        }
      }
      result.nbValid = nbValid;
      result.nbInvalid = nbInvalid;
    }
    if (result.operationSettings && result.operationSettings.expression) {
      result.valueBeforeExpression = result.value;
      const scope = Object.assign({}, result, {nbItems: result.nbObjectsWithValue || result.set.length});
      try {
        const evaluatedValue = math.evaluate(result.operationSettings.expression, scope);
        if (evaluatedValue !== undefined) {
          result.value = evaluatedValue;
        }
      } catch (error) {
        // do nothing
        console.error(error);
      }
    }
    return result;
  }

  private static preparePathKey(key: string) {
    const parts = key.split('.');
    for (let i = 0; i < parts.length; i++) {
      if (i === 0) {
        continue;
      }
      parts[i] = `["${parts[i]}"]`;
    }
    return parts.join('');
  }

  private static compare(object: THREE.Object3D, condition: Condition): boolean {
    const key = ThreeCheckerControllerMiddleware.preparePathKey(condition.key);
    let value = resolvePath(object, key);
    if (typeof condition.value === 'number' && typeof value === 'string') {
      value = parseFloat(value);
    } else if (condition.value instanceof Date && typeof value === 'string') {
      value = moment(value).toDate();
    }
    if (condition.operator === '=') {
      if (ThreeCheckerControllerMiddleware.makeNumberIfPossible(value) != ThreeCheckerControllerMiddleware.makeNumberIfPossible(condition.value)) return false;
    } else if (condition.operator === '!=') {
      if (ThreeCheckerControllerMiddleware.makeNumberIfPossible(value) == ThreeCheckerControllerMiddleware.makeNumberIfPossible(condition.value)) return false;
    } else if (condition.operator === '<') {
      if (ThreeCheckerControllerMiddleware.makeNumberIfPossible(value) > ThreeCheckerControllerMiddleware.makeNumberIfPossible(condition.value)) return false;
    } else if (condition.operator === '>') {
      if (ThreeCheckerControllerMiddleware.makeNumberIfPossible(value) < ThreeCheckerControllerMiddleware.makeNumberIfPossible(condition.value)) return false;
    } else if (condition.operator === '*') {
      if (typeof condition.value !== 'string' && condition.value.toString) condition.value = condition.value.toString();
      if (typeof value !== 'string' && value.toString) value = value.toString();
      if (typeof value !== 'string' || typeof condition.value !== 'string') {
        // could not convert values to string
        return false;
      }
      if (value.toLowerCase().indexOf(condition.value.toLowerCase()) === -1) return false;
    }
    return true;
  }

  private static makeNumberIfPossible(input: string | any): number | any {
    if (typeof input !== 'string') {
      return input;
    }
    const num = parseFloat(input.trim());
    return `${num}` === input.trim() ? num : input;
  }

  private static async printReportHead(pdf: PDF, report: ReportResult) {
    const head = new PDFTextBlock(pdf);
    head.text = `# ${report.name}`;

    if (report.description) {
      head.text += `

${report.description}`
    }
    head.apply();
  }

  private static async printChecker(pdf: PDF, result: CheckerResult) {
    const head = new PDFTextBlock(pdf);
    head.fontSize = 12;
    head.text = `### ${result.name}`;

    if (result.description) {
      head.text += "\n";
      head.text += `(color:0.5,0.5,0.5) ${result.description} (color:0)`
    }

    head.text += "\n";
    head.text += "\n";

    head.text += "\n" + `**Nb Objects in set:** ${result.set.length}`;

    if (result.nbObjectsWithValue !== undefined) {
      head.text += "\n" + `**Nb Objects with value:** ${result.nbObjectsWithValue}`;
    }

    head.text += "\n" + `**Operation:** ${result.operation}`;

    if (result.operation === 'compare-key-value') {
      head.text += "\n" + `${result.operationSettings.key} ${result.operationSettings.operator} ${result.operationSettings.value}`;
    }

    if (result.operation === 'add-key-value') {
      head.text += "\n" + `Key to add: ${result.operationSettings.key}`;
    }

    if (result.operationSettings.expression) {
      head.text += "\n" + `**Value before expression:** ${result.valueBeforeExpression}`;
    }

    if (result.operationSettings.expression) {
      head.text += "\n" + `**Expression:** ${result.operationSettings.expression}`;
    }

    if (result.value !== undefined) {
      head.text += "\n" + `**Value:** ${result.value}`;
    }

    if (result.nbValid !== undefined) {
      head.text += "\n" + `**Nb Valid:** ${result.nbValid}`;
    }
    if (result.nbInvalid !== undefined) {
      head.text += "\n" + `**Nb Invalid:** ${result.nbInvalid}`;
    }

    if (result.isValid !== undefined) {
      const color = result.isValid ? '0,1,0' : '1,0,0';
      head.text += "\n" + `**Valid:** (color:${color}) ${result.isValid ? 'Yes':'No'} (color:0)`;
    }

    head.apply();

    const set = new PDFTextBlock(pdf);
    set.fontSize = 12;

    set.text = '**Objects included in the check**';

    set.text += "\n";
    set.text += "\n";

    for (let item of result.set) {

      set.text += `${item.name} (${item.ifcId})`;
      set.text += "\n";

      if (item.value) {
        set.text += `Value: ${item.value}`;
        set.text += "\n";
      }

      if (item.testValue !== undefined) {
        const color = item.isValid ? '0,1,0' : '1,0,0';
        set.text += `Value: (color:${color}) ${item.testValue} (color:0)`;
        set.text += "\n";
      }

      if (item.isValid !== undefined) {
        const color = item.isValid ? '0,1,0' : '1,0,0';
        set.text += `Valid: (color:${color}) ${item.isValid ? 'Yes' : 'No'} (color:0)`;
        set.text += "\n";
      }
    }

    set.apply();

  }

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