import { IMultiDataset } from "../IMultipleDataset";
import {IAxis} from '../IAxis';

export interface IBarData{
    labels:string[];
    datasets: IMultiDataset[];
  xAxis: IAxis[];
  yAxis: IAxis[];
}
