import { con, connectToMongoMemory, db, FAKE_APP_ID, mongoServer, prepareApp, prepareDecoDb } from './_testing/mongo-jest-utils';
import { ObjectId } from '@bim/deco-api';
import { RuleModel } from './rule.model';

describe('rule model', () => {
  beforeAll(async () => {
    await connectToMongoMemory();
    await prepareDecoDb();
    await prepareApp();
  });

  it('should have an appId', async () => {
    // Arrange

    // Act
    const apps = await db.collection('apps').find().toArray();
    const app = apps.find((app) => app.appId.equals(FAKE_APP_ID));

    // Assert
    expect(apps.length).toBeGreaterThan(0);
    expect(app).toBeDefined();
  });

  it('should add a rule', async () => {
    // Arrange
    const rule = new RuleModel();
    const apps = await db.collection('apps').find().toArray();
    const app = apps.find((app) => app.appId.equals(FAKE_APP_ID));
    rule.appId = new ObjectId(app._id);
    rule.name = 'test';

    // Act
    const newRule = await rule.insert();

    // Assert
    expect(newRule).toBeDefined();
  });
});
