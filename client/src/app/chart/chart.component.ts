import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {SocketService} from '../socket.service';
import {IData} from '../models/IData';

import { Chart } from 'chart.js';
import {ITwoAxisData} from '../models/two-axis/ITwoAxisData';
import {IMultiDataset} from '../models/IMultipleDataset';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit {

  @ViewChild('axisCanvas') axisCanvas: ElementRef;

  chart = null;
  data: ITwoAxisData = {
    labels: [],
    datasets: [],
    xAxis:[],
    yAxis:[],
  };

  MAX_DATA=300;


  constructor(
    private socket: SocketService,
  ) {}

  ngOnInit() {

    this.initializeData();
    this.resetAxis();

    this.socket.getData().subscribe(
      (data: IData) => {
        this.addData(data.output, data);
      }
    );

    this.socket.getAllData().subscribe(
      (data: IData[]) =>{

        if(data.length > this.MAX_DATA) {
          this.initializeData(data.slice(data.length - this.MAX_DATA, data.length));
        }
        else{
          this.initializeData(data);
        }
        this.chart.destroy();
        this.resetAxis();
      }
    )


  }

  initializeData(data?: IData[]) {

    console.log(data);

    this.data = {
      labels: data ? (data.map( (i) => {return i.output.toString()})) : [],
      datasets: [{
        label: 'Actual',
        data: data ? (data.map( (i) => {return i.input})) : [],
        yAxisID: 'y1'
      } as IMultiDataset,
        {
          label: 'Deseada',
          data: data ? (data.map( (i) => {return i.setPoint})) : [],
          yAxisID: 'y1'
        } as IMultiDataset],
      xAxis: [
        {label: 'Tiempo',
          display: false,
          id: 'x1'}
      ],
      yAxis: [
        {label: null,
          display: true,
          id: 'y1'
        }
      ]

    }


    let lasth = null;

    const randomInt = (min, max) => {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    };


    let h;

    for (let i = 0; i < 2; i++) {
      do{
        h =randomInt(0, 360);
      }
      while(lasth  && Math.abs(lasth - h) < 60);

      lasth=h;

      let s = randomInt(60, 75);
      let l = randomInt(65, 70);
      let opacity = 100;

      this.data.datasets[i].borderColor = `hsl(${h},${s}%,${l}%)`;
      this.data.datasets[i].backgroundColor = `hsl(${h},${s}%,${l}%,.${opacity})`;
    }



  }




  resetAxis(){
    let axisCanvasCtx = this.axisCanvas.nativeElement.getContext('2d');
    this.chart = new Chart(axisCanvasCtx, {
      type: 'line',
      data: this.data,
      options: {
        legend: {
          display: true, //CAMBIAR ACA,
          labels:{
            fontColor: 'black'
          },
        },
        scales: {
          xAxes: this.data.xAxis.map(item => {
            return {
              display: item.display,
              scaleLabel: {
                display: true,
                labelString: item.label ? item.label : '',
              },
              id: item.id,
            }
          }),
          yAxes: this.data.yAxis.map(item => {
            return {
              display: item.display,
              scaleLabel: {
                display: false,
                labelString: item.label ? item.label : '',
              },
              position: item.position ? item.position : 'left',
              id: item.id,
            }
          }),
        }
      }
    });
  }

  addData(label, data: IData) {
    this.chart.data.labels.push(label);
    this.chart.data.datasets[0].data.push(data.input);
    this.chart.data.datasets[1].data.push(data.setPoint);

    if(this.chart.data.datasets[0].data.length > this.MAX_DATA)
      this.removeData();

    this.chart.update();
  }

  removeData() {
    this.chart.data.labels.pop();
    this.chart.data.datasets.forEach((dataset) => {
      dataset.data.shift();
    });
    this.chart.update();
  }

}
