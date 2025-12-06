import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { MongooseModule } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { getConnectionToken } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { getQueueToken } from '@nestjs/bull';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let mongod: MongoMemoryServer;
  let authToken: string;
  let userId: string;
  let contactId: string;
  let invoiceId: string;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();

    process.env.MONGO_URI = uri;

    const moduleFixtureWithEnv: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(getQueueToken('reminders'))
      .useValue({
        add: jest.fn(),
        process: jest.fn(),
      })
      .compile();

    app = moduleFixtureWithEnv.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
    await mongod.stop();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  // 1. Auth Flow
  let requestId: string;

  it('/auth/request-otp (POST)', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/v1/auth/request-otp')
      .send({ phone: '+1234567890' })
      .expect(201);

    expect(response.body).toHaveProperty('requestId');
    requestId = response.body.requestId;
  });

  it('/auth/verify-otp (POST)', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/v1/auth/verify-otp')
      .send({ phone: '+1234567890', otp: '123456', requestId }) // Stub OTP is 123456
      .expect(201);

    expect(response.body).toHaveProperty('access_token');
    authToken = response.body.access_token;
  });

  // 2. Contact Flow
  it('/contacts (POST)', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/v1/contacts')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ name: 'Test Contact', phone: '+9988776655' })
      .expect(201);

    expect(response.body).toHaveProperty('_id');
    contactId = response.body._id;
  });

  // 3. Invoice Flow
  it('/invoices (POST)', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/v1/invoices')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        buyerId: contactId,
        items: [{ description: 'Item 1', quantity: 1, rate: 100 }],
        dueDays: 30,
      })
      .expect(201);

    expect(response.body).toHaveProperty('_id');
    expect(response.body.outstandingAmount).toBe(100);
    invoiceId = response.body._id;
  });

  // 4. Payment Flow (Partial)
  it('/invoices/:id/payments (POST) - Partial', async () => {
    const response = await request(app.getHttpServer())
      .post(`/api/v1/invoices/${invoiceId}/payments`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({ amount: 50, mode: 'cash', date: new Date().toISOString() })
      .expect(201);

    expect(response.body.outstandingAmount).toBe(50);
    expect(response.body.status).toBe('partially_paid');
  });

  // 5. Payment Flow (Full)
  it('/invoices/:id/payments (POST) - Full', async () => {
    const response = await request(app.getHttpServer())
      .post(`/api/v1/invoices/${invoiceId}/payments`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({ amount: 50, mode: 'cash', date: new Date().toISOString() })
      .expect(201);

    expect(response.body.outstandingAmount).toBe(0);
    expect(response.body.status).toBe('paid');
  });

  // 6. Trust Job Flow
  it('/jobs/compute-trust (POST)', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/v1/jobs/compute-trust')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(201);

    expect(response.body.processed).toBeGreaterThan(0);
    expect(response.body.details[0].trustScore).toBeDefined();
  });
});
