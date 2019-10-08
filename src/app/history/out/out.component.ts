import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { NasabahService } from 'src/app/admin/service/nasabah.service';
import { TransferService } from 'src/app/admin/service/transfer.service';
import { TransferData } from 'src/app/admin/model/transfer-data.model';
import { Subscription } from 'rxjs';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';

@Component({
  selector: 'app-out',
  templateUrl: './out.component.html',
  styleUrls: ['./out.component.css']
})
export class OutComponent implements OnInit, AfterViewInit, OnDestroy {

  constructor(
    private serviceNasabah: NasabahService,
    private transferService: TransferService
  ) { }

  //history out
  dataHistoryOut: TransferData[] = [];
  dataHistoryOutSub: Subscription;
  displayColumnsOut = ['receiver', 'rekeningout', 'amountout', 'point', 'dateout'];
  dataSourceOut = new MatTableDataSource<TransferData>();

  @ViewChild(MatSort, { static: false }) sortOut: MatSort;
  @ViewChild(MatPaginator, { static: false }) paginatorOut: MatPaginator;

  totalPostOut = 2;
  postPerPageOut = 0;
  currentPageOut = 1;
  pageSizeOptionOut = [5, 10, 25, 100];

  isLoading = false;

  private userId2 = localStorage.getItem("userId");
  norek = '';

  ngOnInit() {
    this.serviceNasabah.getNasabahByUserId(this.userId2).subscribe(resData => {
      this.norek = resData.message.norek;
      this.transferService.historyTransferOutListByNorek(this.norek, this.postPerPageOut, this.currentPageOut);
      this.dataHistoryOutSub = this.transferService.getTransferOutListener()
        .subscribe((resDataHistoryOut: { message: TransferData[], maxOutHistory: number }) => {
          this.dataHistoryOut = resDataHistoryOut.message;
          this.dataSourceOut.data = this.dataHistoryOut.slice();
        });
    });
  }
  doFilterOut(filterValue: string) {
    this.dataSourceOut.filter = filterValue.trim().toLowerCase();
  }

  ngAfterViewInit() {
    this.dataSourceOut.sort = this.sortOut;
    this.dataSourceOut.paginator = this.paginatorOut;
  }

  ngOnDestroy() {
    this.dataHistoryOutSub.unsubscribe();
  }
}
