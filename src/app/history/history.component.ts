import { Component, OnInit, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator, MatSlideToggleChange, MatSnackBar } from '@angular/material';
// import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { TransferData } from '../admin/model/transfer-data.model';
import { TransferService } from '../admin/service/transfer.service';
import { NasabahService } from '../admin/service/nasabah.service';
import { Subscription } from 'rxjs';

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

  //poitn
  progress = 0;
  timer: number;

  //history in
  dataHistoryIn: TransferData[] = [];
  dataHistoryInSub: Subscription;
  displayColumnsIn = ['sender', 'rekeningin', 'amountin', 'point', 'datein'];
  dataSourceIn = new MatTableDataSource<TransferData>();

  //config tabel
  @ViewChild(MatSort, { static: false }) sortin: MatSort;
  @ViewChild(MatPaginator, { static: false }) paginatorin: MatPaginator;

  totalPostIn = 2;
  postPerPageIn = 0;
  currentPageIn = 1;
  pageSizeOptionIn = [5, 10, 25, 100];

  isLoading = false;

  private userId2 = localStorage.getItem("userId");
  norek = '';

  ngOnInit() {
    this.serviceNasabah.getNasabahByUserId(this.userId2).subscribe(resData => {
      this.norek = resData.message.norek;
      this.transferService.historyTransferInListByNorek(this.norek, this.postPerPageIn, this.currentPageIn);
      this.dataHistoryInSub = this.transferService.getTransferInListener()
        .subscribe((resDataHistoryIn: { message: TransferData[], maxInHistory: number }) => {
          this.dataHistoryIn = resDataHistoryIn.message;
          this.dataSourceIn.data = this.dataHistoryIn.slice();
        });
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
  }
}
