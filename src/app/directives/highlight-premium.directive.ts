import { Directive, Input, ElementRef, OnInit, OnChanges, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[appHighlightPremium]',
  standalone: true
})
export class HighlightPremiumDirective implements OnInit, OnChanges {
  @Input('appHighlightPremium') price!: number;
  @Input() threshold: number = 300;

  constructor(private el: ElementRef) {}

  ngOnInit() {
    this.applyHighlight();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.applyHighlight();
  }

  private applyHighlight() {
    if (this.price && this.price > this.threshold) {
      this.el.nativeElement.style.backgroundColor = '#fff3cd'; 
      this.el.nativeElement.style.borderLeft = '5px solid #ffc107';
      this.el.nativeElement.style.padding = '1rem';
    } else {
      this.el.nativeElement.style.backgroundColor = '';
      this.el.nativeElement.style.borderLeft = '';
      this.el.nativeElement.style.padding = '';
    }
  }
}