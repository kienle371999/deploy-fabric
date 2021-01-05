const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');
const should = chai.should();

chai.use(chaiHttp);


//product API test
describe('Product', () => {
    beforeEach(() => {

    });

    describe('GET /api/product', () => {
        it('it should get all product', () => {
            chai.request(server).get('/api/product').end((req, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                if (res.body.length === 0) {
                    res.body.should.be.a('array').that.is.empty;
                }
                else {
                    for (product in res.body) {
                        product.should.be.a('object')
                        product.should.have.property('name');
                        product.should.have.property('duration');
                    }
                }
            })
        })
    });
    describe('POST /api/product', () => {
        it('it should post new product to ledger', () => {
            let product = {
                id: 0,
                data: {
                    date: "05/12/2019",
                    duration: "10 months",
                    name: "PineApple",
                    place: "Hanoi"
                }
            }
            chai.request(server).post('/api/product').send(product).end((req, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('block_number');
                res.body.should.have.property('transaction_hash');
                res.body.should.have.property('status');
            })
        })
    });
    describe('GET /api/product/:id', () => {
        it('it should get product 0', () => {
            chai.request(server).get('/api/product/0').end((req, res) => {
                res.should.have.status(200);
                res.body.should.be('object');
                res.body.should.have.property('name');
                res.body.should.have.property('date');
                res.body.should.have.property('duration');
                res.body.should.have.property('place');
            })
        })
    })
});


//Identity API test
describe('Identity', () => {
    beforeEach(() => {

    });

    describe('GET /api/identity', () => {
        it('it should get all identity', () => {
            chai.request(server).get('/api/identity').end((req, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                if (res.body.length === 0) {
                    res.body.should.be.a('array').that.is.empty;
                }
                else {
                    for (identity in res.body) {
                        identity.should.be('object');
                        identity.should.have.property('username');
                        identity.should.have.property('fullname');
                        identity.should.have.property('email');
                        identity.should.have.property('publicKey');
                    }
                }
            })
        })
    });
    describe('POST /api/identity', () => {
        it('it should post new product to ledger', () => {
            let identity = {
                id: 1,
                data: {
                    username: "haipro287",
                    fullname: "Hai Trieu",
                    email: "haipro287@gmail.com",
                    publicKey: "12781771749147428415019249161"
                }
            }
            chai.request(server).post('/api/identity').send(identity).end((req, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('block_number');
                res.body.should.have.property('transaction_hash');
                res.body.should.have.property('status');
            })
        })
    });
    describe('GET /api/identity/:id', () => {
        it('it should get identity 0', () => {
            chai.request(server).get('/api/identity/0').end((req, res) => {
                res.should.have.status(200);
                res.body.should.be('object');
                res.body.should.have.property('username');
                res.body.should.have.property('fullname');
                res.body.should.have.property('email');
                res.body.should.have.property('publicKey');
            })
        })
    })
});