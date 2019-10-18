import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy, Input } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { PoitnData } from '../admin/model/point-model';
import { TransferService } from '../admin/service/transfer.service';
import { Poitn2Data } from '../admin/model/point2-model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-point-max-mount',
  templateUrl: './point-max-mount.component.html',
  styleUrls: ['./point-max-mount.component.css']
})
export class PointMaxMountComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input() nameUser: string;

  dataPointInAll: Poitn2Data[] = [];
  dataPointOutAll: Poitn2Data[] = [];
  private dataPointInAllSub: Subscription;
  private dataPointOutAllSub: Subscription;
  private dataSorting = [];
  private dataSorting3 = [];
  setBulanan = 30;

  displayColumns = ['norek', 'point'];
  dataSource = new MatTableDataSource<PoitnData>();

  @ViewChild(MatSort, { static: false }) sortin: MatSort;
  @ViewChild(MatPaginator, { static: false }) paginatorin: MatPaginator;
  totalPostIn = 2;
  postPerPageIn = 0;
  currentPageIn = 1;
  pageSizeOptionIn = [5, 10, 25, 100];

  constructor(
    private serviceTransfer: TransferService
  ) { }

  ngOnInit() {
    this.serviceTransfer.getInPointAll();
    this.serviceTransfer.getOutPointAll();
    this.getDataNasabahPoint();
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
                  // this.dataSorting.push(this.dataPointInAll[i]);
                  this.dataSorting.push(this.dataPointInAll[j]);
                }
              }
            }
            const dataJadi = new Set(this.dataSorting)
            const dataJadi2 = [...dataJadi];
            for (let u = 0; u < dataJadi2.length; u++) {
              if (dataJadi2[u].point >= this.setBulanan) {
                this.dataSorting3.push(dataJadi2[u]);
              }
            }

            this.dataSource.data = this.dataSorting3.slice();
          });

      });
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sortin;
    this.dataSource.paginator = this.paginatorin;
  }

  ngOnDestroy() {
    this.dataPointInAllSub.unsubscribe();
    this.dataPointOutAllSub.unsubscribe();
  }

}
