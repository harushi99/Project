import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewApplicationModalComponent } from './view-application-modal.component';

describe('ViewApplicationModalComponent', () => {
  let component: ViewApplicationModalComponent;
  let fixture: ComponentFixture<ViewApplicationModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewApplicationModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewApplicationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
