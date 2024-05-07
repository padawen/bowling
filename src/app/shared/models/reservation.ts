
export interface Reservation {
    id?: string; 
    laneId: number;
    startTime: Date; 
    endTime: Date;
    numberOfPlayers: number;
    userId?: string; 
  }
  