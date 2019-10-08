import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { Subscription } from 'rxjs';
import { NasabahService } from 'src/app/admin/service/nasabah.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit, OnDestroy {

  level = '';
  userId = '';
  private userId2 = localStorage.getItem("userId");
  //config rofile
  name = '';

  private authListenerSub: Subscription;

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

  onLogout() {
    this.authService.onLogout();
  }

  ngOnDestroy() {
    this.authListenerSub.unsubscribe()
  }
}
