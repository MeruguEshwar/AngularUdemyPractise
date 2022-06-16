import { Directive, Input } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, Validator } from '@angular/forms';

@Directive({
  selector: '[appEqualValidator]',
  providers:[{
    provide:NG_VALIDATORS,
    useExisting:EqualValidatorDirective,
    multi:true
  }]
})
export class EqualValidatorDirective implements Validator {
  @Input() appEqualValidator:string
  constructor() { }
  validate(control:AbstractControl):{[key:string]:any}| null{
    console.log('validator')
    const controlToCompare = control.parent.get(this.appEqualValidator);
    if(controlToCompare &&  controlToCompare.value!==control.value ){
      return {'notEqual':true}
    }
return null
  }

}
