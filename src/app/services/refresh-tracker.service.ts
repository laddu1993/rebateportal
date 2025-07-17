// refresh-tracker.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class RefreshTrackerService {
  private isRefreshed = false;

  setRefreshed() {
    this.isRefreshed = true;
  }

  hasRefreshed(): boolean {
    return this.isRefreshed;
  }

  reset() {
    this.isRefreshed = false;
  }
}
