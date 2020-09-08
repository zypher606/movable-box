import { Component, OnInit, HostListener, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-box-container',
  templateUrl: './box-container.component.html',
  styleUrls: ['./box-container.component.scss']
})
export class BoxContainerComponent implements OnInit {

  public activatedBox: any = null;

  private boxIndex = 2;
  public boxes = ['box-0', 'box-1'];
  
  @ViewChild("boxContainer") boxContainer: ElementRef;

  public boundary: DOMRect = null;
  public hotkeysEnabled: boolean = true;

  constructor() { }

  ngOnInit(): void {

  }

  ngAfterViewInit() : void {
    setTimeout(() => this.boundary = this.boxContainer.nativeElement.getBoundingClientRect() as DOMRect, 300)
  }

  public acivateBox(event, boxId) {
    if (event) event.stopPropagation();
    this.activatedBox = boxId;
  }

  public clearSelection() {
    this.activatedBox = null;
  }

  public addBox() {
    this.boxes.push(`box-${this.boxIndex.toString()}`);
    this.boxIndex += 1;
  }

  @HostListener('document:keyup', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {

    if (!this.hotkeysEnabled) return;
    
    if ((event.key == "Delete" || event.key == "Backspace") && this.boxes.indexOf(this.activatedBox) != -1 && this.activatedBox) {
        this.boxes.splice(this.boxes.indexOf(this.activatedBox), 1);
        this.boxIndex -= 1;
        this.activatedBox = null;
    }
  }

}
