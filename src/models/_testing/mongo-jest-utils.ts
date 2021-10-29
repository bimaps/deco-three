import { Db, MongoClient } from 'mongodb';
import { AppModel, datastore, Model, ObjectId, Query } from '@bim/deco-api';
import { MongoMemoryServer } from 'mongodb-memory-server';

export let con: MongoClient;
export let mongoServer: MongoMemoryServer;

export const FAKE_APP_ID = '5ea705e51841a800064fee19';
let newMasterApp: any;
export let db: Db;

/**
 * Connect to the newly started Mongo DB in memory.
 */
export async function connectToMongoMemory() {
  mongoServer = new MongoMemoryServer();
  const mongoUri = await mongoServer.getUri();
  con = await MongoClient.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  db = con.db(await mongoServer.getDbName());
}

/**
 * Init the DB connection in the datastore singleton that is used everywhere by deco-api.
 */
export async function prepareDecoDb() {
  expect(db).toBeDefined();

  const database = await mongoServer.getDbName();
  const port = await mongoServer.getPort();
  await datastore.init({ database, host: '127.0.0.1', user: '', password: '', port }).connect();

  expect(datastore.isReady()).toBeTruthy();

  AppModel.prototype.deco.db = db; // For some reason, we have to specifically set the db for `AppModel`
}

/**
 * Prepare the app.
 * Deco API needs a master app that is referenced by others collections.
 */
export async function prepareApp() {
  // We cannot use deco-api to generate the first app (error: appId is invalid)
  newMasterApp = await db.collection('apps').insertOne({
    appId: new ObjectId(FAKE_APP_ID),
    name: 'test master app',
  });
}

/**
 * Inserts data in mongo db from a specified model and data
 * @param modelType The model type to work on
 * @param data The data of the model
 */
export async function insertModelItem<TModel extends Model>(modelType: new () => TModel, data: Partial<TModel>) {
  const model = new modelType();
  Object.assign(model, data);
  await model.insert();
  return model;
}

/**
 * Clears the collection from specified model type
 * @param modelType The model type to work on
 */
export async function clearModelItems<TModel extends Model>(modelType: typeof Model & (new () => TModel)) {
  const collectionItems = await db?.listCollections({ name: modelType.deco.collectionName }).toArray();

  if (!!collectionItems.length) {
    await db.collection(modelType.deco.collectionName).deleteMany({});
  }
}
