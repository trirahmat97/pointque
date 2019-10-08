import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {

  userIsAuthenticated = false;
  title = 'int-bank';
  private authListenerSubs: Subscription;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.authListenerSubs = this.authService.getAuthStatusListener().subscribe(isAuthentication => {
      this.userIsAuthenticated = isAuthentication.status;
    });
    this.authService.autoAuthUser();
  }

  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
  }
}
