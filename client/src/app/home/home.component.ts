import { Component, OnInit } from '@angular/core';
import {SocketService} from '../socket.service';
import {IData} from '../models/IData';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements  OnInit{
  private data: IData;
  private input: any;

  constructor(private socket: SocketService){}

  ngOnInit(): void{
    this.data = {
      input:0,
      setPoint:0,
      output:0,
      KP:0,
      KI:0,
      KD:0,
      time:0,
    }

    this.input = 19;

    this.socket.getData().subscribe((data: IData) => {
      this.data = data;
    });

  }


  public setTemp(): void {
    this.socket.send('S' + this.input.toString());
    this.input = '';
  }

}
