import { Directive, AfterViewInit, OnDestroy, Input, ElementRef, NgZone, HostListener } from '@angular/core';
import { Subject, Observable, fromEvent } from 'rxjs';
import { switchMap, takeUntil, map } from 'rxjs/operators';

@Directive({
  selector: '[appDraggable]'
})
export class DraggableDirective implements AfterViewInit, OnDestroy  {

  @Input() dragHandle: string;
  @Input() dragTarget: string;

  @Input() isActive: boolean = false;
  @Input() boundary: DOMRect;

  // Element to be dragged
  private target: HTMLElement;
  // Drag handle
  private handle: HTMLElement;
  private delta = {x: 0, y: 0};
  private offset = {x: 0, y: 0};

  private boxWidth = 220;
  private boxHeight = 64;

  private destroy$ = new Subject<void>();

  constructor(private elementRef: ElementRef, private zone: NgZone) {
  }

  public ngAfterViewInit(): void {
    this.handle = this.dragHandle ? document.querySelector(this.dragHandle) as HTMLElement :
                                    this.elementRef.nativeElement;
    this.target = document.querySelector(this.dragTarget) as HTMLElement;
    this.setupEvents();
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
  }

  private setupEvents() {

    this.zone.runOutsideAngular(() => {
      let mousedown$ = fromEvent(this.handle, 'mousedown');
      let mousemove$ = fromEvent(document, 'mousemove');
      let mouseup$ = fromEvent(document, 'mouseup');

      let mousedrag$ = mousedown$
      .pipe(
        switchMap((event: MouseEvent) => {
          let startX = event.clientX;
          let startY = event.clientY;

          return mousemove$
            .pipe(

              map((event: MouseEvent) => {
                event.preventDefault();
                this.delta = {
                  x: event.clientX - startX,
                  y: event.clientY - startY
                };
              }),
              takeUntil(mouseup$)
            )
        }),
        takeUntil(this.destroy$)
      )

      mousedrag$.subscribe(() => {
        if (this.delta.x === 0 && this.delta.y === 0) {
          return;
        }

        this.translate();
      });

      // mouseup$.pipe(
      //   takeUntil(this.destroy$)
      // ).subscribe(() => {
      //   // this.offset.x = this.deltaX(this.offset.x, this.delta.x);
      //   // this.offset.y = this.deltaY(this.offset.y, this.delta.y);
      //   // this.boundX(this.offset.x) ? this.offset.x += this.delta.x : null;
      //   // this.boundY(this.offset.y) ? this.offset.y += this.delta.y : null;
      //   this.offset.x += this.delta.x;
      //   this.offset.y += this.delta.y
      //   // this.offset.x = this.deltaX(this.offset.x, this.delta.x);
      //   // this.offset.y = this.deltaY(this.offset.y, this.delta.y);
      //   this.delta = {x: 0, y: 0};
      // });
    });
  }

  private translate() {
    
    if(!this.isActive) return;

    // if (this.offset.x + this.delta.x > this.boundary.left && this.offset.x + this.delta.x + this.boxWidth < this.boundary.right) {
    //   this.offset.x += this.delta.x;
    // }

    // this.offset.x = this.deltaX(this.offset.x, this.delta.x);
    // this.offset.y = this.deltaY(this.offset.y, this.delta.y);

    // if (this.offset.y + this.delta.y > this.boundary.top && this.offset.y + this.delta.y + this.boxHeight < this.boundary.bottom) {
      // }
    // this.offset.x += this.delta.x;

    // this.offset.y += this.delta.y;
    
    let X = this.offset.x;
    let Y = this.offset.y;

    this.boundX(X) ? X += this.delta.x : null;
    this.boundY(Y) ? Y += this.delta.y : null;

    requestAnimationFrame(() => {
      this.target.style.transform = `
        translate(${X}px,
                  ${Y}px)
      `;
    });
  }

  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) { 
    
    switch (event.key) {
      case 'w':
        this.translateXY(0, -2);
        break;
      case 'a':
        this.translateXY(-2, 0);
        break;
      case 's':
        this.translateXY(0, 2);
        break;
      case 'd':
        this.translateXY(2, 0);
        break;
    }
  }
  
  private translateXY(x: number, y: number) {
    
    if(!this.isActive) return;


    this.offset.x = this.deltaX(this.offset.x, x);
    this.offset.y = this.deltaY(this.offset.y, y);

    requestAnimationFrame(() => {
      this.target.style.transform = `
        translate(${this.offset.x}px,
                  ${this.offset.y}px)
      `;
    });
  }

  private deltaX(x, offset) {
    if (x + offset > this.boundary.left && x + offset + this.boxWidth < this.boundary.right) {
      x += offset;
    }
    return x;
  }

  private deltaY(y, offset) {
    if (y + offset > this.boundary.top && y + offset + this.boxHeight < this.boundary.bottom) {
      y += offset;
    }
    return y;
  }

  private boundX(offset) {
    if (offset > this.boundary.left && offset + this.boxWidth < this.boundary.right) {
      return true;
    }
    return false;
  }

  private boundY(offset) {
    if (offset > this.boundary.top && offset + this.boxHeight < this.boundary.bottom) {
      return true;
    }
    return false;
  }


}
