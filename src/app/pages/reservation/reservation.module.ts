// src/app/pages/reservation/reservation.module.ts or src/app/app.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ReservationComponent } from './reservation.component';
import { MaterialModule } from '../../material/material/material.module';

@NgModule({
  declarations: [ReservationComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule
  ]
})
export class ReservationModule { }
