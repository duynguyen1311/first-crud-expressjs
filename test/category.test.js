const request = require('supertest');
const router = require('../src/routes/route');

describe('Category', () => {
    it('should return all categories', async () => {
        const res = await request(router)
            .get('/api/categories')
            .expect(200);
        expect(res.body).to.be.an('array');
    });

    it('should create a new category', async () => {
        const res = await request(router)
            .post('/api/categories')
            .send({ name: 'New Category' })
            .expect(201);
        expect(res.body).to.have.property('id');
        expect(res.body).to.have.property('name', 'New Category');
    });

    it('should return 409 if category already exists', async () => {
        await request(router)
            .post('/api/categories')
            .send({ name: 'Existing Category' })
            .expect(201);

        await request(router)
            .post('/api/categories')
            .send({ name: 'Existing Category' })
            .expect(409);
    });
});