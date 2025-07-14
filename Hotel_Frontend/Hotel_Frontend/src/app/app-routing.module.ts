import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component'; 
import { DashboardComponent } from './dashboard/dashboard.component';
import { BookingsComponent } from './bookings/bookings.component';
import { AuthGuardService } from './services/auth-guard.service';
import { RoomComponent } from './room/room.component';
import { ReservationComponent } from './reservation/reservation.component';
import { AddRoomComponent } from './add-room/add-room.component';
import { AuthGuardAdminService } from './services/auth-guard-admin.service';
import { EditRoomComponent } from './edit-room/edit-room.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'hotel', component: DashboardComponent, canActivate: [AuthGuardService] },
  { path: 'booking', component: BookingsComponent, canActivate: [AuthGuardService] },
  { path: 'room', component: RoomComponent, canActivate: [AuthGuardAdminService] },
  { path: 'reservation', component: ReservationComponent, canActivate: [AuthGuardAdminService] },
  { path: 'new', component: AddRoomComponent, canActivate: [AuthGuardAdminService] },
  { path: 'edit/:id', component: EditRoomComponent, canActivate: [AuthGuardAdminService] },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
