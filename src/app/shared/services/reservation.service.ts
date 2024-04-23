import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable } from 'rxjs';
import firebase from 'firebase/compat/app'; // Ensure you have the firebase imports needed for types

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  
  constructor(
    private firestore: AngularFirestore,
    private afAuth: AngularFireAuth
  ) {}

  async addReservation(laneId: number, start: Date, end: Date, numberOfPlayers: number): Promise<void> {
    const user = await this.afAuth.currentUser;
    if (!user) {
      throw new Error('Authentication required');
    }
    const reservationRef = this.firestore.collection('reservations').doc();
    return reservationRef.set({
      laneId: laneId,
      startTime: firebase.firestore.Timestamp.fromDate(start),
      endTime: firebase.firestore.Timestamp.fromDate(end),
      numberOfPlayers: numberOfPlayers,
      userId: user.uid  // Store user UID instead of a reference for simpler queries and rule management
    });
  }

  getReservations(): Observable<any[]> {
    return this.firestore.collection('reservations', ref => ref.orderBy('startTime')).valueChanges({ idField: 'id' });
  }

  checkAvailability(laneId: number, start: Date, end: Date): Observable<any[]> {
    return this.firestore.collection('reservations', ref => ref
      .where('laneId', '==', laneId)
      .where('startTime', '<=', firebase.firestore.Timestamp.fromDate(end))
      .where('endTime', '>=', firebase.firestore.Timestamp.fromDate(start))
    ).valueChanges();
  }
}
