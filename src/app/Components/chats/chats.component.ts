import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { v4 as uuidv4 } from 'uuid';
import { Chat } from 'src/app/Models/chat.model';
import { Message } from 'src/app/Models/message.model';
import { APIService } from 'src/app/Services/api.service';

import { DefaultService } from 'src/app/Services/default.service';

@Component({
  selector: 'app-chats',
  templateUrl: './chats.component.html',
  styleUrls: ['./chats.component.css']
})
export class ChatsComponent implements OnInit {

  constructor(private service: DefaultService, private apiService: APIService, private formBuilder: FormBuilder) {
  }

  messages: Message[] = [];
  chats: Chat[] = [];
  allChats: Chat[] = [];

  fullName: string = '';

  ngOnInit() {
    this.apiService.getChats().subscribe({
      next: (chats: Chat[]) => {
        this.chats = chats.filter((c) => c.user1 === this.currentUser);
        this.allChats = chats;
      }
    });

    this.service.fullNameObs.subscribe({
      next: (fullName: string) => {
        this.fullName = fullName;
      }
    });

    this.service.chatObs.subscribe({
      next: (chat: Chat) => {
        if (chat.id !== '') this.chats.push(chat);
      }
    });

    this.apiService.getMessages().subscribe({
      next: (messages: Message[]) => {
        this.messages = messages.sort((a, b) => {
          return new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime();
        });
      }
    });

    document.addEventListener('keydown', this.escapeChat.bind(this));

    this.sendMessageForm = this.formBuilder.group({
      textMessage: ['', Validators.required]
    });
  }

  currentUser = this.service.getUsernameFromToken();
  sendMessageForm!: FormGroup;
  isEmptyMessage: boolean = true;
  receiverUser: string = '';
  chatName: string = '';
  displayChat: boolean = false;

  chatButtons: NodeListOf<HTMLElement> = document.querySelectorAll('.chatButton');

  escapeChat(e: KeyboardEvent): void {
    if (e.key === 'Escape') {
      this.chatButtons.forEach((cb) => {
        cb.classList.remove('focusChat');
      });

      this.displayChat = false;
    }
  }

  showChat(e: MouseEvent): void {
    const chatButton = e.currentTarget as HTMLElement;

    this.chatButtons = document.querySelectorAll('.chatButton');
    this.chatButtons.forEach((cb) => {
      if (cb !== chatButton) cb.classList.remove('focusChat');
    });
    chatButton.classList.add('focusChat');

    this.displayChat = true;
    const targetName = chatButton.firstChild!.firstChild!.firstChild!.firstChild!.textContent;
    this.chatName = targetName === null ? '' : targetName;
    const targetUsername = chatButton.firstChild!.firstChild!.childNodes[1].textContent;
    this.receiverUser = targetUsername === null ? '' : targetUsername;
  }

  sendMessage() {
    const messageText = this.sendMessageForm.controls['textMessage'].value;
    this.sendMessageForm.reset();

    const date = new Date();

    const message: Message = {
      id: uuidv4(),
      sender: this.currentUser,
      receiver: this.receiverUser,
      body: messageText,
      dateTime: date
    };

    this.messages.push(message);
    this.apiService.sendMessage(message).subscribe();

    const chatID = this.allChats.find((c) => c.user1 === this.receiverUser && c.user2 === this.currentUser)!.id;
    const sender = this.allChats.find((c) => c.user1 === this.receiverUser && c.user2 === this.currentUser)!.name2;

    const chat: Chat = {
      id: chatID,
      user1: this.receiverUser,
      name1: this.chatName,
      user2: this.currentUser,
      name2: sender,
      lastMessage: messageText,
      time: date
    };

    this.allChats.find((c) => c.id === chatID)!.lastMessage = messageText;
    this.allChats.find((c) => c.id === chatID)!.time = date;
    this.apiService.updateChat(chatID, chat).subscribe();
  }
}
