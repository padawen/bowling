import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription, from } from 'rxjs';
import { ReservationService } from '../../shared/services/reservation.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Reservation } from '../../shared/models/reservation';

@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.scss']
})
export class ReservationComponent implements OnInit, OnDestroy {
  reservationForm!: FormGroup;
  laneId!: number;
  reservationError: string | null = null;
  private routeSub!: Subscription;

  constructor(
    private fb: FormBuilder,
    private reservationService: ReservationService,
    private route: ActivatedRoute,
    private afAuth: AngularFireAuth
  ) {}

  ngOnInit(): void {
    this.routeSub = this.route.params.subscribe(params => {
      this.laneId = +params['laneId'];
      this.initializeForm();
    });
  }

  initializeForm(): void {
    this.reservationForm = this.fb.group({
      date: ['', Validators.required],
      time: ['', Validators.required],
      numberOfPlayers: ['', [Validators.required, Validators.min(1)]],
      duration: [2, [Validators.required]] 
    });
  }

  onSubmit(): void {
    if (this.reservationForm.valid) {
      const formValue = this.reservationForm.value;
      const [hours, minutes] = formValue.time.split(':').map((val: string) => parseInt(val, 10));
      const startTime = new Date(formValue.date);
      startTime.setHours(hours, minutes);

      const durationInMilliseconds = (1 * 60 * 60 * 1000) + (59 * 60 * 1000);
      const endTime = new Date(startTime.getTime() + durationInMilliseconds);

      this.checkAndMakeReservation(startTime, endTime);
    }
  }

  private checkAndMakeReservation(startTime: Date, endTime: Date): void {
    from(this.reservationService.checkAvailability(this.laneId, startTime, endTime)).subscribe({
      next: (reservations: string | any[]) => {
        if (reservations.length > 0) {
          this.reservationError = 'This lane is already reserved for the selected time. Please choose a different time.';
          return;
        }
        this.addReservation({
          laneId: this.laneId,
          startTime: startTime,
          endTime: endTime,
          numberOfPlayers: this.reservationForm.value.numberOfPlayers
        });
      },
      error: (err: { message: string | null }) => {
        this.reservationError = err.message;
        console.error('Error checking reservation availability:', err);
      }
    });
  }
  
  private addReservation(reservation: Reservation): void {
    this.reservationService.addReservation(reservation)
      .then(() => {
        alert('Reservation added successfully!');
        this.reservationForm.reset();
      })
      .catch(error => alert(error.message));
  }

  ngOnDestroy(): void {
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }
}
