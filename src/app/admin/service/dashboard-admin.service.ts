import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { NasabahData } from '../model/nasabah-data.model';
import { Subject } from 'rxjs';

const BACKEND_URL = environment.apiUrl + "/nasabah/";

@Injectable({
  providedIn: 'root'
})
export class DashboardAdminService {
  private nasabah: NasabahData[] = [];
  private nasabahUpdate = new Subject<{ message: NasabahData[] }>();

  constructor(private http: HttpClient) { }

  getNasabah() {
    this.http.get<{
      responseCode: string,
      responseDesc: string,
      message: any
    }>(BACKEND_URL + 'maxNasabah')
      .pipe(
        map(dataNasabah => {
          return {
            responseCode: dataNasabah.responseCode,
            responseDesc: dataNasabah.responseDesc,
            message: dataNasabah.message.map(nsb => {
              return {
                id: nsb._id,
                totalPoint: nsb.totalPoint,
                nik: nsb.nik,
                name: nsb.name,
                norek: nsb.norek
              }
            }),
          }
        })
      ).subscribe(transformedNasabah => {
        this.nasabah = transformedNasabah.message;
        this.nasabahUpdate.next({
          message: [...this.nasabah]
        })
      })
  }

  getNasabahListener() {
    return this.nasabahUpdate.asObservable();
  }
}
