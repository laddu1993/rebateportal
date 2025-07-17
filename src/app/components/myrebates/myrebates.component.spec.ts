import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyrebatesComponent } from './myrebates.component';

describe('MyrebatesComponent', () => {
  let component: MyrebatesComponent;
  let fixture: ComponentFixture<MyrebatesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MyrebatesComponent]
    });
    fixture = TestBed.createComponent(MyrebatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
