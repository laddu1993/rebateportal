import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteitemComponent } from './deleteitem.component';

describe('DeleteitemComponent', () => {
  let component: DeleteitemComponent;
  let fixture: ComponentFixture<DeleteitemComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeleteitemComponent]
    });
    fixture = TestBed.createComponent(DeleteitemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
