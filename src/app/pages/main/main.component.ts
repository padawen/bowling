import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']  
})
export class MainComponent implements OnInit, OnDestroy {
  loggedInUser: boolean = false; 
  private authSub!: Subscription; 

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authSub = this.authService.isUserLoggedIn().subscribe(user => {
      this.loggedInUser = !!user; 
    });
  }

  ngOnDestroy(): void {
    if (this.authSub) {
      this.authSub.unsubscribe();
    }
  }
}
