import { RabbitMessage } from '../../src';

describe('Logger Test', () => {

  it('should write correct message', async () => {
    //Arrage
    const data = {test:'test'}

    //Act
    const uut = new RabbitMessage(data,'test123','testapp');

    //Assert
    expect(uut.data).toBe(data);
    expect(uut.traceId).toBe('test123');
    expect(uut.app).toBe('testapp');
  });
});
