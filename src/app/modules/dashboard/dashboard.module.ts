import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { BoxContainerComponent } from './components/box-container/box-container.component';
import { BoxComponent } from './components/box/box.component';
import { DraggableDirective } from './directives/draggable/draggable.directive';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    DashboardComponent,
    BoxContainerComponent,
    BoxComponent,
    DraggableDirective,
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class DashboardModule { }
