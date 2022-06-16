import { Directive, HostBinding, HostListener } from "@angular/core";

@Directive({
    selector:'[appDirectiveDropdown]'
})
export class DirectiveDropdown{
    @HostBinding('class.open') isOpen = false;

    @HostListener('click') toggleOpen(){
        this.isOpen = !this.isOpen;
    }

}