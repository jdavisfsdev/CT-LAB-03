require('dotenv').config();
const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const Car = require('../lib/models/Car');
const Headband = require('../lib/models/Headband');
const { head } = require('../lib/app');

describe.skip('car routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  it('POST to create a car', async () => {
    const res = await request(app)
      .post('/api/v1/cars')
      .send({ make: 'Toyota', model: 'Prius', year: 2011 });
    
    expect(res.body).toEqual({
      id: '1',
      make: 'Toyota',
      model: 'Prius',
      year: '2011'
    });
  });

  it('GET car by ID', async () => {
    const car = await Car.insert({
      make: 'Ford',
      model: 'Focus',
      year: 1994
    });

    const res = await request(app)
      .get(`/api/v1/cars/${car.id}`);
    console.log(car);
    expect(res.body).toEqual(car);
  });

  it('GET ALL cars', async () => {
    const prius = await Car.insert({
      make: 'Toyota',
      model: 'Prius',
      year: 2011
    });
    
    const malibu = await Car.insert({
      make: 'Chevy',
      model: 'Malibu',
      year: 2019
    });

    const res = await request(app)
      .get('/api/v1/cars');
    expect(res.body).toEqual([prius, malibu]);
  });

  it('UPDATE car by ID', async () => {
    
    const res = await request(app)
      .post('/api/v1/cars')
      .send({ make: 'Toyota', model: 'Prius', year: 2011 });
    
    const prius = await Car.updateItem(res.body.id, { make: 'toyota', model: 'prius', year: 2000 });  

    const secondRes = await request(app)
      .get(`/api/v1/cars/${prius.id}`);
    expect(secondRes.body).toEqual(prius);
  });

  it('DELETE car by ID', async () => {
    const prius = await request(app)
      .post('/api/v1/cars')
      .send({ make: 'Toyota', model: 'Prius', year: 2011 });

    const res = await Car.deleteItem(prius.body.id);
    request(app)
      .delete(`/api/v1/cars/${prius.id}`);
    expect(res.body).toEqual(prius.id);
  });
});

describe('headband routes', () => {
  beforeEach(() => {
    return setup(pool);
  });
  
  it('POST headband', async () => {
    const res = await request(app)
      .post('/api/v1/headbands')
      .send({ color: 'red', size: 'large' });

    expect(res.body).toEqual({
      id: '1',
      color: 'red',
      size: 'large'
    });
  });

  it('GET headband by ID', async () => {
    const firstBand = await Headband.insert({
      color: 'blue',
      size: 'teeny weeny'
    });

    const res = await request(app)
      .get(`/api/v1/headbands/${firstBand.id}`);

    expect(res.body).toEqual(firstBand);
  });

  it('GET all headbands', async () => {
    const yellow = await Headband.insert({
      color: 'yellow',
      size: 'super large'
    });

    const pink = await Headband.insert({
      color: 'pink',
      size: 'way medium'
    });

    const res = await request(app)
      .get('/api/v1/headbands');
    
    expect(res.body).toEqual([yellow, pink]);
  });

  it('UPDATE headband', async () => {
    const headband = await request(app)
      .post('/api/v1/headbands')
      .send({
        color: 'cyan',
        size: 'large'
      });

    const updatedHeadband = await Headband.updateItem(headband.body.id, {
      color: 'cyan',
      size: 'LARGER'
    });

    const res = await request(app)
      .get(`/api/v1/headbands/${updatedHeadband.id}`);

    expect(res.body).toEqual(updatedHeadband);
  });

  it('DELETE headband by ID', async () => {
    const headband = await request(app)
      .post('/api/v1/headbands')
      .send({
        color: 'cyan',
        size: 'large'
      });
    
    const res = await Headband.deleteItem(headband.body.id);
    request(app)
      .delete(`/api/v1/headbands/${headband.id}`);
    expect(res.body).toEqual(headband.id);

  });

});
