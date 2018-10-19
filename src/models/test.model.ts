import { input, model, output, prop } from '../decorators/yos-model.decorator';

@model({recordTypeName: 'testModel'})
export class Test {

  @prop({type: String})
  xxx: String = 'bla';

  @input()
  public input(obj: any) {
    return Object.assign({input: 'input'}, obj);
  }

  @output()
  public output(obj: any){
    return Object.assign({output: 'output'}, obj);
  }
}
