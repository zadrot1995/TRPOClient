import { Component, OnInit } from '@angular/core';
import { SignalrService } from './signalr.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  title = 'chat-ui';
  text: string = "";
  pipeline1ActiveComponent: number;
  pipeline2ActiveComponent: number;
  pipeline3ActiveComponent: number;
  pipeline4ActiveComponent: number;

  isStarted = false;
  constructor(public signalRService: SignalrService) {

  }

  ngOnInit(): void {
    this.signalRService.connect();
  }

  sendMessage(): void {

    // you can send the messge direclty to the hub or use the api controller.
    // choose wisely

    // this.signalRService.sendMessageToApi(this.text).subscribe({
    //   next: _ => this.text = '',
    //   error: (err) => console.error(err)
    // });

    this.signalRService.sendMessageToHub(this.text).subscribe({
      next: _ => this.text = '',
      error: (err) => console.error(err)
    });
  }
  start(): void{
    this.isStarted = true;
    this.signalRService.startHub();
  }
  stop(): void{
    this.isStarted = false;
    this.signalRService.stopHub();
  }
}
