import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from './auth-data.model';
import { Subject } from 'rxjs';
import { Route, Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private hostUrl = "http://localhost:3000/api/int-bank/nasabah/login";
  private token: string;
  private authStatusListener = new Subject<{ level: string, status: boolean, userId: string }>();
  private isAuthenticatted = false;
  private tokenTimer: any;

  constructor(private http: HttpClient, private router: Router) { }

  getToken() {
    return this.token;
  }

  getIsAuth() {
    return this.isAuthenticatted;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  login(email: string, password: string) {
    const authData: AuthData = { email: email, password: password };
    this.http.post<{
      responseCode: string,
      responseDesc: string,
      message: any
    }>(this.hostUrl, authData).subscribe(result => {
      const token = result.message.token;
      this.token = token;
      // console.log(result);
      if (token) {
        const expiredInDuration = result.message.expiredIn;
        this.setAuthTimer(expiredInDuration);
        const now = new Date();
        const expirationDate = new Date(now.getTime() + expiredInDuration * 1000);
        this.saveAuthData(token, result.message.status, result.message.level, expirationDate, result.message.userId);
        this.isAuthenticatted = true;
        this.authStatusListener.next({
          level: result.message.level,
          status: true,
          userId: result.message.userId
        });
        this.router.navigate(['/dashboard'])
      }
    }, err => {
      this.authStatusListener.next({
        level: null,
        status: false,
        userId: null
      });
    })
  }

  private setAuthTimer(duration: number) {
    // console.log("setting timer: " + duration);
    this.tokenTimer = setTimeout(() => {
      this.onLogout();
    }, duration * 1000);
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const expiredIn = authInformation.expirationDate.getTime() - now.getTime();
    if (expiredIn > 0) {
      this.token = authInformation.token;
      this.isAuthenticatted = true;
      this.setAuthTimer(expiredIn / 1000);
      this.authStatusListener.next({
        level: authInformation.level,
        status: true,
        userId: authInformation.userId
      });
    }
  }

  onLogout() {
    this.token = null;
    this.isAuthenticatted = false;
    this.authStatusListener.next({
      level: null,
      status: false,
      userId: null
    });
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(['/']);
  }

  private saveAuthData(token: string, status: string, level: string, expirationDate: Date, userId: string) {
    localStorage.setItem("token", token);
    localStorage.setItem("status", status);
    localStorage.setItem("level", level);
    localStorage.setItem("expirationDate", expirationDate.toISOString());
    localStorage.setItem("userId", userId);
  }

  private clearAuthData() {
    localStorage.removeItem("token");
    localStorage.removeItem("status");
    localStorage.removeItem("level");
    localStorage.removeItem("expirationDate");
    localStorage.removeItem("userId");
  }

  private getAuthData() {
    const token = localStorage.getItem("token");
    const expirationDate = localStorage.getItem("expirationDate");
    const level = localStorage.getItem("level");
    const status = localStorage.getItem("status");
    const userId = localStorage.getItem("userId");
    if (!token || !expirationDate || !level || !status) {
      return;
    } else {
      return {
        token: token,
        expirationDate: new Date(expirationDate),
        level: level,
        status: status,
        userId: userId
      }
    }
  }
}
