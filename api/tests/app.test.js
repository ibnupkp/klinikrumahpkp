const request = require('supertest');
const { execSync } = require('child_process');
const path = require('path');

const app = require('../src/app');

beforeAll(() => {
  const cwd = path.join(__dirname, '..');
  execSync('npx prisma migrate deploy', { cwd });
  execSync('node prisma/seed.js', { cwd });
});

describe('API', () => {
  it('lists prototypes', async () => {
    const res = await request(app).get('/designs/prototypes');
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('creates a project', async () => {
    const payload = { ownerName: 'A', address: 'B', luasM2: 50, type: 'custom' };
    const res = await request(app).post('/projects').send(payload);
    expect(res.status).toBe(201);
    expect(res.body.id).toBeDefined();
  });

  it('creates a consult ticket', async () => {
    const project = await request(app)
      .post('/projects')
      .send({ ownerName: 'C', address: 'D', luasM2: 60, type: 'prototype' });
    const res = await request(app)
      .post('/consult')
      .send({ projectId: project.body.id, mode: 'gratis' });
    expect(res.status).toBe(201);
    expect(res.body.id).toBeDefined();
  });
});
