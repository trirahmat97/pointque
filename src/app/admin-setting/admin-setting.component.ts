import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { NasabahService } from '../admin/service/nasabah.service';
import { TransferService } from '../admin/service/transfer.service';
import { PoitnData } from '../admin/model/point-model';
import { Subscription } from 'rxjs';
import { Poitn2Data } from '../admin/model/point2-model';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { FormGroup, FormControl, Validators, NgForm } from '@angular/forms';

import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';

import * as _moment from 'moment';
import { Moment } from 'moment';
import { Route, Router } from '@angular/router';
import { RewardModel } from '../admin/model/reward.model';

const moment = _moment;

export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-admin-setting',
  templateUrl: './admin-setting.component.html',
  styleUrls: ['./admin-setting.component.css'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class AdminSettingComponent implements OnInit, AfterViewInit, OnDestroy {

  //set
  setBulan = 50;

  dataPointInAll: Poitn2Data[] = [];
  dataPointOutAll: Poitn2Data[] = [];
  private dataPointInAllSub: Subscription;
  private dataPointOutAllSub: Subscription;
  private dataSorting = [];
  private dataSorting3 = [];
  private dataSorting2: Poitn2Data[] = [];

  //table
  displayColumnsSearch = ['name2', 'point2'];
  displayColumns = ['norek', 'point'];
  dataSource = new MatTableDataSource<PoitnData>();
  dataSource2 = new MatTableDataSource<PoitnData>();
  @ViewChild(MatSort, { static: false }) sortin: MatSort;
  @ViewChild(MatPaginator, { static: false }) paginatorin: MatPaginator;

  totalPostIn = 2;
  postPerPageIn = 0;
  currentPageIn = 1;
  pageSizeOptionIn = [5, 10, 25, 100];

  setBulanan3 = 1;
  setBulanan2 = 5;
  setBulanan1 = 10;
  formSearch: FormGroup;
  date = new FormControl(moment());


  //consfig random reward mount
  dataSearchPoint = true;
  dataSearchReward = true;
  dataPointInAllDefine: Poitn2Data[] = [];
  dataPointOutAllDefine: Poitn2Data[] = [];
  private dataSortingDefine = [];
  private dataSortingSameDefine = [];

  rewardSub: Subscription;

  constructor(
    private serviceNasabah: NasabahService,
    private serviceTransfer: TransferService,
    private router: Router
  ) { }


  ngOnInit() {
    this.serviceTransfer.getInPointAll();
    this.serviceTransfer.getOutPointAll();
    this.getDataNasabahPoint();
    this.formSearch = new FormGroup({
      point: new FormControl(this.setBulan, { validators: [Validators.required] }),
      jumlah: new FormControl(null, { validators: [Validators.required] }),
      date: new FormControl(moment()),
      reward: new FormControl(false),
    });
    this.serviceTransfer.getReward();
    this.rewardSub = this.serviceTransfer.getRewardListener()
      .subscribe((rewardData: { message: RewardModel[], maxReward: number }) => {
        // console.log(rewardData.message);
        if (rewardData.message.length > 0) {
          this.dataSearchReward = false;
        }
      });
  }

  //filter point
  onSend() {
    const totalPoint = this.formSearch.value.point;
    const totalReward = this.formSearch.value.jumlah;
    const reward = this.formSearch.value.reward;
    let type = 'bulanan';
    let hadiahPemenang: 50000;

    const date = new Date(this.formSearch.value.date);
    this.serviceTransfer.getInPointAllDefine(date)
      .subscribe((resDataIn) => {
        this.dataPointInAllDefine = resDataIn.message;
        this.serviceTransfer.getOutPointAllDefine(date)
          .subscribe((resDataOut) => {
            this.dataPointOutAllDefine = resDataOut.message;
            for (let i = 0; i < this.dataPointInAllDefine.length; i++) {
              for (let j = 0; j < this.dataPointOutAllDefine.length; j++) {
                if (this.dataPointInAllDefine[i]._id == this.dataPointOutAllDefine[j]._id) {
                  this.dataPointInAllDefine[i].point = this.dataPointInAllDefine[i].point + this.dataPointOutAllDefine[j].point;
                  this.dataSortingDefine.push(this.dataPointInAllDefine[i]);
                } else {
                  this.dataSortingDefine.push(this.dataPointInAllDefine[i]);
                }
              }
            }
            const dataJadi = new Set(this.dataSortingDefine)
            const dataJadi2 = [...dataJadi];
            for (let u = 0; u < dataJadi2.length; u++) {
              if (dataJadi2[u].point >= totalPoint) {
                this.dataSortingSameDefine.push(dataJadi2[u]);
              }
            }

            if (reward == false) {
              this.dataSource2.data = this.dataSortingSameDefine.slice();
              const data = new Set(this.dataSource2.data);
              const dataCari = [...data];
              const tampungPemenang = [];
              if (dataCari.length >= totalReward) {
                for (let a = 0; a < totalReward; a++) {
                  let aa = dataCari[Math.floor(Math.random() * dataCari.length)];
                  tampungPemenang.push(aa);
                  for (var i = 0; i < dataCari.length; i++) {
                    if (dataCari[i] === aa) {
                      dataCari.splice(i, 1);
                    }
                  }
                }
              }
              this.dataSource2.data = tampungPemenang.slice();
              this.dataSearchPoint = false;
              this.formSearch.reset();
              this.formSearch.setValue({
                point: null,
                jumlah: null,
                date: moment(),
                reward: false
              });
            } else {
              // console.log('kirim');
              this.dataSource2.data = this.dataSortingSameDefine.slice();
              const data = new Set(this.dataSource2.data);
              const dataCari = [...data];
              const tampungPemenang = [];
              if (dataCari.length >= totalReward) {
                for (let a = 0; a < totalReward; a++) {
                  let aa = dataCari[Math.floor(Math.random() * dataCari.length)];
                  tampungPemenang.push(aa);
                  for (var i = 0; i < dataCari.length; i++) {
                    if (dataCari[i] === aa) {
                      dataCari.splice(i, 1);
                    }
                  }
                }
              }

              for (var x = 0; x < tampungPemenang.length; x++) {
                this.serviceTransfer.transferReward(
                  tampungPemenang[x]._id,
                  tampungPemenang[x].point,
                  type
                ).subscribe(data => {
                });
              }
              this.dataSource2.data = tampungPemenang.slice();
              this.dataSearchPoint = true;
              this.formSearch.reset();
              this.formSearch.setValue({
                point: this.setBulan,
                jumlah: null,
                date: moment(),
                reward: false
              });
              location.reload();
            }
          });
      });
  }

  //find point
  private getDataNasabahPoint() {
    this.dataPointInAllSub = this.serviceTransfer.getInPointAllListener()
      .subscribe((resDataIn: { message: any }) => {
        this.dataPointInAll = resDataIn.message;
        this.dataPointOutAllSub = this.serviceTransfer.getOutPointAllListener()
          .subscribe((resDataOut: { message: any }) => {
            this.dataPointOutAll = resDataOut.message;
            for (let i = 0; i < this.dataPointInAll.length; i++) {
              for (let j = 0; j < this.dataPointOutAll.length; j++) {
                if (this.dataPointInAll[i]._id == this.dataPointOutAll[j]._id) {
                  this.dataPointInAll[i].point = this.dataPointInAll[i].point + this.dataPointOutAll[j].point;
                  this.dataSorting.push(this.dataPointInAll[i]);
                } else {
                  this.dataSorting.push(this.dataPointInAll[i]);
                }
              }
            }
            const dataJadi = new Set(this.dataSorting)
            const dataJadi2 = [...dataJadi];
            for (let u = 0; u < dataJadi2.length; u++) {
              if (dataJadi2[u].point >= this.setBulan) {
                this.dataSorting3.push(dataJadi2[u]);
              }
            }

            this.dataSource.data = this.dataSorting3.slice();
          });

      });
  }


  doFilterIn(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  //date
  chosenYearHandler(normalizedYear: Moment) {
    const ctrlValue = this.date.value;
    ctrlValue.year(normalizedYear.year());
    this.date.setValue(ctrlValue);
  }

  chosenMonthHandler(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.date.value;
    ctrlValue.month(normalizedMonth.month());
    this.date.setValue(ctrlValue);
    datepicker.close();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sortin;
    this.dataSource.paginator = this.paginatorin;
  }

  ngOnDestroy() {
    this.dataPointInAllSub.unsubscribe();
    this.dataPointOutAllSub.unsubscribe();
    // this.rewardSub.unsubscribe();
  }
}
