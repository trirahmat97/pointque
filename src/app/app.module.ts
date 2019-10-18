import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MaterialModule } from './material.module';
import { FlexLayoutModule } from '@angular/flex-layout';

import { AuthsComponent } from './auth/auths/auths.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './auth/auth-interceptor';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HeaderComponent } from './template/header/header.component';
import { SidenavComponent } from './template/sidenav/sidenav.component';
import { MenuComponent } from './template/menu/menu.component';
import { NasabahComponent } from './admin/nasabah/nasabah.component';
import { GrafikComponent } from './grafik/grafik.component';
import { HistoryComponent } from './history/history.component';
import { SendComponent } from './send/send.component';
import { ErrorComponent } from './error/error.component';
import { ErrorInterceptor } from './error.interceptor';
import { FooterComponent } from './template/footer/footer.component';
import { OutComponent } from './history/out/out.component';
import { AdminSettingComponent } from './admin-setting/admin-setting.component';
import { ReplacePipe } from './admin/pipe/replace.pipe';
import { ListRewardComponent } from './admin/config/list-reward/list-reward.component';
import { PointMaxMountComponent } from './point-max-mount/point-max-mount.component';
import { DataRewardComponent } from './data-reward/data-reward.component';

@NgModule({
  declarations: [
    AppComponent,
    AuthsComponent,
    DashboardComponent,
    HeaderComponent,
    SidenavComponent,
    MenuComponent,
    NasabahComponent,
    GrafikComponent,
    HistoryComponent,
    SendComponent,
    ErrorComponent,
    FooterComponent,
    OutComponent,
    AdminSettingComponent,
    ReplacePipe,
    ListRewardComponent,
    PointMaxMountComponent,
    DataRewardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  ],
  bootstrap: [AppComponent],
  entryComponents: [ErrorComponent]
})
export class AppModule { }
