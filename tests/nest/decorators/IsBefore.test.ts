import { Validator } from 'class-validator';
import { IsBefore } from '../../../src/nest/decorators';

const validator = new Validator();

describe('IsBefore decorator test', () => {

  class TestClas {
    @IsBefore('finishDate')
    public startDate: string ;

    public finishDate: string | undefined;  
    
    constructor(start:string, finish:string | undefined){
      this.startDate = start;
      this.finishDate = finish;
    }
  }

  it('should say validation is correct', async () => {
    //Arrage
    const model = new TestClas('2023-1-1', '2024-1-1');

    //Act
    const res = await validator.validate(model)

    //Assert
    expect(res.length).toBe(0);
  });

  it('should return correct error msg', async () => {
    //Arrage
    const model = new TestClas('2024-1-1', '2023-1-1');

    //Act
    const res = await validator.validate(model)

    //Assert
    expect(res.length).toBe(1);
    expect(res[0]!.constraints!['isBefore']).toBe("The 'startDate' must be before the 'finishDate'");
  });

  it('should return missing propperty error msg', async () => {
    //Arrage
    const model = new TestClas('2024-1-1', undefined);

    //Act
    const res = await validator.validate(model)

    //Assert
    expect(res.length).toBe(1);
    expect(res[0]!.constraints!['isBefore']).toBe("Propperty 'finishDate' not found.");
  });
});
