import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeletePaperModalComponent } from './delete-paper-modal.component';

describe('DeletePaperModalComponent', () => {
  let component: DeletePaperModalComponent;
  let fixture: ComponentFixture<DeletePaperModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeletePaperModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeletePaperModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
