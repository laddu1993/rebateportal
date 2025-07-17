import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleterebateComponent } from './deleterebate.component';

describe('DeleterebateComponent', () => {
  let component: DeleterebateComponent;
  let fixture: ComponentFixture<DeleterebateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeleterebateComponent]
    });
    fixture = TestBed.createComponent(DeleterebateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
