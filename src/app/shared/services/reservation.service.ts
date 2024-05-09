import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import firebase from 'firebase/compat/app';
import { Reservation } from '../models/reservation';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {

  constructor(
    private firestore: AngularFirestore,
    private afAuth: AngularFireAuth
  ) {}

  
  async checkAndAddReservation(reservation: Reservation): Promise<void> {
    const user = await this.afAuth.currentUser;
    if (!user) {
      throw new Error('Authentication required');
    }

    
    const reservations = await this.checkAvailability(reservation.laneId, reservation.startTime, reservation.endTime);
    if (reservations.length > 0) {
      throw new Error('This lane is already reserved for the selected time. Please choose a different time.');
    }

    
    await this.addReservation(reservation);
  }

  
  async addReservation(reservation: Reservation): Promise<void> {
    const user = await this.afAuth.currentUser;
    if (!user) {
      throw new Error('Authentication required');
    }
  
    const reservationRef = this.firestore.collection('reservations').doc();
    const reservationData = {
      ...reservation,
      userId: user.uid,
      startTime: firebase.firestore.Timestamp.fromDate(reservation.startTime),
      endTime: firebase.firestore.Timestamp.fromDate(reservation.endTime)
    };
  
    await reservationRef.set(reservationData);
    return Promise.resolve();
  }
  

public async checkAvailability(laneId: number, start: Date, end: Date): Promise<any[]> {
  const startTimestamp = firebase.firestore.Timestamp.fromDate(start);
  const endTimestamp = firebase.firestore.Timestamp.fromDate(end);

  
  const querySnapshot = await this.firestore.collection('reservations', ref => ref
    .where('laneId', '==', laneId)
    .where('startTime', '<=', endTimestamp)
    .where('endTime', '>=', startTimestamp)
  ).get().toPromise();

  
  if (!querySnapshot) {
      throw new Error('Failed to retrieve data');
  }

  
  return querySnapshot.docs.map(doc => doc.data());
}


  
  getReservations(userId?: string): Observable<Reservation[]> {
    return this.firestore.collection<Reservation>('reservations', ref =>
      userId ? ref.where('userId', '==', userId).orderBy('startTime') : ref.orderBy('startTime')
    ).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Reservation;
        const id = a.payload.doc.id;
        return {
          id,
          ...data,
          startTime: data.startTime instanceof firebase.firestore.Timestamp ? data.startTime.toDate() : data.startTime,
          endTime: data.endTime instanceof firebase.firestore.Timestamp ? data.endTime.toDate() : data.endTime,
        };
      }))
    );
  }

  
  async updateReservation(reservationId: string, updateData: Partial<Reservation>): Promise<void> {
    
    const existingReservation = await this.firestore.collection('reservations').doc(reservationId).ref.get();
    if (!existingReservation.exists) {
      throw new Error('Reservation does not exist');
    }
  
    
    const { laneId, startTime, endTime } = updateData;
  
    
    const reservations = await this.checkAvailability(laneId!, startTime!, endTime!);
    if (reservations.length > 0) {
      throw new Error('This lane is already reserved for the selected time. Please choose a different time.');
    }
  
    
    const reservationRef = this.firestore.collection('reservations').doc(reservationId);
    const updates = {
      ...updateData,
      startTime: startTime ? firebase.firestore.Timestamp.fromDate(startTime) : undefined,
      endTime: endTime ? firebase.firestore.Timestamp.fromDate(endTime) : undefined,
    };
  
    return reservationRef.update(updates);
  }

  
  deleteReservation(reservationId: string): Promise<void> {
    return this.firestore.collection('reservations').doc(reservationId).delete();
  }
}
