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
  private offset = {x: 400, y: 400};

  private boxWidth = 220;
  private boxHeight = 64;

  private destroy$ = new Subject<void>();

  private translateSpeed = 3;

  private hotkeysEnabled: boolean = false;


  constructor(private elementRef: ElementRef, private zone: NgZone) {
  }

  public ngAfterViewInit(): void {
    this.handle = this.dragHandle ? document.querySelector(this.dragHandle) as HTMLElement :
                                    this.elementRef.nativeElement;
    this.target = document.querySelector(this.dragTarget) as HTMLElement;

    this.initBoxLocation();
    this.setupEvents();
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
  }

  private initBoxLocation() {

    this.offset.x = window.innerWidth/2 - this.boxWidth/2;
    this.offset.y = window.innerHeight/2 - this.boxHeight/2;

    requestAnimationFrame(() => {
      this.target.style.transform = `
        translate(${this.offset.x}px,
                  ${this.offset.y}px)
      `;
    });
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

      mouseup$.pipe(
        takeUntil(this.destroy$)
      ).subscribe(() => {
       
        let X = this.offset.x + this.delta.x;
        if (X  <= this.boundary.left) {
          X = this.boundary.left;
        } else if (X >= this.boundary.right - this.boxWidth) {
          X = this.boundary.right - this.boxWidth;
        }

        let Y = this.offset.y + this.delta.y;
        if (Y <= this.boundary.top) {
          Y = this.boundary.top;
        } else if (Y >= this.boundary.bottom - this.boxHeight) {
          Y = this.boundary.bottom - this.boxHeight;
        }

        this.offset.x = X;
        this.offset.y = Y;
        
        this.delta = {x: 0, y: 0};
      });
    });
  }

  private translate() {
    
    if(!this.isActive) return;

    let X = this.offset.x + this.delta.x;
    if (X  <= this.boundary.left) {
      X = this.boundary.left;
    } else if (X >= this.boundary.right - this.boxWidth) {
      X = this.boundary.right - this.boxWidth;
    }

    let Y = this.offset.y + this.delta.y;
    if (Y <= this.boundary.top) {
      Y = this.boundary.top;
    } else if (Y >= this.boundary.bottom - this.boxHeight) {
      Y = this.boundary.bottom - this.boxHeight;
    }


    requestAnimationFrame(() => {
      this.target.style.transform = `
        translate(${X}px,
                  ${Y}px)
      `;
    });
  }

  @Input("hotkeysEnabled")
  set setHotkeysConfig(value: boolean) {
    this.hotkeysEnabled = value;
  }


  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) { 

    if (!this.hotkeysEnabled) return;
    
    switch (event.key) {
      case 'w':
        this.translateXY(0, -this.translateSpeed);
        break;
      case 'a':
        this.translateXY(-this.translateSpeed, 0);
        break;
      case 's':
        this.translateXY(0, this.translateSpeed);
        break;
      case 'd':
        this.translateXY(this.translateSpeed, 0);
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
