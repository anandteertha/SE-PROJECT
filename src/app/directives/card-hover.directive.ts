import { Directive, ElementRef, HostListener, Renderer2, AfterViewInit, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Directive({
  selector: '[appCardHover]',
  standalone: true,
})
export class CardHoverDirective implements AfterViewInit {
  private bounds!: DOMRect;
  private glowElement!: HTMLElement;
  private isBrowser: boolean;

  constructor(
    private element: ElementRef<HTMLElement>,
    private renderer: Renderer2,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngAfterViewInit() {
    if (this.isBrowser) {
      // The directive's host element is the card itself.
      // We need to create and append the glow element dynamically.
      this.glowElement = this.renderer.createElement('div');
      this.renderer.addClass(this.glowElement, 'glow');
      this.renderer.appendChild(this.element.nativeElement, this.glowElement);
    }
  }

  @HostListener('mouseenter')
  onMouseEnter() {
    if (this.isBrowser) {
      this.bounds = this.element.nativeElement.getBoundingClientRect();
    }
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    if (this.isBrowser) {
      this.renderer.setStyle(this.element.nativeElement, 'transform', '');
      this.renderer.setStyle(this.glowElement, 'background-image', '');
    }
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(e: MouseEvent) {
    if (!this.bounds || !this.isBrowser) {
      return;
    }

    const mouseX = e.clientX;
    const mouseY = e.clientY;
    const leftX = mouseX - this.bounds.x;
    const topY = mouseY - this.bounds.y;
    const center = {
      x: leftX - this.bounds.width / 2,
      y: topY - this.bounds.height / 2,
    };
    const distance = Math.sqrt(center.x ** 2 + center.y ** 2);

    // Set transform on the card
    this.renderer.setStyle(
      this.element.nativeElement,
      'transform',
      `
        scale3d(1.07, 1.07, 1.07)
        rotate3d(
          ${center.y / 100},
          ${-center.x / 100},
          0,
          ${Math.log(distance) * 2}deg
        )
      `
    );

    // Set background on the glow element
    this.renderer.setStyle(
      this.glowElement,
      'background-image',
      `
        radial-gradient(
          circle at
          ${center.x * 2 + this.bounds.width / 2}px
          ${center.y * 2 + this.bounds.height / 2}px,
          #ffffff88,
          #00000033
        )
      `
    );
  }
}
