import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateApplicationsStatusModalComponent } from './update-applications-status-modal.component';

describe('UpdateApplicationsStatusModalComponent', () => {
  let component: UpdateApplicationsStatusModalComponent;
  let fixture: ComponentFixture<UpdateApplicationsStatusModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateApplicationsStatusModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateApplicationsStatusModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
