import { Component } from '@angular/core';
import { ReservationService } from '../../shared/services/reservation.service';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-manager',
  templateUrl: './manager.component.html',
  styleUrls: ['./manager.component.scss']
})
export class ManagerComponent {
  reservations$: Observable<any[]> | undefined; 

  constructor(private reservationService: ReservationService) {}

  ngOnInit() {
    this.loadReservations();
  }

  loadReservations() {
    this.reservations$ = this.reservationService.getReservations();
  }

  updateReservation(updatedReservation: any) {
    this.reservationService.updateReservation(updatedReservation.id, updatedReservation)
      .then(() => alert('Reservation updated successfully!'))
      .catch((error: { message: string; }) => alert('Failed to update reservation: ' + error.message));
  }

  deleteReservation(reservationId: string) {
    this.reservationService.deleteReservation(reservationId)
      .then(() => alert('Reservation deleted successfully!'))
      .catch((error: { message: string; }) => alert('Failed to delete reservation: ' + error.message));
  }
}
