import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-chats',
  templateUrl: './chats.component.html',
  styleUrls: ['./chats.component.css']
})
export class ChatsComponent implements OnInit {
  chatName: string = '';
  displayChat: boolean = false;

  chats: Record<string, string>[] = [
    {
      name: 'John Doe',
      username: 'johndoe',
      lastMessage: 'Hello, how are you?',
      time: '12:00'
    },
    {
      name: 'Mark Doe',
      username: 'markdoe',
      lastMessage: 'Hi',
      time: '13:00'
    },
    {
      name: 'Luca Doe',
      username: 'lucadoe',
      lastMessage: 'Where are you?',
      time: '10:00'
    },
    {
      name: 'Sam Doe',
      username: 'samdoe',
      lastMessage: 'How are you?',
      time: '9:00'
    },
    {
      name: 'Sally Doe',
      username: 'sallydoe',
      lastMessage: 'Fine!',
      time: 'now'
    },
  ];

  chatButtons: NodeListOf<HTMLElement> = document.querySelectorAll('.chatButton');

  constructor() {}

  ngOnInit(): void {
    document.addEventListener('keydown', this.escapeChat.bind(this));
  }

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
  }
}
