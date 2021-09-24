import {
  ControllerMiddleware,
  datastore,
  Model,
  ObjectId,
} from "@bim/deco-api";
import { Request, Response } from "express";
import { modelsByType } from "../models";

/**
 * Specification of the standard controller middleware to handle Three modules inheritance
 */
export class ThreeModuleControllerMiddleware extends ControllerMiddleware {
  /** @inheritDoc */
  public getOneElement(
    element: Model,
    req: Request,
    res: Response
  ): Promise<Model> {
    return Promise.resolve(element);
  }

  /** @inheritDoc */
  public async getOneElementId(
    elementId: string | ObjectId,
    req: Request,
    res: Response
  ): Promise<string | ObjectId> {
    return this.setModelFromModuleType(elementId, req, res);
  }

  /** @inheritDoc */
  public async putElementId(
    elementId: string | ObjectId,
    req: Request,
    res: Response
  ): Promise<string | ObjectId> {
    return this.setModelFromModuleType(elementId, req, res);
  }

  /**
   * Sets the model of the specified element
   * @param elementId The module identifier
   * @param req The express request
   * @param res The express response
   */
  public async setModelFromModuleType(
    elementId: string | ObjectId,
    req: Request,
    res: Response
  ): Promise<string | ObjectId> {
    // here the idea is to fetch the type of the element and set the .model property accordingly
    if (typeof elementId === "string") {
      try {
        elementId = new ObjectId(elementId);
      } catch (_error) {
        throw new Error("Invalid elementId");
      }
    }

    const data = await datastore.db
      .collection(this.model.deco.collectionName)
      .findOne({ _id: elementId });
    const model = modelsByType[data?.moduleType];
    if (!model) {
      throw new Error("Invalid module type");
    }
    this.model = model;
    return Promise.resolve(elementId);
  }
}
