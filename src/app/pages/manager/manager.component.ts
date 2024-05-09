import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Reservation } from '../../shared/models/reservation';
import { ReservationService } from '../../shared/services/reservation.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-manager',
  templateUrl: './manager.component.html',
  styleUrls: ['./manager.component.scss']
})
export class ManagerComponent implements OnInit {
  reservations$!: Observable<Reservation[]>;
  selectedReservation: Reservation | null = null;
  reservationForm: FormGroup;
  reservationError: string | null = null;

  constructor(
    private reservationService: ReservationService,
    private fb: FormBuilder
   ) {
    this.reservationForm = this.fb.group({
      laneId: [''],
      date: [''],
      time: [''],
      numberOfPlayers: ['']
    });
  }

  ngOnInit() {
    this.loadReservations();
  }

  loadReservations() {
    this.reservations$ = this.reservationService.getReservations();
  }

  selectReservationForUpdate(reservation: Reservation): void {
    this.selectedReservation = reservation;
    this.reservationForm.patchValue({
      date: this.selectedReservation.startTime,
      time: this.selectedReservation.startTime.toTimeString().split(' ')[0], 
      numberOfPlayers: this.selectedReservation.numberOfPlayers
    });
  }

  updateReservation() {
    if (this.selectedReservation && this.reservationForm.valid) {
      const updatedValues = this.reservationForm.value;
      const startTime = new Date(updatedValues.date);
      const timeParts = updatedValues.time.split(':'); 
      startTime.setHours(parseInt(timeParts[0], 10)); 
      startTime.setMinutes(parseInt(timeParts[1], 10)); 
      
      
      const endTime = new Date(startTime.getTime() + (1 * 60 * 60 * 1000) + (59 * 60 * 1000));
  
      const updatedReservation = {
        ...this.selectedReservation,
        startTime,
        endTime,
        numberOfPlayers: updatedValues.numberOfPlayers
      };
  
      this.reservationService.updateReservation(this.selectedReservation.id!, updatedReservation)
        .then(() => {
          alert('Reservation updated successfully!');
          this.selectedReservation = null;
          this.reservationError = null;
          this.loadReservations();
        })
        .catch(error => {
          this.reservationError = 'Failed to update reservation: ' + error.message;
        });
    }
  }
  
  deleteReservation(reservationId: string) {
    this.reservationService.deleteReservation(reservationId)
      .then(() => {
        alert('Reservation deleted successfully!');
        this.loadReservations();
      })
      .catch(error => {
        this.reservationError = 'Failed to delete reservation: ' + error.message;
      });
  }
  addReservation() {
    const newReservationData: Reservation = {
      laneId: this.reservationForm.value.laneId,
      startTime: new Date(this.reservationForm.value.date + 'T' + this.reservationForm.value.time),
      endTime: new Date(this.reservationForm.value.date + 'T' + this.reservationForm.value.time + 2 * 60 * 60 * 1000),
      numberOfPlayers: this.reservationForm.value.numberOfPlayers
    };

    this.reservationService.checkAndAddReservation(newReservationData)
      .then(() => {
        alert('Reservation added successfully!');
        this.loadReservations();
      })
      .catch(error => alert(error.message));
  }

  
}
