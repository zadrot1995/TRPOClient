import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { from } from 'rxjs';
import { tap } from 'rxjs/operators';
import { MessagePackHubProtocol } from '@microsoft/signalr-protocol-msgpack';
import {PipelineDto} from '../Dtos/PipelineDto';
@Injectable({
  providedIn: 'root'
})
export class SignalrService {

  private hubConnection: HubConnection;
  public messages: string[] = [];
  private connectionUrl = 'https://localhost:44319/signalr';
  private apiUrl = 'https://localhost:44319/api/chat';
  public isCenceled = false;
  pipeline1ActiveComponent: number;
  pipeline2ActiveComponent: number;
  pipeline3ActiveComponent: number;
  pipeline4ActiveComponent: number;

  constructor(private http: HttpClient) { }

  public connect = () => {
    this.startConnection();
    this.addListeners();
  }

  public sendMessageToApi(message: string) {
    return this.http.post(this.apiUrl, message)
      .pipe(tap(_ => console.log('message sucessfully sent to api controller')));
  }

  public sendMessageToHub(message: string) {
    const promise = this.hubConnection.invoke('BroadcastAsync', message)
      .then(() => { console.log('message sent successfully to hub'); })
      .catch((err) => console.log('error while sending a message to hub: ' + err));

    return from(promise);
  }
  public startHub() {
    const promise = this.hubConnection.invoke('StartAsync', this.hubConnection.connectionId)
      .then(() => { console.log('message sent successfully to hub'); })
      .catch((err) => console.log('error while sending a message to hub: ' + err));

    return from(promise);
  }
  public stopHub() {
    console.log('stop');
    const promise = this.hubConnection.invoke('StopAsync')
      .then(() => { console.log('Stop!'); })
      .catch((err) => console.log('error while sending a message to hub: ' + err));

    return from(promise);
  }

  private getConnection(): HubConnection {
    return new HubConnectionBuilder()
      .withUrl(this.connectionUrl)
      .withHubProtocol(new MessagePackHubProtocol())
      //  .configureLogging(LogLevel.Trace)
      .build();
  }

  private startConnection() {
    this.hubConnection = this.getConnection();

    this.hubConnection.start()
      .then(() => console.log('connection started'))
      .catch((err) => console.log('error while establishing signalr connection: ' + err));
  }

  private addListeners() {
    this.hubConnection.on('messageReceivedFromApi', (data: string) => {
      console.log('message received from API Controller');
      this.messages.push(data);
    });
    this.hubConnection.on('messageReceivedFromHub', (data: PipelineDto) => {
      console.log('message received from Hub');
      if ( data.piplineId === 0){
        this.pipeline1ActiveComponent = data.componentId;
      }
      if ( data.piplineId === 1){
        this.pipeline2ActiveComponent = data.componentId;
      }
      if ( data.piplineId === 2){
        this.pipeline3ActiveComponent = data.componentId;
      }
      if ( data.piplineId === 3){
        this.pipeline4ActiveComponent = data.componentId;
      }
      this.messages.push('Pipeline #' + data.piplineId + 'Component #' + data.componentId );
    });
    this.hubConnection.on('newUserConnected', _ => {
      console.log('new user connected');
    });
  }
}



