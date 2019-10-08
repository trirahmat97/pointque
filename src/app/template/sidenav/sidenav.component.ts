import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { NasabahService } from 'src/app/admin/service/nasabah.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit, OnDestroy {

  level = '';
  userId = '';
  private userId2 = localStorage.getItem("userId");
  //config rofile
  name = '';
  private authListenerSub: Subscription;

  @Output() closeSidenav = new EventEmitter<void>();
  constructor(
    private authService: AuthService,
    private serviceNasabah: NasabahService
  ) { }

  ngOnInit() {
    this.authListenerSub = this.authService.getAuthStatusListener().subscribe(result => {
      this.level = result.level;
      this.serviceNasabah.getNasabahByUserId(this.userId2).subscribe(resData => {
        this.name = resData.message.name;
      });
    });
    this.authService.autoAuthUser();

  }

  onClose() {
    this.closeSidenav.emit();
  }

  onLogout() {
    this.authService.onLogout();
  }

  ngOnDestroy() {
    this.authListenerSub.unsubscribe()
  }
}
