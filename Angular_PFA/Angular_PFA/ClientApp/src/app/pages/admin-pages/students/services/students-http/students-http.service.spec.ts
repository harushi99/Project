import { TestBed } from '@angular/core/testing';

import { StudentsHTTPService } from './students-http.service';

describe('StudentsHTTPService', () => {
  let service: StudentsHTTPService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StudentsHTTPService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
