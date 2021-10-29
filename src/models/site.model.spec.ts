import { con, connectToMongoMemory, db, FAKE_APP_ID, mongoServer, prepareApp, prepareDecoDb } from './_testing/mongo-jest-utils';
import { ThreeSiteModel } from './site.model';
import { ObjectId, Query } from '@bim/deco-api';

describe('site model', () => {
  describe('inserts', () => {
    beforeAll(async () => {
      await connectToMongoMemory();
      await prepareDecoDb();
      await prepareApp();
    });

    afterAll(async () => {
      await con?.close(true);
      await mongoServer?.stop();
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

    it('add a site', async () => {
      // Arrange
      const site = new ThreeSiteModel();
      const apps = await db.collection('apps').find().toArray();
      const app = apps.find((app) => app.appId.equals(FAKE_APP_ID));
      site.appId = new ObjectId(app._id);
      site.name = 'test';

      // Act
      const newSite = await site.insert();

      // Assert
      expect(newSite).toBeDefined();
    });
  });
});
