import {Injectable, OnInit} from '@angular/core';
import * as io from "socket.io-client";
import {Observable} from 'rxjs/Observable';
import {IData} from './models/IData';
import {ALL_DATA, DATA, SET} from './models/Events';

@Injectable()
export class SocketService implements OnInit{

  private url = 'http://localhost:3000';
  private socket = io(this.url);
  private data: IData[] = [];

  private MAX_DATA = 50;

  ngOnInit(): void {
    this.getData = this.getData.bind(this);
    this.send = this.send.bind(this);
  }

  getData() {
    let observable = new Observable(observer => {
      this.socket.on(DATA, (data) => {
        observer.next(data as IData);
      });
    })
    return observable;
  }

  getAllData(){
    let observable = new Observable(observer => {
      this.socket.on(ALL_DATA, (data) => {
        observer.next(data as IData[]);
      });
    })
    return observable;
  }

  send(data: any) {
    this.socket.emit(SET, data);
  }



}
