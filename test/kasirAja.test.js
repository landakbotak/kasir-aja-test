import request from 'supertest';
import { expect as _expect } from 'chai';
const expect = _expect;

const BASE_URL = 'https://kasir-api.belajarqa.com';
let token;

// Fungsi untuk mendapatkan token auth
const getAuthToken = async () => {
    const response1 = await request(BASE_URL)
        .post('/registration')
        .send({ name: 'TOKO A', email:'sample1@gmail.com', password:'123456' });

    console.log('Response Status:', response1.status);
    console.log('Response Body:', response1.body);  
    
    const response = await request(BASE_URL)
        .post('/authentications')
        .send({ email:'sample1@gmail.com', password:'123456' });

    console.log('Response Status:', response.status);
    console.log('Response Body:', response.body);  
    console.log('Token:', response.body.data.accessToken);  

    return response.body.data.accessToken; // Mengambil access token
};

// Sebelum semua test, kita ambil token
before(async function() {
    this.timeout(5000); // Increase timeout to 5000 ms
    token = await getAuthToken();
});

describe('API Kontrak Kasir AJA', () => {
    // 1. Create
    it('should create a new user', async () => {
        const response = await request(BASE_URL)
            .post('/users')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'kasir-serbaguna',
                email: 'user@example.com',
                password: 'jiasda2321@'
            });

        expect(response.status).to.equal(201);
        expect(response.body.data).to.have.property('userId');
    });

    // 2. Read
    it('should retrieve a user detail by ID', async () => {
        const uid = 'bfc984db-4548-4a88-9c2f-4185259e538f';

        const response = await request(BASE_URL)
            .get(`/users/${uid}`)
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).to.equal(200);
        expect(response.body.data.user).to.have.property('id', uid);
    });

    // 3. Update
    it('should update an user', async () => {
        const uid = 'bfc984db-4548-4a88-9c2f-4185259e538f';

        const response = await request(BASE_URL)
            .put(`/users/${uid}`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'update-user',
                email: 'sample1@gmail.com',
            });

        expect(response.status).to.equal(200);
        expect(response.body.data).to.have.property('name', 'update-user');
    });

    // 4. Delete
    it('should delete an user', async () => {
        const uid = 'bfc984db-4548-4a88-9c2f-4185259e538f';

        const response = await request(BASE_URL)
            .delete(`/users/${uid}`)
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).to.equal(200);
    });
});
