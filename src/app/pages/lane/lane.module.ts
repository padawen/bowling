import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LaneRoutingModule } from './lane-routing.module';
import { LaneComponent } from './lane.component';
import { MaterialModule } from '../../material/material/material.module';


@NgModule({
  declarations: [
    LaneComponent
  ],
  imports: [
    CommonModule,
    LaneRoutingModule,
    MaterialModule
  ]
})
export class LaneModule { }
