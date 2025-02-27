import { SafeMap } from "../../../../src/logger/core/utils/SafeMap";

describe('SafeMap Test', () => {
  it('should get exisisting result', async () => {
    //Arrage
    const uut = new SafeMap<string, string>([['test', 'test']]);

    //Act
    const res = uut.get('test');

    //Assert
    expect(res).toBe('test');
  });

  it('should throw exception as item is not found', async () => {
    //Arrage
    const uut = new SafeMap<string, string>([]);

    //Act
    const req = ()=>uut.get('test');

    //Assert
    expect(req).toThrowError();
  });
});
