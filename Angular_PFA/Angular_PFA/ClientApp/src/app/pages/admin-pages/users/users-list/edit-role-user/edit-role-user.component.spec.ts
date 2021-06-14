import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditRoleUserComponent } from './edit-role-user.component';

describe('EditRoleUserComponent', () => {
  let component: EditRoleUserComponent;
  let fixture: ComponentFixture<EditRoleUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditRoleUserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditRoleUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
