import { safeGetConfig } from "../../../src/nest/config";

describe('safeGetConfig Test', () => {
	it('should return .env', () => {
		//Arrange
		process.env['TEST'] = 'TEST';

		//Act
		const res = safeGetConfig('TEST');

		//Assert
		expect(res).toBe('TEST');
	});

	it('should throw clear message exception', () => {
		//Act
		const res = (): string => safeGetConfig('JEST');

		//Assert
		expect(res).toThrowError('JEST is required in the environment variables');
	});
});