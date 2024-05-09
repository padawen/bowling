import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManagerRoutingModule } from './manager-routing.module';
import { MaterialModule } from '../../material/material/material.module';
import { ManagerComponent } from './manager.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ManagerComponent 
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    ManagerRoutingModule
  ]
})
export class ManagerModule { }
