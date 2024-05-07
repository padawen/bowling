import { Component, OnInit } from '@angular/core';
import { Lane } from '../../shared/models/lane';

@Component({
  selector: 'app-lane',
  templateUrl: './lane.component.html',
  styleUrls: ['./lane.component.scss']
})
export class LaneComponent implements OnInit {
  lanes: Lane[] = [
    { id: 1, name: 'Lane 1', description: 'Perfect for families', imageUrl: 'assets/images/lane1.webp' },
    { id: 2, name: 'Lane 2', description: 'Ideal for couples', imageUrl: 'assets/images/lane2.webp' },
    { id: 3, name: 'Lane 3', description: 'Great for league play', imageUrl: 'assets/images/lane3.webp' },
    { id: 4, name: 'Lane 4', description: 'Best for tournaments', imageUrl: 'assets/images/lane4.webp' },
    { id: 5, name: 'Lane 5', description: 'Good for events', imageUrl: 'assets/images/lane5.webp' },
    { id: 6, name: 'Lane 6', description: 'Enjoy a quiet game', imageUrl: 'assets/images/lane6.webp' }
  ];

  constructor() { }

  ngOnInit(): void {
  }
}