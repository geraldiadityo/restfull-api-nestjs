import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { TestService } from './test.service';
import { TestModule } from './test.module';

describe('Address Controller)', () => {
  let app: INestApplication;
  let logger: Logger;
  let testService: TestService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, TestModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    logger = app.get(WINSTON_MODULE_PROVIDER);
    testService = app.get(TestService);
  });
  describe('POST /api/contacts/:contactId/address', () => {
    beforeEach(async () => {
      await testService.deleteAll();

      await testService.createUser();
      await testService.createContact();
    });

    it('should be rejected if request is invalid', async () => {
      const contact = await testService.getContact();
      const response = await request(app.getHttpServer())
        .post(`/api/contacts/${contact.id}/address`)
        .set('Authorization', 'test')
        .send({
          street: '',
          city: '',
          province: '',
          country: '',
          postal_code: '',
        });

      logger.info(response.body);

      expect(response.status).toBe(400);
      expect(response.body).toBeDefined();
    });
    it('should be able to create contact', async () => {
      const contact = await testService.getContact();
      const response = await request(app.getHttpServer())
        .post(`/api/contacts/${contact.id}/address`)
        .set('Authorization', 'test')
        .send({
          street: 'jalan test',
          city: 'kota test',
          province: 'provinsi test',
          country: 'negara test',
          postal_code: '11111',
        });

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data.id).toBeDefined();
      expect(response.body.data.street).toBe('jalan test');
      expect(response.body.data.city).toBe('kota test');
      expect(response.body.data.province).toBe('provinsi test');
      expect(response.body.data.country).toBe('negara test');
      expect(response.body.data.postal_code).toBe('11111');
    });
  });

  describe('GET /api/contacts/:contactId/address/:address_id', () => {
    beforeEach(async () => {
      await testService.deleteAll();

      await testService.createUser();
      await testService.createContact();
      await testService.createAddress();
    });

    it('should be rejected if contact is not found', async () => {
      const contact = await testService.getContact();
      const address = await testService.getAddress();
      const response = await request(app.getHttpServer())
        .get(`/api/contacts/${contact.id + 1}/address/${address.id}`)
        .set('Authorization', 'test');

      logger.info(response.body);

      expect(response.status).toBe(404);
      expect(response.body).toBeDefined();
    });

    it('should be rejected if address is not found', async () => {
      const contact = await testService.getContact();
      const address = await testService.getAddress();
      const response = await request(app.getHttpServer())
        .get(`/api/contacts/${contact.id}/address/${address.id + 1}`)
        .set('Authorization', 'test');

      logger.info(response.body);

      expect(response.status).toBe(404);
      expect(response.body).toBeDefined();
    });

    it('should be able to get address', async () => {
      const contact = await testService.getContact();
      const address = await testService.getAddress();
      const response = await request(app.getHttpServer())
        .get(`/api/contacts/${contact.id}/address/${address.id}`)
        .set('Authorization', 'test');

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data.id).toBeDefined();
      expect(response.body.data.street).toBe('jalan test');
      expect(response.body.data.city).toBe('kota test');
      expect(response.body.data.province).toBe('provinsi test');
      expect(response.body.data.country).toBe('negara test');
      expect(response.body.data.postal_code).toBe('1111');
    });
  });

  describe('PUT /api/contacts/:contactId/address/:address_id', () => {
    beforeEach(async () => {
      await testService.deleteAll();

      await testService.createUser();
      await testService.createContact();
      await testService.createAddress();
    });

    it('should be rejected if request is invalid', async () => {
      const address = await testService.getAddress();
      const contact = await testService.getContact();
      const response = await request(app.getHttpServer())
        .put(`/api/contacts/${contact.id}/address/${address.id}`)
        .set('Authorization', 'test')
        .send({
          street: '',
          city: '',
          province: '',
          country: '',
          postal_code: '',
        });

      logger.info(response.body);

      expect(response.status).toBe(400);
      expect(response.body).toBeDefined();
    });
    it('should be able to update contact', async () => {
      const address = await testService.getAddress();
      const contact = await testService.getContact();
      const response = await request(app.getHttpServer())
        .put(`/api/contacts/${contact.id}/address/${address.id}`)
        .set('Authorization', 'test')
        .send({
          street: 'jalan update',
          city: 'kota update',
          province: 'provinsi update',
          country: 'negara update',
          postal_code: '2222',
        });

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data.id).toBeDefined();
      expect(response.body.data.street).toBe('jalan update');
      expect(response.body.data.city).toBe('kota update');
      expect(response.body.data.province).toBe('provinsi update');
      expect(response.body.data.country).toBe('negara update');
      expect(response.body.data.postal_code).toBe('2222');
    });

    it('should be rejected if contact is not found!', async () => {
      const address = await testService.getAddress();
      const contact = await testService.getContact();
      const response = await request(app.getHttpServer())
        .put(`/api/contacts/${contact.id + 1}/address/${address.id}`)
        .set('Authorization', 'test')
        .send({
          street: 'test',
          city: 'test',
          province: 'test',
          country: 'testing',
          postal_code: '1111',
        });

      logger.info(response.body);

      expect(response.status).toBe(404);
      expect(response.body).toBeDefined();
    });
    it('should be rejected if address is not found!', async () => {
      const address = await testService.getAddress();
      const contact = await testService.getContact();
      const response = await request(app.getHttpServer())
        .put(`/api/contacts/${contact.id}/address/${address.id + 1}`)
        .set('Authorization', 'test')
        .send({
          street: 'test',
          city: 'test',
          province: 'test',
          country: 'testing',
          postal_code: '1111',
        });

      logger.info(response.body);

      expect(response.status).toBe(404);
      expect(response.body).toBeDefined();
    });
  });
  describe('DELETE /api/contacts/:contactId/address/:address_id', () => {
    beforeEach(async () => {
      await testService.deleteAll();

      await testService.createUser();
      await testService.createContact();
      await testService.createAddress();
    });

    it('should be able to delete address', async () => {
      const address = await testService.getAddress();
      const contact = await testService.getContact();
      const response = await request(app.getHttpServer())
        .delete(`/api/contacts/${contact.id}/address/${address.id}`)
        .set('Authorization', 'test');

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data).toBe(true);

      const addressResult = await testService.getAddress();

      expect(addressResult).toBeNull();
    });

    it('should be rejected if contact is not found!', async () => {
      const address = await testService.getAddress();
      const contact = await testService.getContact();
      const response = await request(app.getHttpServer())
        .delete(`/api/contacts/${contact.id + 1}/address/${address.id}`)
        .set('Authorization', 'test');

      logger.info(response.body);

      expect(response.status).toBe(404);
      expect(response.body).toBeDefined();
    });
    it('should be rejected if address is not found!', async () => {
      const address = await testService.getAddress();
      const contact = await testService.getContact();
      const response = await request(app.getHttpServer())
        .delete(`/api/contacts/${contact.id}/address/${address.id + 1}`)
        .set('Authorization', 'test');

      logger.info(response.body);

      expect(response.status).toBe(404);
      expect(response.body).toBeDefined();
    });
  });
});
