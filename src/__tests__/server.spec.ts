import express from 'express';
import request from 'supertest';
import { app } from '../server'

/* 
 * Testing get all users endpoint
*/

describe("Test users endpoint", () => {
  test("It should response the GET method with an array of all users", () => {
    request(app)
        .get('/users')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
            if (err) throw err;
        });
  });
});