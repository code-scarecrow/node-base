import { HttpStatus } from '@nestjs/common';
import { Request } from 'express';
import { mock } from 'jest-mock-extended';
import { parseNestRequest, parseNestResponse } from '../../../src/logger/nest';

describe('Parser Test', () => {
  it('should parse nest request to correct format', async () => {
    //Arrage
    const req = mock<Request>();
    req.method = 'GET';
    req.headers = { host: 'test' };
    req.url = 'https://test/test';
    req.body = { test: 'test' };

    const expectedRes = {
      method: 'GET',
      domain: 'test',
      endpoint: 'https://test/test',
      headers: { host: 'test' },
      body: { test: 'test' },
    };

    //Act
    const res = parseNestRequest(req);

    //Assert
    expect(res).toEqual(expectedRes);
  });

  it('should parse nest request to correct format without host', async () => {
    //Arrage
    const req = mock<Request>();
    req.method = 'GET';
    req.headers = {};
    req.url = 'https://test/test';
    req.body = { test: 'test' };

    const expectedRes = {
      method: 'GET',
      domain: null,
      endpoint: 'https://test/test',
      headers: {},
      body: { test: 'test' },
    };

    //Act
    const res = parseNestRequest(req);

    //Assert
    expect(res).toEqual(expectedRes);
  });

  it('should parse nest response to correct format', async () => {
    //Arrage
    const expectedRes = {
      statusCode: HttpStatus.OK,
      body: { test: 'test' },
    };

    //Act
    const res = parseNestResponse(HttpStatus.OK, { test: 'test' });

    //Assert
    expect(res).toEqual(expectedRes);
  });
});
