import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigReward } from '../model/config-reward.model';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';


const BACKEND_URL = environment.apiUrl + "/configReward/";

@Injectable({
  providedIn: 'root'
})
export class ConfigRewardService {

  constructor(
    private http: HttpClient
  ) { }

  private configReward: ConfigReward[] = [];
  private configRewardUpdate = new Subject<{ message: ConfigReward[], maxConfigReward: number }>();

  getNasabah(postsPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;
    this.http.get<{
      responseCode: string,
      responseDesc: string,
      message: any,
      maxConfigReward: number
    }>(BACKEND_URL + 'list' + queryParams)
      .pipe(
        map(dataConfigReward => {
          return {
            responseCode: dataConfigReward.responseCode,
            responseDesc: dataConfigReward.responseDesc,
            message: dataConfigReward.message.map(nsb => {
              return {
                id: nsb._id,
                name: nsb.name,
                jumlah: nsb.jumlah,
                point: nsb.point,
                hadiah: nsb.hadiah,
                type: nsb.type,
                status: nsb.status
              }
            }),
            maxConfigReward: dataConfigReward.maxConfigReward
          }
        })
      ).subscribe(transformedConfigReward => {
        this.configReward = transformedConfigReward.message;
        this.configRewardUpdate.next({
          message: [...this.configReward],
          maxConfigReward: transformedConfigReward.maxConfigReward
        })
      })
  }

  getRewardhListener() {
    return this.configRewardUpdate.asObservable();
  }
}
