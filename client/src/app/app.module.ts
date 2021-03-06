import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import {SocketService} from './socket.service';
import { ChartComponent } from './chart/chart.component';
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ChartComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
  ],
  providers: [SocketService],
  bootstrap: [AppComponent]
})
export class AppModule { }
