import { Component, OnInit, ViewChild } from '@angular/core';
import { TransferService } from '../admin/service/transfer.service';
import { Subscription } from 'rxjs';
import { RewardModel } from '../admin/model/reward.model';
import { MatSort, MatPaginator, MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-data-reward',
  templateUrl: './data-reward.component.html',
  styleUrls: ['./data-reward.component.css']
})
export class DataRewardComponent implements OnInit {

  dataReward: RewardModel[] = [];
  private rewardSub: Subscription;
  displayColumns = ['norek', 'point', 'hadiah', 'date', 'status'];
  dataSource = new MatTableDataSource<RewardModel>();
  @ViewChild(MatSort, { static: false }) sortin: MatSort;
  @ViewChild(MatPaginator, { static: false }) paginatorin: MatPaginator;

  constructor(
    private serviceTransfer: TransferService
  ) { }

  ngOnInit() {
    this.serviceTransfer.getReward();
    this.rewardSub = this.serviceTransfer.getRewardListener()
      .subscribe((rewardData: { message: RewardModel[], maxReward: number }) => {
        this.dataReward = rewardData.message;
        this.dataSource.data = this.dataReward.slice();
      });
  }

  doFilterIn(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sortin;
    this.dataSource.paginator = this.paginatorin;
  }

  ngOnDestroy() {
    this.rewardSub.unsubscribe();
  }

}
