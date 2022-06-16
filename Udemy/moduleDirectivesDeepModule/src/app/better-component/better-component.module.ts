import { Directive,ElementRef,HostBinding,HostListener,Input,OnInit, Renderer2 } from '@angular/core';


@Directive({
  selector:'[appBetterComponentModule]'
})

export class BetterComponentModule implements OnInit{
  @Input() defaultColor: string = 'transparent';
  @Input('appBetterComponentModule') highlateColor: string = 'blue';
  @HostBinding('style.backgroundColor') backgroundColor: string = this.defaultColor;

  constructor(private eleRef: ElementRef , private renderer: Renderer2){ }
  
  ngOnInit() {
       // this.renderer.setStyle(this.eleRef.nativeElement, 'background-color','blue');
      this. backgroundColor=this.defaultColor;
  }

  @HostListener('mouseenter') mouseover (evenData: Event){
    //this.renderer.setStyle(this.eleRef.nativeElement, 'background-color','blue');
    this.backgroundColor= this.highlateColor;
    //with both the above lines give same output 
  }
  
  @HostListener('mouseleave') mouseleave (evenData: Event){
    //this.renderer.setStyle(this.eleRef.nativeElement, 'background-color','transparent');
    this.backgroundColor= this.defaultColor;
     //with both the above lines give same output
  }

  

 }
