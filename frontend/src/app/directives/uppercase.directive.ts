import { Directive, HostListener, ElementRef, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appUppercase]',
})
export class UppercaseDirective {
  constructor(private el: ElementRef, private renderer: Renderer2) {}

  @HostListener('input', ['$event'])
  onInput(event: any) {
    const inputValue = event.target.value;
    this.renderer.setProperty(event.target, 'value', inputValue.toUpperCase());
  }
}
