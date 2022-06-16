import { Pipe, PipeTransform } from '@angular/core';


@Pipe({
  name: 'myPipe'
})
export class MyPipePipe implements PipeTransform {

  // transform(value: number): number {
  //   return Math.sqrt(value);
  // }

  transform(href: any) {
    if(href.split())
    {
      if(href.startsWith("http://") || href.startsWith("https://") && href.endsWith(".com"))
      {
        return href;
      }
      else if(href.startsWith("http://") || href.startsWith("https://"))
      {
        return href +".com";
      }
      else if(href.endsWith(".com"))
      {
        return "http://" + href
      }
      else
      {
        return "http://" + href +".com";
      }
    }
    
  }
  
}
