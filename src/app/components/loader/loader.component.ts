/*import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { LoaderService } from 'src/app/services/loader.service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})

export class LoaderComponent {
  isLoading: Observable<boolean>;
  //isLoading = false; // To show/hide the progress bar
  progressValue = 0; // For determinate progress bar
  constructor(private service: LoaderService) {
    this.isLoading = this.service.isLoading;
    this.simulateLoading();
  }
  simulateLoading() {
    this.isLoading = this.service.isLoading;
    setTimeout(() => {
    let progress = 0;
    const interval = setInterval(() => {
      if (progress >= 100) {
        clearInterval(interval);
        this.isLoading = this.service.isLoading;
      } else {
        progress += 10;
        this.progressValue = progress;
      }
    }, 500); // Adjust time interval as needed
    }, 5000); // Simulate content loading for 5 seconds
  }
}*/
import { Component, OnInit } from '@angular/core';
import { LoaderService } from 'src/app/services/loader.service'; // Import the service to manage loader state

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit {
  isLoading = false;

  constructor(private loaderService: LoaderService) { }

  ngOnInit(): void {
    this.loaderService.isLoading$.subscribe(status => {
      this.isLoading = status;
    });
  }
}

