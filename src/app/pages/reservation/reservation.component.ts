import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ReservationService } from '../../shared/services/reservation.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.scss']
})
export class ReservationComponent implements OnInit, OnDestroy {
  reservationForm!: FormGroup;
  laneId!: number;
  reservationError: string | null = null;
  private authSub!: Subscription;

  constructor(
    private fb: FormBuilder,
    private reservationService: ReservationService,
    private route: ActivatedRoute,
    private afAuth: AngularFireAuth
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.laneId = +params['laneId'];
      this.initializeForm();
    });
  }

  initializeForm(): void {
    this.reservationForm = this.fb.group({
      date: ['', Validators.required],
      time: ['', Validators.required],
      numberOfPlayers: ['', [Validators.required, Validators.min(1)]],
      duration: [2, [Validators.required]] // Fixed duration of 2 hours
    });
  }

  onSubmit(): void {
    if (this.reservationForm.valid) {
      const formValue = this.reservationForm.value;
      const [hours, minutes] = formValue.time.split(':').map((val: string) => parseInt(val, 10));
      const startTime = new Date(formValue.date);
      startTime.setHours(hours, minutes);
  
      // Setting the duration to 1 hour and 59 minutes
      const durationInMilliseconds = (1 * 60 * 60 * 1000) + (59 * 60 * 1000); // 1 hour + 59 minutes in milliseconds
      const endTime = new Date(startTime.getTime() + durationInMilliseconds);
  
      this.afAuth.currentUser.then(user => {
        if (user) {
          this.reservationService.checkAvailability(this.laneId, startTime, endTime).subscribe(
            reservations => {
              if (reservations && reservations.length > 0) {
                this.reservationError = 'This lane is already reserved for the selected time. Please choose a different time.';
              } else {
                this.reservationService.addReservation(this.laneId, startTime, endTime, formValue.numberOfPlayers)
                  .then(() => {
                    console.log('Reservation successfully added!');
                    this.reservationForm.reset();
                  })
                  .catch(error => {
                    console.error('Error adding reservation:', error);
                    this.reservationError = 'Error processing your reservation. Please try again.';
                  });
              }
            },
            error => {
              console.error('Error checking reservation availability:', error);
              this.reservationError = 'Error checking availability. Please try again later.';
            }
          );
        } else {
          this.reservationError = 'You must be logged in to make a reservation.';
        }
      });
    }
  }

  private checkAndMakeReservation(startTime: Date, endTime: Date) {
    this.reservationService.checkAvailability(this.laneId, startTime, endTime).subscribe(
      reservations => {
        if (reservations.length > 0) {
          this.reservationError = 'This lane is already reserved for the selected time. Please choose a different time.';
        } else {
          this.reservationService.addReservation(this.laneId, startTime, endTime, this.reservationForm.value.numberOfPlayers)
            .then(() => {
              console.log('Reservation successfully added!');
              this.reservationForm.reset();
            })
            .catch(error => {
              console.error('Error adding reservation:', error);
              this.reservationError = 'Error processing your reservation. Please try again.';
            });
        }
      },
      error => {
        console.error('Error checking reservation availability:', error);
        this.reservationError = 'Error checking availability. Please try again later.';
      }
    );
  }

  ngOnDestroy(): void {
    if (this.authSub) {
      this.authSub.unsubscribe();
    }
  }
}
