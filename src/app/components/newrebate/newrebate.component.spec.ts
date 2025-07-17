import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewrebateComponent } from './newrebate.component';

describe('NewrebateComponent', () => {
  let component: NewrebateComponent;
  let fixture: ComponentFixture<NewrebateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewrebateComponent]
    });
    fixture = TestBed.createComponent(NewrebateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
