import { Component, OnInit, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator, MatSlideToggleChange, MatSnackBar } from '@angular/material';
// import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { TransferData } from '../admin/model/transfer-data.model';
import { TransferService } from '../admin/service/transfer.service';
import { NasabahService } from '../admin/service/nasabah.service';
import { Subscription } from 'rxjs';
import { PoitnData } from '../admin/model/point-model';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit, AfterViewInit, OnDestroy {

  constructor(
    private serviceNasabah: NasabahService,
    private transferService: TransferService
  ) { }

  setBulanan = 100;
  setTahunan = 1200;

  //poitn
  progress = 0;
  timer: number;

  //point
  dataPointTotal = 0;
  dataPointInSub: Subscription;
  dataPointOutSub: Subscription;
  totalPointByMount = 0;
  totalPointByYear = 0;

  //history in
  dataHistoryIn: TransferData[] = [];
  dataHistoryInSub: Subscription;
  displayColumnsIn = ['sender', 'rekeningin', 'amountin', 'point', 'datein', 'bank'];
  dataSourceIn = new MatTableDataSource<TransferData>();

  //config tabel
  @ViewChild(MatSort, { static: false }) sortin: MatSort;
  @ViewChild(MatPaginator, { static: false }) paginatorin: MatPaginator;

  totalPostIn = 2;
  postPerPageIn = 0;
  currentPageIn = 1;
  pageSizeOptionIn = [5, 10, 25, 100];

  isLoading = false;

  userId2 = localStorage.getItem("userId");
  norek = '';
  name = '';

  ngOnInit() {
    this.serviceNasabah.getNasabahByUserId(this.userId2).subscribe(resData => {
      this.norek = resData.message.norek;
      this.name = resData.message.name;
      this.transferService.historyTransferInListByNorek(this.norek, this.postPerPageIn, this.currentPageIn);
      this.dataHistoryInSub = this.transferService.getTransferInListener()
        .subscribe((resDataHistoryIn: { message: TransferData[], maxInHistory: number }) => {
          this.dataHistoryIn = resDataHistoryIn.message;
          this.dataSourceIn.data = this.dataHistoryIn.slice();
        });
      this.dataHistoryInSub = this.transferService.getInSumPointMountByNorek(this.norek);
      this.dataHistoryInSub = this.transferService.getOutSumPointMountByNorek(this.norek);
      this.dataPointInSub = this.transferService.getInSumPointMountByNorekListener()
        .subscribe((resPointIn: { message: number }) => {
          this.dataPointOutSub = this.transferService.getOutSumPointMountByNorekListener()
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
  }

  doFilterIn(filterValue: string) {
    this.dataSourceIn.filter = filterValue.trim().toLowerCase();
  }


  ngAfterViewInit() {
    this.dataSourceIn.sort = this.sortin;
    this.dataSourceIn.paginator = this.paginatorin;
  }

  ngOnDestroy() {
    this.dataHistoryInSub.unsubscribe();
    this.dataHistoryInSub.unsubscribe();
    // this.dataPointOutSub.unsubscribe();
  }
}
