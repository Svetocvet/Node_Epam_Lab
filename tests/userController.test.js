const app = require('../index').app;
const request = require('supertest');
const assert = require('assert');

const testUser = {
    email: 'kyryloo@gmail.coffee',
    password: 've518dl3',
    role: 'SHIPPER',
};

let testToken = 'test';
let testLoadID = '';

const testLoad = {
    name: 'Moving sofa',
    payload: 100,
    pickup_address: 'Flat 25, 12/F, Acacia Building 150 Kennedy Road',
    delivery_address: 'Sr. Rodrigo Domínguez Av. Bellavista N° 185',
    dimensions: {
        width: 44,
        length: 32,
        height: 1000,
    },
};


describe('User Controller Requests', function() {
    describe('/api/auth/', function() {
        it('/register should return status code 400 if we doesnt send anything', function(done) {
            request(app)
                .post('/api/auth/register')
                .send({})
                .expect(400)
                .expect((res) => {
                    assert.equal(res.body.message, 'Invalid credentials');
                })
                .end(function(err, res) {
                    if (err) done(err);
                    done();
                });
        });

        it(`/register should return status code 400 if we doesn't send some body fields`, function(done) {
            request(app)
                .post('/api/auth/register')
                .send({
                    email: 'kyrylo@gmail.com',
                    password: 've518dl3',
                })
                .expect(400)
                .expect((res) => {
                    assert.equal(res.body.message, 'Invalid credentials');
                })
                .end(function(err, res) {
                    if (err) done(err);
                    done();
                });
        });

        it(`/register should return status code 200 if user registered successfully`, function(done) {
            request(app)
                .post('/api/auth/register')
                .send(testUser) // x-www-form-urlencoded upload
                .expect(200)
                .expect((res) => {
                    assert.equal(res.body.message, 'Profile created successfully');
                })
                .end((err, res) => {
                    if (err) {
                        console.error(res.error);
                    }
                    done(err);
                });
        });

        it(`/login should return status code 200 if user login successfully`, function(done) {
            request(app)
                .post('/api/auth/login')
                .send(testUser) // x-www-form-urlencoded upload
                .expect(200)
                .expect((res) => {
                    assert.ok(res.body.jwt_token);
                })
                .end((err, res) => {
                    testToken = res.body.jwt_token;
                    if (err) {
                        console.error(res.error);
                    }
                    done(err);
                });
        });
    });

    describe('/api/users/', function() {
        it('/me should return status code 400 if we doesnt send anything', function(done) {
            request(app)
                .get('/api/users/me')
                .send({})
                .expect(400)
                .end(function(err, res) {
                    if (err) done(err);
                    done();
                });
        });

        it(`/me should return status code 400 if we doesn't send some body fields`, function(done) {
            request(app)
                .get('/api/users/me')
                .send({
                    email: 'kyrylo@gmail.com',
                    password: 've518dl3',
                })
                .expect(400)
                .end(function(err, res) {
                    if (err) done(err);
                    done();
                });
        });

        it(`/me should return user profiles info`, function(done) {
            request(app)
                .get('/api/users/me')
                .set('Authorization', 'bearer ' + testToken)
                .send(testUser) // x-www-form-urlencoded upload
                .expect(200)
                .expect((res) => {
                    assert.ok(res.body.user);
                    assert.ok(res.body.user._id);
                    assert.ok(res.body.user.email);
                    assert.ok(res.body.user.created_date);
                    assert.ok(res.body.user.imageUrl);
                })
                .end((err, res) => {
                    if (err) {
                        console.error(res.error);
                    }
                    done(err);
                });
        });
    });
    describe('/api/loads/', function() {
        it(`should return status code 200 if new load created successfully`, function(done) {
            request(app)
                .post('/api/loads')
                .set('Authorization', 'bearer ' + testToken)
                .send(testLoad) // x-www-form-urlencoded upload
                .expect(200)
                .expect((res) => {
                    assert.equal(res.body.message, 'Load created successfully');
                })
                .end((err, res) => {
                    if (err) {
                        console.error(res.error);
                    }
                    done(err);
                });
        });

        it(`should return all shipper's loads`, function(done) {
            request(app)
                .get('/api/loads')
                .set('Authorization', 'bearer ' + testToken)
                .expect(200)
                .expect((res) => {
                    assert.ok(res.body.loads);
                })
                .end((err, res) => {
                    testLoadID = res.body.loads[0]._id;
                    if (err) {
                        console.error(res.error);
                    }
                    done(err);
                });
        });
        it(`/:id should return one load by id`, function(done) {
            request(app)
                .get(`/api/loads/${testLoadID}`)
                .set('Authorization', 'bearer ' + testToken)
                .expect(200)
                .expect((res) => {
                    assert.ok(res.body.load);
                })
                .end((err, res) => {
                    if (err) {
                        console.error(res.error);
                    }
                    done(err);
                });
        });
        it(`/:id should update shipper's load by id`, function(done) {
            request(app)
                .put(`/api/loads/${testLoadID}`)
                .send({name: 'just new load name'})
                .set('Authorization', 'bearer ' + testToken)
                .expect(200)
                .expect((res) => {
                    assert.equal(res.body.message, 'Load details changed successfully');
                })
                .end((err, res) => {
                    if (err) {
                        console.error(res.error);
                    }
                    done(err);
                });
        });

        it(`/:id/post should post shipper's load by id`, function(done) {
            request(app)
                .post(`/api/loads/${testLoadID}/post`)
                .set('Authorization', 'bearer ' + testToken)
                .expect(400)
                .end((err, res) => {
                    if (err) {
                        console.error(res.error);
                    }
                    done(err);
                });
        });

        it(`/:id should delete shipper's load by id`, function(done) {
            request(app)
                .delete(`/api/loads/${testLoadID}/`)
                .set('Authorization', 'bearer ' + testToken)
                .expect(200)
                .end((err, res) => {
                    if (err) {
                        console.error(res.error);
                    }
                    done(err);
                });
        });
    });
    describe('/api/users/', function() {
        it(`/me/password should return status code 200 if user password changed successfully`, function(done) {
            request(app)
                .patch('/api/users/me/password')
                .set('Authorization', 'bearer ' + testToken)
                .send({
                    oldPassword: testUser.password,
                    newPassword: '123455667',
                }) // x-www-form-urlencoded upload
                .expect(200)
                .expect((res) => {
                    assert.equal(res.body.message, 'Password changed successfully');
                })
                .end((err, res) => {
                    if (err) {
                        console.error(res.error);
                    }
                    done(err);
                });
        });

        it(`/forgot_password should return status code 200 if user password changed successfully and was sand to email`, function(done) {
            request(app)
                .post('/api/auth/forgot_password')
                .send({
                    email: testUser.email,
                }) // x-www-form-urlencoded upload
                .expect(200)
                .expect((res) => {
                    assert.equal(res.body.message, 'New password sent to your email address');
                })
                .end((err, res) => {
                    if (err) {
                        console.error(res.error);
                    }
                    done(err);
                });
        });

        it(`/me should return status code 400 cause of missing auth token`, function(done) {
            request(app)
                .delete('/api/users/me')
                .send(testUser) // x-www-form-urlencoded upload
                .expect(400)
                .expect((res) => {
                    assert.equal(res.body.message, 'No authorization header found');
                })
                .end((err, res) => {
                    if (err) {
                        console.error(res.error);
                    }
                    done(err);
                });
        });

        it(`/me should return status code 200 if user deleted successfully`, function(done) {
            request(app)
                .delete('/api/users/me')
                .set('Authorization', 'bearer ' + testToken)
                .send(testUser) // x-www-form-urlencoded upload
                .expect(200)
                .expect((res) => {
                    assert.equal(res.body.message, 'Profile deleted successfully');
                })
                .end((err, res) => {
                    if (err) {
                        console.error(res.error);
                    }
                    done(err);
                });
        });
    });
});
