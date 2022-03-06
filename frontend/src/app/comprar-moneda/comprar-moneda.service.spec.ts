import { TestBed } from '@angular/core/testing';

import { ComprarMonedaService } from './comprar-moneda.service';

describe('ComprarMonedaService', () => {
  let service: ComprarMonedaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ComprarMonedaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
