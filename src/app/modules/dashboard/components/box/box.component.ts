import { Component, OnInit, HostListener, ElementRef, EventEmitter, Input } from '@angular/core';
import { Observable } from 'rxjs';
import {debounceTime, distinctUntilChanged, map, startWith, tap} from 'rxjs/operators';

@Component({
  selector: 'app-box',
  templateUrl: './box.component.html',
  styleUrls: ['./box.component.scss']
})
export class BoxComponent implements OnInit {

  @Input() box: any;

  constructor(
    public element: ElementRef
  ) { 
  }

  ngOnInit(): void {
  }


}
