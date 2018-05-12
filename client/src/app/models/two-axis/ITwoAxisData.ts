import { IMultiDataset } from "../IMultipleDataset";

import {IAxis} from '../IAxis';

export interface ITwoAxisData{
    labels:string[],
    datasets:IMultiDataset[],
    xAxis: IAxis[];
    yAxis: IAxis[];
}
