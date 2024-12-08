import {
  Directive,
  HostListener,
  EventEmitter,
  Output,
  ElementRef,
  AfterViewInit,
  Input,
} from '@angular/core';

@Directive({
  selector: '[appScrollPosition]',
})
export class ScrollPositionDirective implements AfterViewInit {
  @Input() checkOnChange: boolean = false;
  @Output() atBottom: EventEmitter<boolean> = new EventEmitter();
  @Output() isScrollable: EventEmitter<boolean> = new EventEmitter();

  private scrollThreshold: number = 0;

  constructor(private elementRef: ElementRef) {}

  ngAfterViewInit() {
    this.checkScrollable();
    this.checkScrollPosition();
  }

  ngOnChanges() {
    this.checkScrollable();
  }

  @HostListener('scroll', [])
  onScroll() {
    this.checkScrollPosition();
  }

  private checkScrollable() {
    const element = this.elementRef.nativeElement;
    const isScrollable = element.scrollHeight > element.clientHeight;
    this.isScrollable.emit(isScrollable);
  }

  private checkScrollPosition() {
    const element = this.elementRef.nativeElement;
    const scrollTop = element.scrollTop;
    const scrollHeight = element.scrollHeight;
    const clientHeight = element.clientHeight;

    const isAtBottom =
      scrollTop + clientHeight >= scrollHeight - this.scrollThreshold;

    this.atBottom.emit(isAtBottom);
  }
}
