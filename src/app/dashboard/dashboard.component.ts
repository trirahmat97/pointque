import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatSlideToggleChange } from '@angular/material';
import { DashboardAdminService } from '../admin/service/dashboard-admin.service';
import { NasabahData } from '../admin/model/nasabah-data.model';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { NasabahService } from '../admin/service/nasabah.service';
import { TransferService } from '../admin/service/transfer.service';
import { TransferData } from '../admin/model/transfer-data.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {

  //config data nasbah
  dataNasabah: NasabahData[] = [];
  private nasabahSub: Subscription;

  //config pointQ
  checked = false;
  setBulanan = 100;
  setTahunan = 1200;

  //config auth
  level = '';
  valuePoint = 300;
  private dataUser = '';
  private historyIn: TransferData[] = [];
  private historyOut: TransferData[] = [];
  totalHistoryIn = '';
  totalHistoryOut = '';
  private dataIsAuth: Subscription;
  private userId2 = localStorage.getItem("userId");


  //point
  progress = 0;
  timer: number;

  //point
  dataPointTotal = 0;
  dataPointInSub: Subscription;
  dataPointOutSub: Subscription;
  totalPointByMount = 0;
  totalPointByYear = 0;

  constructor(
    private serviceDashboard: DashboardAdminService,
    private authService: AuthService,
    private serviceNasabah: NasabahService,
    private serviceTransfer: TransferService
  ) { }

  ngOnInit() {
    this.dataIsAuth = this.authService.getAuthStatusListener().subscribe(result => {
      this.level = result.level;
    });
    this.serviceNasabah.getNasabahByUserId(this.userId2).subscribe(resData => {
      this.dataUser = resData.message;
      this.serviceTransfer.historyTransferLimitByUserIn(resData.message.norek).subscribe(resDataIn => {
        this.historyIn = resDataIn.message;
      });
      this.serviceTransfer.historyTransferLimitByUserOut(resData.message.norek).subscribe(resDataOut => {
        this.historyOut = resDataOut.message;
      });
      this.serviceTransfer.getHistoryCountIn(resData.message.norek).subscribe(resDataHisIn => {
        this.totalHistoryIn = resDataHisIn.message;
      });
      this.serviceTransfer.getHistoryCountOut(resData.message.norek).subscribe(resDataHisOut => {
        this.totalHistoryOut = resDataHisOut.message;
      });

      this.serviceTransfer.getInSumPointMountByNorek(resData.message.norek);
      this.serviceTransfer.getOutSumPointMountByNorek(resData.message.norek);
      this.dataPointInSub = this.serviceTransfer.getInSumPointMountByNorekListener()
        .subscribe((resPointIn: { message: number }) => {
          this.dataPointOutSub = this.serviceTransfer.getOutSumPointMountByNorekListener()
            .subscribe((resPointOut: { message: number }) => {
              const dataPoint = resPointIn.message + resPointOut.message;
              if (dataPoint >= 0) {
                this.totalPointByMount = dataPoint;
              } else {
                this.totalPointByMount = 0;
              }
            });
        });
      this.totalPointByYear = resData.message.totalPoint;
    });
    this.authService.autoAuthUser();
    this.nasabahSub = this.serviceDashboard.getNasabahListener().subscribe((nasabahData: { message: NasabahData[] }) => {
      this.dataNasabah = nasabahData.message;
      console.log(nasabahData.message);
    });
    this.serviceDashboard.getNasabah();
  }

  onChange(value: MatSlideToggleChange) {
    return this.checked = value.checked;
  }

  ngOnDestroy() {
  }
}
