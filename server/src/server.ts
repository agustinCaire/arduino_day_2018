import * as express from 'express';
import * as http from 'http';
import * as SerialPort from 'serialport';
import * as cors from 'cors';
import {Socket} from "socket.io";
import {ALL_DATA, DATA, SET} from "./Events";
import {IData} from "./IData";

const app = express();
app.use(cors());

//initialize a simple http server
const server = http.createServer(app);

const io = require('socket.io')(server);

let connected = 0;

let allData: IData[] = [];


io.on('connection', (socket: Socket) => {

    connected++;

    socket.emit(ALL_DATA, allData);

    socket.on('disconnect', (reason) => {
        connected--;
    });


    socket.on(SET, function(data) {
        port.write(data.toString().toUpperCase()+'\n');
    });
});








const port = new SerialPort('/dev/ttyUSB0', {
    baudRate: 9600
},(err)=>{
    if(err)
        console.log("Serial Opening Error");
});

const parser = new SerialPort.parsers.Readline({ delimiter: '\r\n'});
port.pipe(parser);

port.on('open', (err) => {
    console.log('Serial is Open!');
});
parser.on('data', (data:any) => {
    const splited = data.split('\t');

    const input = splited[0];
    const setPoint = splited[1];
    const output = splited[2];
    const KP = splited[3];
    const KI = splited[4];
    const KD = splited[5];
    const time = splited[6];

    let newData: IData = {
        input,
        setPoint,
        output,
        KP,
        KI,
        KD,
        time
    };

    console.log(newData);

    allData.push(newData);
    sendBroadcastMessage(DATA, newData);


});

port.on('close', () => {
    console.log('Serial port disconnected.');
});





//start our server
server.listen(3000, () => {
    console.log(`Server started on port 3000`);
});



/*
setInterval(()=>{
    sendBroadcastMessage(DATA,{
            input: 12.7565,
            setPoint: 10,
            output: 127,

    } as IData);
},1500);*/

const sendBroadcastMessage = (event: any, msg: IData) => {
    io.sockets.emit(event,msg);

    console.log(`Message sent to ${connected} Clients`);
}
