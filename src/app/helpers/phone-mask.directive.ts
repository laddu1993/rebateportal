import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appPhoneMask]'
})
export class PhoneMaskDirective {

  @HostListener('input', ['$event'])
  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = input.value.replace(/\D/g, ''); // Remove non-numeric characters
    const formatted = this.formatPhoneNumber(value);
    input.value = formatted;
  }

  private formatPhoneNumber(value: string): string {
    
    if (value.length == 0) {
      return ``;
    } else if (value.length <= 3) {
      return `(${value}`;
    } else if (value.length <= 6) {
      return `(${value.slice(0, 3)}) ${value.slice(3)}`;
    } else {
      return `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6, 10)}`;
    }
  }
}
