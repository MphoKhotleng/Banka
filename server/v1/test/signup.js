import '@babel/polyfill';
import chaiHttp from 'chai-http';
import chai, { expect } from 'chai';
import dotenv from 'dotenv';
import path from 'path';
import dbConnection from '../config/database';

import app from '../app';

dotenv.config();

chai.use(chaiHttp);

describe('Testing User Controller', () => {
  before(async () => {
    await dbConnection.dbConnect('DELETE FROM users');
    await dbConnection
      .dbConnect('INSERT into users(email, firstName, lastName, password, type, isAdmin, verify, secretToken, avatar) values($1, $2, $3, $4, $5, $6, $7, $8, $9)',
        ['admin@banka.com', 'cavdy', 'ikenna', '$2a$10$CmmIst1.D3QjaWuafKbBaOuAFu0r9o7xxQY.0SMKiAN.h9z52a2y2', 'client', true, true, '', '']);
    await dbConnection
      .dbConnect('INSERT into users(email, firstName, lastName, password, type, isAdmin, verify, secretToken, avatar) values($1, $2, $3, $4, $5, $6, $7, $8, $9)',
        ['banka872@banka4.com', 'cavdy', 'isaiah', '$2a$10$CmmIst1.D3QjaWuafKbBaOuAFu0r9o7xxQY.0SMKiAN.h9z52a2y2', 'client', false, true, '', '']);
    await dbConnection
      .dbConnect('INSERT into users(email, firstName, lastName, password, type, isAdmin, verify, secretToken, avatar) values($1, $2, $3, $4, $5, $6, $7, $8, $9)',
        ['staff@banka.com', 'cavdy', 'ikenna', '$2a$10$CmmIst1.D3QjaWuafKbBaOuAFu0r9o7xxQY.0SMKiAN.h9z52a2y2', 'staff', false, true, '', '']);
    await dbConnection
      .dbConnect('INSERT into users(email, firstName, lastName, password, type, isAdmin, verify, secretToken, avatar) values($1, $2, $3, $4, $5, $6, $7, $8, $9)',
        ['deleteguy@banka.com', 'cavdy', 'ikenna', '$2a$10$CmmIst1.D3QjaWuafKbBaOuAFu0r9o7xxQY.0SMKiAN.h9z52a2y2', 'staff', true, true, '', '']);
    await dbConnection
      .dbConnect('INSERT into users(email, firstName, lastName, password, type, isAdmin, verify, secretToken, avatar) values($1, $2, $3, $4, $5, $6, $7, $8, $9)',
        ['deleteguy2@banka.com', 'cavdy', 'ikenna', '$2a$10$CmmIst1.D3QjaWuafKbBaOuAFu0r9o7xxQY.0SMKiAN.h9z52a2y2', 'client', true, true, '', '']);
    await dbConnection
      .dbConnect('INSERT into users(email, firstName, lastName, password, type, isAdmin, verify, secretToken, avatar) values($1, $2, $3, $4, $5, $6, $7, $8, $9)',
        ['deleteguy3@banka.com', 'cavdy', 'ikenna', '$2a$10$CmmIst1.D3QjaWuafKbBaOuAFu0r9o7xxQY.0SMKiAN.h9z52a2y2', 'client', false, true, '', '']);
    await dbConnection
      .dbConnect('INSERT into users(email, firstName, lastName, password, type, isAdmin, verify, secretToken, avatar) values($1, $2, $3, $4, $5, $6, $7, $8, $9)',
        ['unverifiedguy@banka.com', 'cavdy', 'ikenna', '$2a$10$CmmIst1.D3QjaWuafKbBaOuAFu0r9o7xxQY.0SMKiAN.h9z52a2y2', 'client', false, false, '', '']);
  });
  describe('Testing signup controller', () => {
    const signupUrl = '/api/v1/auth/signup';
    it(
      'should register a new user when all the parameters are given',
      async () => {
        const response = await chai.request(app)
          .post(signupUrl)
          .set('Content-Type', 'application/x-www-form-urlencoded')
          .field('firstName', 'Cavdy')
          .field('lastName', 'Isaiah')
          .field('email', 'banka874@banka4.com')
          .field('password', 'passworD4@')
          .attach('avatar', path.join(__dirname, 'img/preview.png'), 'preview.png');
        expect(response).to.be.an('object');
        expect(response).to.have.status(201);
        expect(response.body.data)
          .to.equal('Successfully signed up, check your email for verification');
      },
    );

    it(
      'should register a new user but not save avatar if invalid',
      async () => {
        const response = await chai.request(app)
          .post(signupUrl)
          .set('Content-Type', 'application/x-www-form-urlencoded')
          .field('firstName', 'Cavdy')
          .field('lastName', 'Isaiah')
          .field('email', 'banka875@banka4.com')
          .field('password', 'passworD4@')
          .attach('avatar', path.join(__dirname, 'img/animated.gif'), 'animated.gif');
        expect(response).to.be.an('object');
        expect(response).to.have.status(201);
        expect(response.body.data)
          .to.equal('Successfully signed up, check your email for verification');
      },
    );

    it(
      'should not register a user when the email already exist',
      async () => {
        const response = await chai.request(app)
          .post(signupUrl)
          .set('Content-Type', 'application/x-www-form-urlencoded')
          .field('firstName', 'Cavdy')
          .field('lastName', 'Isaiah')
          .field('email', 'banka874@banka4.com')
          .field('password', 'passworD4@')
          .attach('avatar', path.join(__dirname, 'img/preview.png'), 'preview.png');
        expect(response).to.be.an('object');
        expect(response).to.have.status(409);
        expect(response.body.data).to.equal('email already exist');
      },
    );

    it(
      'should not create a staff when the email already exist',
      async () => {
        const signinUrl = '/api/v1/auth/signin';
        const response = await chai.request(app)
          .post(signinUrl)
          .send({
            email: 'admin@banka.com',
            password: 'passworD4@',
          });
        const { token } = response.body.data;
        const res = await chai.request(app)
          .post('/api/v1/users/addstaff')
          .set('Authorization', `Bearer ${token}`)
          .send({
            firstName: 'cavdy',
            lastName: 'isaiah',
            email: 'banka874@banka4.com',
            password: 'passworD4@',
            type: 'staff',
            isAdmin: false,
          });
        expect(res).to.be.an('object');
        expect(res.body.status).to.equal(409);
        expect(res.body.data).to.equal('email already exist');
      },
    );

    it(
      'should not register when all fields are missing',
      async () => {
        const response = await chai.request(app)
          .post(signupUrl)
          .send();
        expect(response).to.be.an('object');
        expect(response).to.have.status(422);
        expect(response.body.data[0]).to.equal('Email is required');
        expect(response.body.data[1]).to.equal('Firstname required');
        expect(response.body.data[2]).to.equal('Lastname required');
        expect(response.body.data[3])
          .to.equal('Password should contain atleast 8 characters, 1 uppercase letter, 1 lowercase letter, 1 number and 1 symbol or character');
      },
    );

    it(
      'should not create staff when all fields are missing',
      async () => {
        const signinUrl = '/api/v1/auth/signin';
        const response = await chai.request(app)
          .post(signinUrl)
          .send({
            email: 'admin@banka.com',
            password: 'passworD4@',
          });
        const { token } = response.body.data;
        const res = await chai.request(app)
          .post('/api/v1/users/addstaff')
          .set('Authorization', `Bearer ${token}`)
          .send({
            type: 'staff',
            isAdmin: false,
          });
        expect(res).to.be.an('object');
        expect(res.body.status).to.equal(422);
        expect(res.body.data[0]).to.equal('Email is required');
        expect(res.body.data[1]).to.equal('Firstname required');
        expect(res.body.data[2]).to.equal('Lastname required');
        expect(res.body.data[3])
          .to.equal('Password should contain atleast 8 characters, 1 uppercase letter, 1 lowercase letter, 1 number and 1 symbol or character');
      },
    );

    it(
      'should not register a user when the email is missing',
      async () => {
        const response = await chai.request(app)
          .post(signupUrl)
          .send({
            firstName: 'cavdy',
            lastName: 'isaiah',
            password: 'passworD4@',
          });
        expect(response).to.be.an('object');
        expect(response).to.have.status(422);
        expect(response.body.data[0]).to.equal('Email is required');
      },
    );

    it(
      'should not register a user when the first name is missing',
      async () => {
        const response = await chai.request(app)
          .post(signupUrl)
          .send({
            lastName: 'isaiah',
            email: 'banka873@banka4.com',
            password: 'passworD4@',
          });
        expect(response).to.be.an('object');
        expect(response).to.have.status(422);
        expect(response.body.data[0]).to.equal('Firstname required');
      },
    );

    it(
      'should not register a user when the last name is missing',
      async () => {
        const response = await chai.request(app)
          .post(signupUrl)
          .send({
            firstName: 'cavdy',
            email: 'banka873@banka4.com',
            password: 'passworD4@',
          });
        expect(response).to.be.an('object');
        expect(response).to.have.status(422);
        expect(response.body.data[0]).to.equal('Lastname required');
      },
    );

    it(
      'should not register a user when the password is missing',
      async () => {
        const response = await chai.request(app)
          .post(signupUrl)
          .send({
            firstName: 'cavdy',
            lastName: 'isaiah',
            email: 'banka873@banka4.com',
          });
        expect(response).to.be.an('object');
        expect(response).to.have.status(422);
        expect(response.body.data[0])
          .to.equal('Password should contain atleast 8 characters, 1 uppercase letter, 1 lowercase letter, 1 number and 1 symbol or character');
      },
    );
    it(
      'should not register a user when the password do not meet requirement',
      async () => {
        const response = await chai.request(app)
          .post(signupUrl)
          .send({
            firstName: 'cavdy',
            lastName: 'isaiah',
            email: 'banka873@banka4.com',
            password: 'passworD4',
          });
        expect(response).to.be.an('object');
        expect(response).to.have.status(422);
        expect(response.body.data[0])
          .to.equal('Password should contain atleast 8 characters, 1 uppercase letter, 1 lowercase letter, 1 number and 1 symbol or character');
      },
    );

    it(
      'only admin can create staffs',
      async () => {
        const signinUrl = '/api/v1/auth/signin';
        const response = await chai.request(app)
          .post(signinUrl)
          .send({
            email: 'admin@banka.com',
            password: 'passworD4@',
          });
        const { token } = response.body.data;
        const res = await chai.request(app)
          .post('/api/v1/users/addstaff')
          .set('Authorization', `Bearer ${token}`)
          .send({
            firstName: 'cavdy',
            lastName: 'isaiah',
            email: 'staff25@banka.com',
            password: 'passworD4@',
          });
        expect(res).to.be.an('object');
        expect(res).to.have.status(201);
        expect(res.body.data).to.have.property('id');
        expect(res.body.data).to.have.property('firstName');
        expect(res.body.data).to.have.property('lastName');
        expect(res.body.data).to.have.property('email');
        expect(res.body.data).to.have.property('token');
      },
    );

    it(
      'should not create staff if not admin',
      async () => {
        const signinUrl = '/api/v1/auth/signin';
        const response = await chai.request(app)
          .post(signinUrl)
          .send({
            email: 'banka872@banka4.com',
            password: 'passworD4@',
          });
        const { token } = response.body.data;
        const res = await chai.request(app)
          .post('/api/v1/users/addstaff')
          .set('Authorization', `Bearer ${token}`)
          .send({
            firstName: 'cavdy',
            lastName: 'isaiah',
            email: 'staff8@banka.com',
            password: 'passworD4@',
          });
        expect(res).to.be.an('object');
        expect(res).to.have.status(401);
        expect(res.body.data).to.equal('you must be an admin to create staffs');
      },
    );
  });
});
