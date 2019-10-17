import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NasabahService } from '../admin/service/nasabah.service';
import { TransferService } from '../admin/service/transfer.service';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { MatSnackBar } from '@angular/material';
import { OtherService } from '../admin/service/other.service';

@Component({
  selector: 'app-send',
  templateUrl: './send.component.html',
  styleUrls: ['./send.component.css']
})
export class SendComponent implements OnInit, OnDestroy {
  hide = true;
  isLoading = false;
  formSend: FormGroup;
  sender = '';
  userId = '';

  private authListenerSubs: Subscription;

  constructor(
    private serviceNasabah: NasabahService,
    private transferService: TransferService,
    private authService: AuthService,
    private _snackBar: MatSnackBar,
    private serviceOther: OtherService
  ) { }

  ngOnInit() {
    this.formSend = new FormGroup({
      bank: new FormControl('pointque'),
      norek: new FormControl(null, { validators: [Validators.required] }),
      receiver: new FormControl('', { validators: [Validators.required] }),
      amount: new FormControl(null, { validators: [Validators.required, Validators.min(20000)] }),
      pin: new FormControl(null, { validators: [Validators.required, Validators.maxLength(6), Validators.minLength(6)] }),
      description: new FormControl(null),
    });
    this.authListenerSubs = this.authService.getAuthStatusListener().subscribe(isAuthentication => {
      this.userId = isAuthentication.userId;
      this.serviceNasabah.getNasabahByUserId(this.userId).subscribe(resData => {
        this.sender = resData.message.norek;
      });
    });
    this.authService.autoAuthUser();

  }

  //find nasabah
  onFind() {
    let findBank = this.formSend.value.bank;
    let norek = this.formSend.value.norek;
    if (findBank == 'pointque') {
      this.serviceNasabah.getNasabahById(norek).subscribe(resData => {
        if (resData.responseCode == '00') {
          this.formSend.setValue({
            bank: 'pointque',
            receiver: resData.message.name,
            norek: this.formSend.value.norek,
            amount: 0,
            pin: null,
            description: null
          });
        }
      }, err => {
        this.formSend.setValue({
          bank: 'pointque',
          receiver: '',
          norek: this.formSend.value.norek,
          amount: 0,
          pin: null,
          description: null
        });
      });
    } else {
      this.serviceOther.inquryNasabah(norek).subscribe(resData => {
        if (resData.responseCode == '00') {
          this.formSend.setValue({
            bank: 'gbank',
            receiver: resData.message.name,
            norek: this.formSend.value.norek,
            amount: 0,
            pin: null,
            description: null
          });
        }
      }, err => {
        this.formSend.setValue({
          bank: 'gbank',
          receiver: '',
          norek: this.formSend.value.norek,
          amount: 0,
          pin: null,
          description: null
        });
      });
    }
  }


  onSend() {
    if (this.formSend.invalid) {
      return false;
    }

    let findBank = this.formSend.value.bank;
    if (findBank == 'pointque') {
      this.transferService.transferPointque(
        this.sender,
        this.formSend.value.norek,
        this.formSend.value.amount,
        this.formSend.value.pin,
        this.formSend.value.description,
      ).subscribe(resData => {
        this._snackBar.open(resData.message, 'Transfer!', {
          duration: 2500,
        });
        this.formSend.setValue({
          bank: 'pointque',
          receiver: '',
          norek: this.formSend.value.norek,
          amount: 0,
          pin: null,
          description: null
        });
      }, err => {

      })
    } else {
      this.serviceNasabah.getNasabahNorekPin(this.sender, this.formSend.value.pin)
        .subscribe(dataPin => {
          if (dataPin.message.length == 1) {
            this.serviceOther.transfer(
              this.sender,
              dataPin.message.namem,
              this.formSend.value.norek,
              this.formSend.value.amount,
              this.formSend.value.description,
            ).subscribe(dataTf => {
              if (dataTf.responseCode == '00') {
                this.transferService.transferOut(
                  this.sender,
                  this.formSend.value.norek,
                  this.formSend.value.receiver,
                  this.formSend.value.amount,
                  this.formSend.value.pin,
                  this.formSend.value.description,
                ).subscribe(dataTrans => {
                  this._snackBar.open(dataTrans.message + ' : ' + this.formSend.value.receiver, 'Transfer!', {
                    duration: 2500,
                  });
                  this.formSend.setValue({
                    bank: 'gbank',
                    receiver: '',
                    norek: this.formSend.value.norek,
                    amount: 0,
                    pin: null,
                    description: null
                  });
                })
              }
            });

            console.log(dataPin);
          }
        }, err => {

        })
      console.log('gbank');
    }

  }

  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
  }

  // formatLabel(value: number) {
  //   if (value >= 1000) {
  //     return Math.round(value / 1000) + 'k';
  //   }
  //   return value;
  // }

  // set tickInterval(value) {
  //   this._tickInterval = coerceNumberProperty(value);
  // }

}
