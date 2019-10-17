import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { NasabahData } from '../model/nasabah-data.model';

import { map } from 'rxjs/operators';
import { Subject } from 'rxjs';

const BACKEND_URL = environment.apiUrl + "/nasabah/";
const BACKEND_URL_OTHER = environment.apiUrl + "/nasabah/";

@Injectable({
  providedIn: 'root'
})
export class NasabahService {

  constructor(private http: HttpClient) { }

  private nasabah: NasabahData[] = [];
  private nasabahUpdate = new Subject<{ message: NasabahData[], nasabahAccout: number }>();

  getNasabah(postsPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;
    this.http.get<{
      responseCode: string,
      responseDesc: string,
      message: any,
      maxNasabah: number
    }>(BACKEND_URL + queryParams)
      .pipe(
        map(dataNasabah => {
          return {
            responseCode: dataNasabah.responseCode,
            responseDesc: dataNasabah.responseDesc,
            message: dataNasabah.message.map(nsb => {
              return {
                id: nsb._id,
                totalPoint: nsb.totalPoint,
                status: nsb.status,
                email: nsb.email,
                nik: nsb.nik,
                name: nsb.name,
                address: nsb.address,
                gender: nsb.gender,
                phone: nsb.phone,
                norek: nsb.norek
              }
            }),
            maxNasabah: dataNasabah.maxNasabah
          }
        })
      ).subscribe(transformedNasabah => {
        this.nasabah = transformedNasabah.message;
        this.nasabahUpdate.next({
          message: [...this.nasabah],
          nasabahAccout: transformedNasabah.maxNasabah
        })
      })
  }

  getNasabahById(norek: string) {
    return this.http.get<{ responseCode: string, responseDesc: string, message: any }>
      (BACKEND_URL + 'getNasabah/' + norek).pipe(map(resData => {
        return {
          responseCode: resData.responseCode,
          responseDesc: resData.responseDesc,
          message: resData.message
        }
      }))
  }

  getNasabahNorekPin(norek: string, pin: string) {
    const data = {
      norek: norek,
      pin: pin
    }
    return this.http.post<{ responseCode: string, responseDesc: string, message: any }>
      (BACKEND_URL + '/check', data).pipe(map(resData => {
        return {
          responseCode: resData.responseCode,
          responseDesc: resData.responseDesc,
          message: resData.message
        }
      }));
  }

  getNasabahByUserId(userId: string) {
    return this.http.get<{ responseCode: string, responseDesc: string, message: any }>
      (BACKEND_URL + 'user/' + userId).pipe(map(resData => {
        return {
          responseCode: resData.responseCode,
          responseDesc: resData.responseDesc,
          message: resData.message
        }
      }))
  }

  getNasabahById2(norek: string) {
    return this.http.get<{ responseCode: string, responseDesc: string, message: any }>
      (BACKEND_URL + 'getNasabah/' + norek);
  }

  getNasabahListener() {
    return this.nasabahUpdate.asObservable();
  }

  updateStatusNasabah(norek: string, status: string) {
    const updateStatus = {
      norek: norek,
      status: status
    }
    return this.http.put<{ responseCode: string, responseDesc: string, message: string }>
      (
        BACKEND_URL + 'status', updateStatus
      ).pipe(
        map(resData => {
          return {
            responseCode: resData.responseCode,
            responseDesc: resData.responseDesc,
            message: resData.message
          }
        })
      );
  }

}
