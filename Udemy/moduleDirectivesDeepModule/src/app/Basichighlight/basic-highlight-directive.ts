import { Directive, ElementRef, OnInit } from "@angular/core";

@Directive({
    selector:'[appbasichighlightdirective]'
})

export class basichighlightdirective implements OnInit{

    constructor(private element:ElementRef){

    }

    ngOnInit(){
        this.element.nativeElement.style.backgroundColor = 'green';
    }

}