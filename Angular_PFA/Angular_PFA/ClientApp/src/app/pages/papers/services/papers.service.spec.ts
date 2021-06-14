import { TestBed } from '@angular/core/testing';

import { PapersService } from './papers.service';

describe('PapersService', () => {
  let service: PapersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PapersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
