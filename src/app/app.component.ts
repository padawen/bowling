import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { NavigationEnd, Router } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { AuthService } from './shared/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  page = '';
  routes: string[] = [];
  loggedInUser?: firebase.default.User | null;
  private routerSubscription?: Subscription;
  private authSubscription?: Subscription;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.initializeRoutes();
    this.subscribeToRouterEvents();
    this.subscribeToAuthStatus();
  }

  private initializeRoutes(): void {
    this.routes = this.router.config.map(conf => conf.path) as string[];
  }

  private subscribeToRouterEvents(): void {
    this.routerSubscription = this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe({
      next: (event: NavigationEnd) => {
        const currentPage = event.urlAfterRedirects.split('/')[1];
        if (this.routes.includes(currentPage)) {
          this.page = currentPage;
        }
      },
      error: (error) => console.error('Error with Router Events:', error)
    });
  }


  private subscribeToAuthStatus(): void {
    this.authSubscription = this.authService.isUserLoggedIn().subscribe({
      next: (user) => {
        this.loggedInUser = user;
        localStorage.setItem('user', JSON.stringify(this.loggedInUser));
      },
      error: (error) => {
        console.error('Authentication status error:', error);
        localStorage.setItem('user', 'null');
      }
    });
  }

  changePage(selectedPage: string): void {
    this.router.navigateByUrl(`/${selectedPage}`);
  }

  onToggleSidenav(sidenav: MatSidenav): void {
    sidenav.toggle();
  }

  onClose(event: any, sidenav: MatSidenav): void {
    if (event) {
      sidenav.close();
    }
  }

  logout(): void {
    this.authService.logout().then(() => {
      console.log('Logged out successfully.');
    }).catch(error => {
      console.error('Logout error:', error);
    });
  }

  ngOnDestroy(): void {
    this.routerSubscription?.unsubscribe();
    this.authSubscription?.unsubscribe();
  }
}
