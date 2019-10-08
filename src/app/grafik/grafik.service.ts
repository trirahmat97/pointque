import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Chart } from 'chart.js';
import { Grafik } from './grafik.model';

@Injectable({
  providedIn: 'root'
})
export class GrafikService implements OnInit {

  url = 'http://localhost:3000/api/int-bank/nasabah/grafik';
  data: Grafik[];
  Player = [];
  Run = [];
  Linechart = [];

  constructor(private http: HttpClient) { }

  ngOnInit() {
    // console.log(this.Player, this.Run);

    this.http.get(this.url).subscribe(result => {
      console.log(result);
    })

    // this.http.get(this.url).subscribe((result: Grafik[]) => {
    //   console.log(result);
    //   result.forEach(x => {
    //     this.Player.push(x.player);
    //     this.Run.push(x.run);
    //   });
    //   this
    //   this.Linechart = new Chart('canvas', {
    //     type: 'line',
    //     data: {
    //       labels: this.Player,

    //       datasets: [
    //         {
    //           data: this.Run,
    //           borderColor: '#3cb371',
    //           backgroundColor: "#0000FF",
    //         }
    //       ]
    //     },
    //     options: {
    //       legend: {
    //         display: false
    //       },
    //       scales: {
    //         xAxes: [{
    //           display: true
    //         }],
    //         yAxes: [{
    //           display: true
    //         }],
    //       }
    //     }
    //   });
    // });
  }
}

