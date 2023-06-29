import { Component, OnInit } from '@angular/core';
import { FeedBack } from 'src/app/Models/feedBack.model';
import { APIService } from 'src/app/Services/api.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-feedback-page',
  templateUrl: './feedback-page.component.html',
  styleUrls: ['./feedback-page.component.css']
})
export class FeedbackPageComponent implements OnInit {
  feedBacks: FeedBack[] = [];
  viewFBClick: boolean = false;
  currentFB: FeedBack = {
    id: '',
    title: '',
    feedBackText: '',
    time: '',
  };

  constructor(private apiService: APIService) {}

  ngOnInit(): void {
    this.apiService.getFeedBacks().subscribe({
      next: (feedBacks) => {
        this.feedBacks = feedBacks;
      }
    });
  }

  viewFB(id: string): void {
    this.viewFBClick = true;

    this.currentFB = this.feedBacks.find((fb) => fb.id === id)!;
  }

  deleteFB(id: string): void {
    Swal.fire({
      icon: 'info',
      title: 'Are you sure?',
      text: 'You will not be able to recover this feedback!',
      background: '#212529',
      color: '#fff',
      confirmButtonText: 'Yes, delete it!',
      confirmButtonColor: '#bb2d3b',
      showCancelButton: true,
      cancelButtonColor: '#6c757d',
      cancelButtonText: 'No, keep it',
      focusCancel: false
    }).then((result) => {
      if (result.isConfirmed) {
        this.apiService.deleteFeedBack(id).subscribe({
          next: () => {
            this.feedBacks = this.feedBacks.filter((fb) => fb.id !== id);
          }
        });
      }
    });
  }
}
