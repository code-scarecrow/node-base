import { ArgumentsHost, HttpStatus, NotFoundException } from "@nestjs/common";
import { Response } from "express";
import { HttpArgumentsHost, RpcArgumentsHost } from "@nestjs/common/interfaces";
import { Logger } from "../../../src/logger";
import { ExceptionsFilter } from "../../../src/nest/errors/ExceptionsFilter";
import { mock, MockProxy } from "jest-mock-extended";
import { ErrorCodesMapperBase } from "../../../src/nest/errors/ErrorCodesMapperBase";
import { BaseError } from "../../../src/nest/errors/BaseError";
import { BaseComplexError } from "../../../src/nest/errors/BaseComplexError";

enum ErrorCodesEnum {
  ERROR_1 = "1",
  ERROR_2 = "2",
}

class EntityNotFound extends BaseError<ErrorCodesEnum> {
	constructor(entityName: string) {
		super(ErrorCodesEnum.ERROR_1, `${entityName} was not found`);
	}
}

class ComplexEntityNotFound extends BaseComplexError<ErrorCodesEnum> {
	constructor(entityName: string) {
		super(ErrorCodesEnum.ERROR_1, `${entityName} was not found`, ['test1']);
	}
}

describe("Service Transaction Test.", () => {
  let uut: ExceptionsFilter<ErrorCodesEnum>;
  let argumentsHost: MockProxy<ArgumentsHost>;
  let httpArgumentsHost: MockProxy<HttpArgumentsHost>;
  let rpcArgumentsHost: MockProxy<RpcArgumentsHost>;
  let response: MockProxy<Response>;
  let status: HttpStatus;
  let logger: MockProxy<Logger>;
  let responseBody: unknown;

  beforeEach(() => {
    //initialize test variables
    status = HttpStatus.I_AM_A_TEAPOT;
    responseBody = null;

    argumentsHost = mock<ArgumentsHost>();
    httpArgumentsHost = mock<HttpArgumentsHost>();
    response = mock<Response>();
    logger = mock<Logger>();
    logger.error.mockReturnValue(undefined);
    logger.info.mockReturnValue(undefined);

    argumentsHost.switchToHttp.mockReturnValue(httpArgumentsHost);
    argumentsHost.getType.mockReturnValue('');
    httpArgumentsHost.getResponse.mockReturnValue(response);
    response.status.mockImplementation((s) => {
        status = s;
        return response;
      });
    response.json.mockImplementation((s) => {
        responseBody = s;
        return response;
      });
    const errorMapper: MockProxy<ErrorCodesMapperBase<ErrorCodesEnum>> = mock();
    errorMapper.mapError.mockReturnValue(HttpStatus.NOT_FOUND);
    uut = new ExceptionsFilter(logger, errorMapper);
    rpcArgumentsHost = mock<RpcArgumentsHost>();
  });

  it("should map http status.", () => {
    //Arrange
    const err = new EntityNotFound("1");

    //Act
    uut.catch(err, argumentsHost);

    //Assert
    expect(status).toBe(HttpStatus.NOT_FOUND);
  });

  it("should return simple response body.", () => {
    //Arrange
    const err = new EntityNotFound("1");

    //Act
    uut.catch(err, argumentsHost);

    //Assert
    expect(responseBody).toEqual({
      code: ErrorCodesEnum.ERROR_1,
      message: `1 was not found`,
    });
  });

  it("should return complex response body.", () => {
    //Arrange
    const err = new ComplexEntityNotFound("1");

    //Act
    uut.catch(err, argumentsHost);

    //Assert
    expect(responseBody).toEqual({
      code: ErrorCodesEnum.ERROR_1,
      message: `1 was not found`,
      errors: ['test1']
    });
  });

  it("should return default response body.", () => {
    //Arrange
    const err = new Error("random error");

    //Act
    uut.catch(err, argumentsHost);

    //Assert
    expect(responseBody).toEqual({
      message: "internal server error",
    });
  });

  it("should return rpc status error.", () => {
    //Arrange
    const err = new Error("random error");
    argumentsHost.switchToRpc.mockReturnValue(rpcArgumentsHost);
    argumentsHost.getType.mockReturnValue("rmq");
    response.end.mockReturnValue({} as any);

    //Act
    uut.catch(err, argumentsHost);

    //Assert
    expect(responseBody).toEqual({
      message: "internal server error",
    });
  });

  it("should map http 404 status.", () => {
    //Arrange
    const err = new NotFoundException();

    //Act
    uut.catch(err, argumentsHost);

    //Assert
    expect(status).toBe(HttpStatus.NOT_FOUND);
  });
});
