import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { NasabahService } from 'src/app/admin/service/nasabah.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  level = localStorage.getItem("level");
  // private userId2 = localStorage.getItem("userId");
  userId = '';
  private userId2 = localStorage.getItem("userId");
  //config rofile
  name = '';
  point = '';

  notif = '';

  private authListenerSub: Subscription;
  @Output() sidenavToggle = new EventEmitter<void>();
  constructor(
    private authService: AuthService,
    private serviceNasabah: NasabahService
  ) { }

  ngOnInit() {
    setTimeout(() => {
      this.notif = '1';
    }, 3000)
  }

  setClick() {
    setTimeout(() => {
      this.notif = '';
    }, 10000)
  }

  onToggleSidenav() {
    this.authListenerSub = this.authService.getAuthStatusListener().subscribe(result => {
      this.level = result.level;
      this.serviceNasabah.getNasabahByUserId(this.userId2).subscribe(resData => {
        this.name = resData.message.name;
        this.point = resData.message.totalPoint;
      });
    });
    this.authService.autoAuthUser();
    this.sidenavToggle.emit();
  }

  ngOnDestroy() {
    this.authListenerSub.unsubscribe()
  }

}
