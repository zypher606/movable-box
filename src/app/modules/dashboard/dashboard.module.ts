import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { BoxContainerComponent } from './components/box-container/box-container.component';
import { BoxComponent } from './components/box/box.component';

@NgModule({
  declarations: [
    DashboardComponent,
    BoxContainerComponent,
    BoxComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule
  ]
})
export class DashboardModule { }
