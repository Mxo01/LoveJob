import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-single-chat',
  templateUrl: './single-chat.component.html',
  styleUrls: ['./single-chat.component.css']
})
export class SingleChatComponent implements OnInit {
  @Input() chat: any = {
    name: '',
    username: '',
    lastMessage: '',
    time: ''
  };

  constructor() {}

  ngOnInit(): void {

  }
}
