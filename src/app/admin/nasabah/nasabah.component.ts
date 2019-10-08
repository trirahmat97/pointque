import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { NasabahService } from '../service/nasabah.service';
import { NasabahData } from '../model/nasabah-data.model';
import { Subscription } from 'rxjs';
import { MatTableDataSource, MatSort, MatPaginator, MatSlideToggleChange, MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-nasabah',
  templateUrl: './nasabah.component.html',
  styleUrls: ['./nasabah.component.css']
})
export class NasabahComponent implements OnInit, AfterViewInit, OnDestroy {

  dataNasabah: NasabahData[] = [];
  nasabahSub: Subscription;

  //data table
  displayColumns = ['name', 'norek', 'status'];
  dataSource = new MatTableDataSource<NasabahData>();
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  //status 
  checked = false;
  color = 'warn';

  //pagination
  totalPost = 2;
  postPerPage = 0;
  currentPage = 1;
  pageSizeOption = [5, 10, 25, 100];

  isLoading = false;
  constructor(
    private serviceNasabah: NasabahService,
    private _snackBar: MatSnackBar,
  ) { }

  ngOnInit() {
    this.serviceNasabah.getNasabah(this.postPerPage, this.currentPage);
    this.nasabahSub = this.serviceNasabah.getNasabahListener()
      .subscribe((nasabahData: { message: NasabahData[], nasabahAccout: number }) => {
        this.totalPost = nasabahData.nasabahAccout,
          this.dataNasabah = nasabahData.message,
          this.dataSource.data = this.dataNasabah.slice();
      })
  }

  onChange(value: MatSlideToggleChange) {
    this.checked = value.checked;
    this.color = 'primary';
  }

  onChangeStatus(status, norek) {
    let statusOk = status;
    if (statusOk == 1) {
      statusOk = '2';
    } else {
      statusOk = '1';
    }
    this.isLoading = true;
    this.serviceNasabah.updateStatusNasabah(norek, statusOk).subscribe(resData => {
      this.serviceNasabah.getNasabah(this.postPerPage, this.currentPage);
      this.isLoading = false;
      this._snackBar.open(resData.message, 'Change Status!', {
        duration: 2000
      });
    }, () => {
      this.isLoading = false;
    });
  }

  doFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  ngOnDestroy() {
    this.nasabahSub.unsubscribe();
  }
}
