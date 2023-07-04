import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { FeedBack } from 'src/app/Models/feedBack.model';
import { User } from 'src/app/Models/user.model';
import { APIService } from 'src/app/Services/api.service';
import { DefaultService } from 'src/app/Services/default.service';
import Swal from 'sweetalert2';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  currentUser: User | undefined;
  fullName: string = '';
  role: string = '';
  inSearch: boolean = false;
  loggedIn: boolean = false;

  getRouteSubscription: Subscription = new Subscription();
  getUserSubscription: Subscription = new Subscription();
  getFullNameSubscription: Subscription = new Subscription();

  constructor(private service: DefaultService, private apiService: APIService, private router: Router) {}

  ngOnInit(): void {
    this.getRouteSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd && (event.url === '/search')) {
        this.inSearch = true;
      }
      if (event instanceof NavigationEnd && (event.url !== '/search')) {
        this.inSearch = false;
      }
    });

    this.loggedIn = this.service.isLoggedIn();

    this.service.loggedOutObs.subscribe({
      next: (loggedOut: boolean) => {
        if (loggedOut) {
          this.getRouteSubscription.unsubscribe();
          this.getUserSubscription.unsubscribe();
          this.getFullNameSubscription.unsubscribe();
        }
      }
    });

    this.getFullNameSubscription = this.service.fullNameObs.subscribe({
      next: (fullName: string) => {
        this.fullName = fullName;
      }
    });

    this.getUserSubscription = this.service.getUsernameFromToken() !== undefined ? this.apiService.getUser(this.service.getUsernameFromToken()).subscribe({
      next: (user: User) => {
        this.currentUser = user;
        this.fullName = user.firstName + ' ' + user.lastName;
        this.role = user.role!;
      },
      error: () => {
        localStorage.clear();
        window.location.href = '/';
      }
    }) : new Subscription();
  }

  async showFeedBackModal() {
    Swal.fire({
      title: 'Feedback',
      html:
        '<input id="swal-input" class="swal2-input w-100 m-auto mb-4" placeholder="Feedback title">' +
        '<textarea id="swal-textarea" class="swal2-textarea w-100 m-auto" placeholder="Type your feedback here..." style="resize: none"></textarea>',
      showCancelButton: true,
      confirmButtonText: 'Send',
      showLoaderOnConfirm: true,
      background: '#212529',
      color: '#fff',
      confirmButtonColor: '#0b5ed7',
      preConfirm: () => {
        const titleValue = (document.getElementById('swal-input')! as HTMLInputElement).value;
        const textAreaValue = (document.getElementById('swal-textarea')! as HTMLInputElement).value;

        if (!titleValue || !textAreaValue) {
          Swal.showValidationMessage('Please fill all the fields.');
          return;
        }

        const feedBack: FeedBack = {
          id: uuidv4(),
          title: titleValue,
          feedBackText: textAreaValue,
          time: new Date().toLocaleString()
        };

        this.apiService.sendFeedBack(feedBack).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Thank you for your feedback!',
              background: '#212529',
              color: '#fff',
              confirmButtonColor: '#0b5ed7'
            });
          },
          error: () => {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Someting went wrong while sending the feedback, please try again later.',
              background: '#212529',
              color: '#fff',
              confirmButtonColor: '#0b5ed7'
            });
          }
        });
      }
    });
  }
}
