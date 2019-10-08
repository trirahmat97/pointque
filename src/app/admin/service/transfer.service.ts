import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { MatSnackBar } from '@angular/material';
import { map } from 'rxjs/operators';
import { TransferData } from '../model/transfer-data.model';
import { Subject } from 'rxjs';

const BACKEND = environment.apiUrl + "/transfer/";
@Injectable({
  providedIn: 'root'
})
export class TransferService {

  private historyIn: TransferData[] = [];
  private historyOut: TransferData[] = [];
  private historyInUpdate = new Subject<{ message: TransferData[], maxInHistory: number }>();
  private historyOutUpdate = new Subject<{ message: TransferData[], maxOutHistory: number }>();

  constructor(
    private http: HttpClient,
    private _snackBar: MatSnackBar
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
          console.log(dataHistoryOut.maxOutHistory);
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
}
