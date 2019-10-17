import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

const BACKEND_NASABAH_OTHER = environment.apiUrl + "/nasabahOther/";
const BACKEND_TRANSFER_OTHER = environment.apiUrl + "/transferOther/";
@Injectable({
  providedIn: 'root'
})
export class OtherService {

  constructor(
    private http: HttpClient
  ) { }

  //other
  inquryNasabah(norek: string) {
    return this.http.get<{ responseCode: string, responseDesc: string, message: any }>
      (BACKEND_NASABAH_OTHER + 'getNasabah/' + norek)
      .pipe(map(resData => {
        return {
          responseCode: resData.responseCode,
          responseDesc: resData.responseDesc,
          message: resData.message
        }
      }));
  }

  transfer(sender: string, senderName: string, receiver: string, amount: number, description: string) {
    const dataTransfer = {
      sender: sender,
      senderName: senderName,
      receiver: receiver,
      amount: amount,
      description: description
    }

    return this.http.post<{ responseCode: string, reponseDesc: string, message: string }>
      (BACKEND_TRANSFER_OTHER + 'in', dataTransfer)
      .pipe(
        map(resData => {
          return {
            responseCode: resData.responseCode,
            responseDesc: resData.reponseDesc,
            message: resData.message
          }
        })
      )
  }
}
