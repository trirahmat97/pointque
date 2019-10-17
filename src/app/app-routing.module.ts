import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthsComponent } from './auth/auths/auths.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from './auth/auth-guard';
import { NasabahComponent } from './admin/nasabah/nasabah.component';
import { GrafikComponent } from './grafik/grafik.component';
import { HistoryComponent } from './history/history.component';
import { AuthService } from './auth/auth.service';
import { SendComponent } from './send/send.component';
import { AdminSettingComponent } from './admin-setting/admin-setting.component';


const routes: Routes = [
  { path: '', component: AuthsComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'nasabah', component: NasabahComponent, canActivate: [AuthGuard] },
  { path: 'grafik', component: GrafikComponent, canActivate: [AuthGuard] },
  { path: 'history', component: HistoryComponent, canActivate: [AuthGuard] },
  { path: 'send', component: SendComponent, canActivate: [AuthGuard] },
  { path: 'setapp', component: AdminSettingComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
