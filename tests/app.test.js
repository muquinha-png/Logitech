const request = require('supertest');
const app = require('../server.js');

describe('Testes da API - Motoristas', () => {

    // 1. GET - Buscar motorista existente

    describe('GET /motoristas/:id', () => {

        test('Deve retornar 200 ao buscar um motorista existente', async () => {
            const res = await request(app)
                .get('/motoristas/1');

            expect(res.statusCode).toBe(200);

            expect(res.body).toHaveProperty('data');
            expect(res.body.data).toHaveProperty('id', 1);
        });



        // 2. GET - Buscar motorista inexistente
        test('Deve retornar 404 ao buscar um motorista inexistente', async () => {
            const res = await request(app)
                .get('/motoristas/9999');

            expect(res.statusCode).toBe(404);
            expect(res.body).toHaveProperty('message');
        });

    });


    // 3. DELETE - Excluir motorista
    describe('DELETE /motoristas/:id', () => {

        test('Deve retornar um status válido ao tentar excluir um motorista', async () => {
            const res = await request(app)
                .delete('/motoristas/1');

            expect([200, 204, 409]).toContain(res.statusCode);
        });

    });


    // 4. POST - Cadastro inválido
    describe('POST /motoristas', () => {

        test('Deve rejeitar cadastro sem nome, CPF e telefone', async () => {
            const res = await request(app)
                .post('/motoristas')
                .send({
                    nome: '',
                    cpf: '',
                    telefone: ''
                });

            expect(res.statusCode).toBe(400);
            expect(res.body).toHaveProperty('message');
        });

    });

});