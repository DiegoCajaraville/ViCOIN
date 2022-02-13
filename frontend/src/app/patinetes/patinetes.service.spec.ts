import { TestBed } from '@angular/core/testing';

import { PatinetesService } from './patinetes.service';

describe('PatinetesService', () => {
  let service: PatinetesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PatinetesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
