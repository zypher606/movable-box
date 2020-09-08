import { Component, OnInit, HostListener, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-box-container',
  templateUrl: './box-container.component.html',
  styleUrls: ['./box-container.component.scss']
})
export class BoxContainerComponent implements OnInit {

  public activatedBox: any;

  private boxIndex = 2;
  public boxes = ['box-0', 'box-1'];
  
  @ViewChild("boxContainer") boxContainer: ElementRef;

  public boundary: any;

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit() : void {
    this.boundary = this.boxContainer.nativeElement.getBoundingClientRect() as DOMRect;
  }

  public acivateBox(boxId) {
    this.activatedBox = boxId;
  }

  public addBox() {
    this.boxes.push(`box-${this.boxIndex.toString()}`);
    this.boxIndex += 1;
  }

  @HostListener('document:keyup', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) { 
    
    if (event.key == "Delete" || event.key == "Backspace") {
      this.boxes.splice(this.boxes.indexOf(this.activatedBox), 1);
    }
  }

}
