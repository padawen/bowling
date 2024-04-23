import { Component, OnInit } from '@angular/core';
import { Lane } from '../../shared/models/lane';

@Component({
  selector: 'app-lane',
  templateUrl: './lane.component.html',
  styleUrls: ['./lane.component.scss']
})
export class LaneComponent implements OnInit {
  lanes: Lane[] = [
    { id: 1, name: 'Lane 1', description: 'Perfect for families' },
    { id: 2, name: 'Lane 2', description: 'Ideal for couples' },
    { id: 3, name: 'Lane 3', description: 'Great for league play' },
    { id: 4, name: 'Lane 4', description: 'Best for tournaments' },
    { id: 5, name: 'Lane 5', description: 'Good for events' },
    { id: 6, name: 'Lane 6', description: 'Enjoy a quiet game' }
  ];

  constructor() { }

  ngOnInit(): void {
  }
}