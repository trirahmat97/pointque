import { Component, OnInit, ViewChild } from '@angular/core';
import { ConfigReward } from '../../model/config-reward.model';
import { Subscription } from 'rxjs';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { ConfigRewardService } from '../../service/config-reward.service';

@Component({
  selector: 'app-list-reward',
  templateUrl: './list-reward.component.html',
  styleUrls: ['./list-reward.component.css']
})
export class ListRewardComponent implements OnInit {

  dataConfigReward: ConfigReward[] = [];
  configRewardSub: Subscription;

  //data table
  displayColumns = ['name', 'jumlah', 'point', 'reward', 'action'];
  dataSource = new MatTableDataSource<ConfigReward>();
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  totalPost = 2;
  postPerPage = 0;
  currentPage = 1;
  pageSizeOption = [5, 10, 25, 100];

  constructor(
    private configRewardService: ConfigRewardService
  ) { }

  ngOnInit() {
    this.configRewardService.getNasabah(this.postPerPage, this.currentPage);
    this.configRewardSub = this.configRewardService.getRewardhListener()
      .subscribe((configRewardNasabah: { message: ConfigReward[], maxConfigReward: number }) => {
        this.totalPost = configRewardNasabah.maxConfigReward,
          this.dataConfigReward = configRewardNasabah.message,
          this.dataSource.data = this.dataConfigReward.slice();
      })
  }

}
