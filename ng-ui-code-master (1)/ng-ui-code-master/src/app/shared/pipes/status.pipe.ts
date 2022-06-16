import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'status' })
export class DisplayStatus implements PipeTransform {
    transform(value: number): any {     
        switch (+value) {
            case 1: {
                return 'Active'
            }
            case 0: {
                return 'Inactive'
            }
            default: {
                return value;
            }
        }     
    }
}
