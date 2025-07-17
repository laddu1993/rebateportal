import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmitrebateComponent } from './submitrebate.component';

describe('SubmitrebateComponent', () => {
  let component: SubmitrebateComponent;
  let fixture: ComponentFixture<SubmitrebateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SubmitrebateComponent]
    });
    fixture = TestBed.createComponent(SubmitrebateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
