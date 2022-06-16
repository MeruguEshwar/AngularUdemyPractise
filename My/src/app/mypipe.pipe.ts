import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'mypipe'
})
export class MypipePipe implements PipeTransform {

  transform(value: any,args?: any): any {
    
    if(args==0)
    {
      value.sort();
    }
    if(args==1)
    {
      value.sort();
      value.reverse();
    }
    return value;
  }

}
