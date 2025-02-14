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
  @Output() atBottom: EventEmitter<boolean> = new EventEmitter();
  @Output() isScrollable: EventEmitter<boolean> = new EventEmitter();
  private resizeObserver!: ResizeObserver;
  private scrollThreshold: number = 20;

  constructor(private elementRef: ElementRef) {}

  ngAfterViewInit() {
    this.setupResizeObserver();
    this.checkScrollPosition();
  }

  @HostListener('scroll', [])
  onScroll() {
    this.checkScrollPosition();
  }

  private setupResizeObserver() {
    this.resizeObserver = new ResizeObserver(() => {
      requestAnimationFrame(() => this.checkScrollable());
    });
    this.resizeObserver.observe(this.elementRef.nativeElement);
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

  ngOnDestroy() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }
}
