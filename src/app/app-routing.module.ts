import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './shared/services/authguard.service.spec';  // Ensure this path is correct and that it's not pointing to `.spec` files
import { ReservationComponent } from './pages/reservation/reservation.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./pages/register/register.module').then(m => m.RegisterModule)
  },
  {
    path: 'main',
    loadChildren: () => import('./pages/main/main.module').then(m => m.MainModule),
    canActivate: [AuthGuard] // Assuming you want AuthGuard here
  },
  {
    path: 'contact',
    loadChildren: () => import('./pages/contact/contact.module').then(m => m.ContactModule)
  },
  {
    path: 'lane',
    loadChildren: () => import('./pages/lane/lane.module').then(m => m.LaneModule)
  },
  {
    path: 'reservation',
    loadChildren: () => import('./pages/reservation/reservation.module').then(m => m.ReservationModule),
    canActivate: [AuthGuard] // Assuming reservations should be protected
  },
  {
    path: 'lanes', loadChildren: () => import('./pages/lane/lane.module').then(m => m.LaneModule),
    canActivate: [AuthGuard] // Assuming reservations should be protected

  },
  { path: 'reservation/:laneId', component: ReservationComponent },
  {
    path: '**',
    redirectTo: '/main' // Redirects to /main if no matching route is found
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
