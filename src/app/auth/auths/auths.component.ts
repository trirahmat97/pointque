import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-auths',
  templateUrl: './auths.component.html',
  styleUrls: ['./auths.component.css']
})
export class AuthsComponent implements OnInit, OnDestroy {
  hide: Boolean;
  formLogin: FormGroup;
  isLoading = false;
  private authSub: Subscription;
  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.hide = true;
    this.formLogin = new FormGroup({
      email: new FormControl('', { validators: [Validators.required, Validators.email] }),
      password: new FormControl('', { validators: [Validators.required] })
    });
    this.authSub = this.authService.getAuthStatusListener().subscribe(resDara => {
      this.isLoading = false;
      this.formLogin.reset();
    });
  }

  onLogin() {
    if (this.formLogin.invalid) {
      return false;
    }
    this.isLoading = true;
    this.authService.login(this.formLogin.value.email, this.formLogin.value.password);
  }


  ngOnDestroy() {
    // this.authSub.unsubscribe();
  }

}
