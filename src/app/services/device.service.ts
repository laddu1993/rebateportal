import { Injectable } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class DeviceService {
    isMobileView: boolean = false;
    isTabletView: boolean = false;
    constructor(private breakpointObserver: BreakpointObserver) { }
    ngOnInit(): void {
        this.breakpointObserver.observe([Breakpoints.Handset, Breakpoints.Tablet])
            .subscribe(result => {                
                this.isMobileView = result.matches && result.breakpoints[Breakpoints.Handset];
                this.isTabletView = result.matches && result.breakpoints[Breakpoints.Tablet];
            });
    }
    /*isMobile(): boolean {        
        
        if(this.isMobileView){
            return true;
        }else if(this.isTabletView){
            return true;
        }else{
            return false;
        }
        //return /Mobi|Android/i.test(navigator.userAgent);
        
    }*/
    isMobile(): boolean {
        const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    
        // Check for mobile devices
        return /android|iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;
      }
}
