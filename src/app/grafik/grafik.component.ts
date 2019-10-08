import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Grafik } from './grafik.model';
import { Chart } from 'chart.js';


@Component({
  selector: 'app-grafik',
  templateUrl: './grafik.component.html',
  styleUrls: ['./grafik.component.css']
})
export class GrafikComponent implements OnInit {
  url = 'http://localhost:3000/api/int-bank/nasabah/grafik';
  data: Grafik[];
  Player = [];
  Run = [];
  Linechart = [];

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.http.get<{ responseCode: string, responseDesc: string, message: any }>(this.url).subscribe((result) => {
      // console.log(result.message);
      const result2: Grafik[] = result.message;
      result2.forEach(x => {
        this.Player.push(x.player);
        this.Run.push(x.run);
      });
      this
      this.Linechart = new Chart('canvas', {
        type: 'line',
        data: {
          labels: this.Player,

          datasets: [
            {
              data: this.Run,
              borderColor: '#3cb371',
              // backgroundColor: "#0000FF",
            }
          ]
        },
        options: {
          legend: {
            display: false
          },
          scales: {
            xAxes: [{
              display: true
            }],
            yAxes: [{
              display: true
            }],
          }
        }
      });
    });
  }

}
