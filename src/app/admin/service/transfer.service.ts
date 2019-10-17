import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { MatSnackBar } from '@angular/material';
import { map } from 'rxjs/operators';
import { TransferData } from '../model/transfer-data.model';
import { Subject } from 'rxjs';
import { PoitnData } from '../model/point-model';
import { Poitn2Data } from '../model/point2-model';
import { NasabahService } from './nasabah.service';
import { RewardModel } from '../model/reward.model';

const BACKEND = environment.apiUrl + "/transfer/";
const BACKEND_REWARD = environment.apiUrl + "/reward/";
const BACKEND_NASABAH = environment.apiUrl + "/nasabah/";
@Injectable({
  providedIn: 'root'
})
export class TransferService {

  private historyIn: TransferData[] = [];
  private historyOut: TransferData[] = [];
  private pointIn: Poitn2Data[] = [];
  private pointOut: Poitn2Data[] = [];
  private historyInUpdate = new Subject<{ message: TransferData[], maxInHistory: number }>();
  private historyOutUpdate = new Subject<{ message: TransferData[], maxOutHistory: number }>();
  private pointInByNorek = new Subject<{ message: any }>();
  private pointOutByNorek = new Subject<{ message: any }>();
  private dataInPoint = new Subject<{ message: any }>();
  private dataOutPoint = new Subject<{ message: any }>();
  private dataInPointNasabah = new Subject<{ message: any }>();
  name = '';

  //config define
  private dataInPointDefine = new Subject<{ message: any }>();
  private dataOutPointDefine = new Subject<{ message: any }>();


  //reward 
  private rewardData: RewardModel[] = [];
  private rewardSub = new Subject<{ message: RewardModel[], maxReward: number }>();

  constructor(
    private http: HttpClient,
    private _snackBar: MatSnackBar,
    private serviceNasabah: NasabahService
  ) { }

  transferPointque(sender: string, receiver: string, amount: number, pin: string, description: string) {
    const dataTransfer = {
      sender: sender,
      receiver: receiver,
      amount: amount,
      pin: pin,
      description: description
    }

    return this.http.post<{ responseCode: string, reponseDesc: string, message: string }>
      (BACKEND, dataTransfer)
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

  transferReward(norek: string, point: string, type: string) {
    const dataTransfer = {
      norek: norek,
      hadiah: 50000,
      point: point,
      type: type
    }

    return this.http.post<{ responseCode: string, reponseDesc: string, message: string }>
      (BACKEND_REWARD + 'send', dataTransfer)
      .pipe(
        map(resData => {
          console.log(resData);
          return {
            responseCode: resData.responseCode,
            responseDesc: resData.reponseDesc,
            message: resData.message
          }
        })
      )
  }

  getReward() {
    return this.http.get<{ responseCode: string, responseDesc: string, message: any, maxReward: number }>
      (BACKEND_REWARD + 'list')
      .pipe(
        map(resData => {
          return {
            responseCode: resData.responseCode,
            responseDesc: resData.responseDesc,
            message: resData.message.map(dt => {
              return {
                id: dt._id,
                norek: dt.norek,
                name: dt.name,
                hadiah: dt.hadiah,
                point: dt.point,
                type: dt.type
              }
            }),
            maxReward: resData.maxReward
          }
        })
      ).subscribe(transformedReward => {
        this.rewardData = transformedReward.message;
        this.rewardSub.next({
          message: [...this.rewardData],
          maxReward: transformedReward.maxReward
        })
      });
  }

  getRewardListener() {
    return this.rewardSub.asObservable();
  }


  transferOut(sender: string, receiver: string, receiverName: string, amount: number, pin: string, description: string) {
    const dataTransfer = {
      sender: sender,
      receiver: receiver,
      receiverName: receiverName,
      amount: amount,
      pin: pin,
      description: description
    }

    return this.http.post<{ responseCode: string, reponseDesc: string, message: string }>
      (BACKEND + 'tf/out', dataTransfer)
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

  historyTransferLimitByUserIn(receiver: string) {
    return this.http.get<{ responseCode: string, responseDesc: string, message: any }>
      (BACKEND + 'in/limit/' + receiver)
      .pipe(
        map(resData => {
          return {
            responseCode: resData.responseCode,
            responseDesc: resData.responseDesc,
            message: resData.message
          }
        })
      );
  }

  historyTransferLimitByUserOut(sender: string) {
    return this.http.get<{ responseCode: string, responseDesc: string, message: any }>
      (BACKEND + 'out/limit/' + sender)
      .pipe(
        map(resData => {
          return {
            responseCode: resData.responseCode,
            responseDesc: resData.responseDesc,
            message: resData.message
          }
        })
      );
  }

  getHistoryCountIn(receiver: string) {
    return this.http.get<{ responseCode: string, responseDesc: string, message: string }>
      (BACKEND + 'in/count/' + receiver)
      .pipe(
        map(resData => {
          return {
            responseCode: resData.responseCode,
            responseDesc: resData.responseDesc,
            message: resData.message
          }
        })
      );
  }
  getHistoryCountIn2(receiver: string) {
    return this.http.get<{ responseCode: string, responseDesc: string, message: string }>(BACKEND + 'in/count/' + receiver)
  }

  getHistoryCountOut(sender: string) {
    return this.http.get<{ responseCode: string, responseDesc: string, message: string }>
      (BACKEND + 'out/count/' + sender)
      .pipe(
        map(resData => {
          return {
            responseCode: resData.responseCode,
            responseDesc: resData.responseDesc,
            message: resData.message
          }
        })
      );
  }

  //get historyTransferInListByNorek
  historyTransferInListByNorek(norek: string, postsPerPage: number, currentPage: number) {
    const queryParams = `?norek=${norek}&pagesize=${postsPerPage}&page=${currentPage}`;
    this.http.get<{
      responseCode: string,
      responseDesc: string,
      message: any,
      maxInHistory: number
    }>(BACKEND + "in" + queryParams)
      .pipe(
        map(dataHistoryIn => {
          return {
            responseCode: dataHistoryIn.responseCode,
            responseDesc: dataHistoryIn.responseDesc,
            message: dataHistoryIn.message.map(nsb => {
              return {
                id: nsb._id,
                sender: nsb.sender,
                senderName: nsb.senderName,
                receiver: nsb.receiver,
                receiverName: nsb.receiverName,
                amount: nsb.amount,
                type: nsb.type,
                point: nsb.point,
                description: nsb.description,
                createdAt: nsb.createdAt
              }
            }),
            maxInHistory: dataHistoryIn.maxInHistory
          }
        })
      ).subscribe(transformedHistoryIn => {
        this.historyIn = transformedHistoryIn.message;
        this.historyInUpdate.next({
          message: [...this.historyIn],
          maxInHistory: transformedHistoryIn.maxInHistory
        })
      })
  }

  getTransferInListener() {
    return this.historyInUpdate.asObservable();
  }

  //get historyTransferOutListByNorek
  historyTransferOutListByNorek(norek: string, postsPerPage: number, currentPage: number) {
    const queryParams = `?norek=${norek}&pagesize=${postsPerPage}&page=${currentPage}`;
    this.http.get<{
      responseCode: string,
      responseDesc: string,
      message: any,
      maxOutHistory: number
    }>(BACKEND + "out" + queryParams)
      .pipe(
        map(dataHistoryOut => {
          return {
            responseCode: dataHistoryOut.responseCode,
            responseDesc: dataHistoryOut.responseDesc,
            message: dataHistoryOut.message.map(nsb => {
              return {
                id: nsb._id,
                sender: nsb.sender,
                senderName: nsb.senderName,
                receiver: nsb.receiver,
                receiverName: nsb.receiverName,
                amount: nsb.amount,
                type: nsb.type,
                point: nsb.point,
                description: nsb.description,
                createdAt: nsb.createdAt
              }
            }),
            maxOutHistory: dataHistoryOut.maxOutHistory
          }
        })
      ).subscribe(transformedHistoryOut => {
        this.historyOut = transformedHistoryOut.message;
        this.historyOutUpdate.next({
          message: [...this.historyOut],
          maxOutHistory: transformedHistoryOut.maxOutHistory
        })
      })
  }

  getTransferOutListener() {
    return this.historyOutUpdate.asObservable();
  }

  getInSumPointMountByNorek(norek: string) {
    const queryNorek = `?norek=${norek}`;
    return this.http.get<{
      responseCode: string,
      responseDesc: string,
      message: any
    }>(BACKEND + 'in/history/counts' + queryNorek)
      .pipe(
        map(resData => {
          return {
            responseCode: resData.responseCode,
            responseDesc: resData.responseDesc,
            message: resData.message.map(dataRes => {
              return {
                _id: dataRes._id,
                point: dataRes.point
              }
            })
          }
        })
      ).subscribe(dataPoint => {
        this.pointIn = dataPoint.message;
        let point;
        if (this.pointIn.length != 0) {
          point = this.pointIn[0].point;
        } else {
          point = 0;
        }
        this.pointInByNorek.next({
          message: point
        });
      });
  }

  getInSumPointMountByNorekListener() {
    return this.pointInByNorek.asObservable();
  }

  getOutSumPointMountByNorek(norek: string) {
    const queryNorek = `?norek=${norek}`;
    return this.http.get<{
      responseCode: string,
      responseDesc: string,
      message: any
    }>(BACKEND + 'out/history/counts' + queryNorek)
      .pipe(
        map(resData => {
          return {
            responseCode: resData.responseCode,
            responseDesc: resData.responseDesc,
            message: resData.message.map(dataRes => {
              return {
                _id: dataRes._id,
                point: dataRes.point
              }
            })
          }
        })
      ).subscribe(dataPoint => {
        this.pointOut = dataPoint.message;
        let point;
        if (this.pointOut.length != 0) {
          point = this.pointOut[0].point;
        } else {
          point = 0;
          // console.log('point 0');
        }
        this.pointOutByNorek.next({
          message: point
        });
      });
  }

  getOutSumPointMountByNorekListener() {
    return this.pointOutByNorek.asObservable();
  }

  getInPointAll() {
    return this.http.get<{
      responseCode: string,
      responseDesc: string,
      message: any
    }>(BACKEND + '/in/history/all/counts')
      .pipe(map(resData => {
        return {
          responseCode: resData.responseCode,
          responseDesc: resData.responseDesc,
          message: resData.message.map(dataPoint => {
            return {
              _id: dataPoint._id._id,
              name: dataPoint._id.name[0],
              point: dataPoint.point
            }
          })
        }
      })).subscribe(dataPoint => {
        // console.log(dataPoint.message)
        this.dataInPoint.next({
          message: dataPoint.message
        });
      })
  }

  getOutPointAll() {
    return this.http.get<{
      responseCode: string,
      responseDesc: string,
      message: any
    }>(BACKEND + '/out/history/all/counts')
      .pipe(map(resData => {
        return {
          responseCode: resData.responseCode,
          responseDesc: resData.responseDesc,
          message: resData.message.map(dataPoint => {
            return {
              _id: dataPoint._id._id,
              name: dataPoint._id.name[0],
              point: dataPoint.point
            }
          })
        }
      })).subscribe(dataPoint => {
        // console.log(dataPoint);
        this.dataOutPoint.next({
          message: dataPoint.message
        });
      })
  }

  getInPointAllListener() {
    return this.dataInPoint.asObservable();

  }

  getOutPointAllListener() {
    return this.dataOutPoint.asObservable();
  }


  getInPointAllDefine(date: Date) {
    const data = {
      date: date
    }
    return this.http.post<{
      responseCode: string,
      responseDesc: string,
      message: any
    }>(BACKEND + '/in/history/all/counts/define', data)
      .pipe(map(resData => {
        return {
          responseCode: resData.responseCode,
          responseDesc: resData.responseDesc,
          message: resData.message.map(dataPoint => {
            return {
              _id: dataPoint._id._id,
              name: dataPoint._id.name[0],
              point: dataPoint.point
            }
          })
        }
      }))
  }

  getOutPointAllDefine(date: Date) {
    const data = {
      date: date
    }
    return this.http.post<{
      responseCode: string,
      responseDesc: string,
      message: any
    }>(BACKEND + '/out/history/all/counts/define', data)
      .pipe(map(resData => {
        return {
          responseCode: resData.responseCode,
          responseDesc: resData.responseDesc,
          message: resData.message.map(dataPoint => {
            return {
              _id: dataPoint._id._id,
              name: dataPoint._id.name[0],
              point: dataPoint.point
            }
          })
        }
      }))
  }

  getInPointAllListenerDefine() {
    return this.dataInPointDefine.asObservable();

  }

  getOutPointAllListenerDefine() {
    return this.dataOutPointDefine.asObservable();
  }
}
