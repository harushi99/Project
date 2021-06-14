import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAplicationModalComponent } from './add-aplication-modal.component';

describe('AddAplicationModalComponent', () => {
  let component: AddAplicationModalComponent;
  let fixture: ComponentFixture<AddAplicationModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddAplicationModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAplicationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
