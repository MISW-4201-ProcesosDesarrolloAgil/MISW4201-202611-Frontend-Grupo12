/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { MovimientoService } from './movimiento.service';

describe('Service: Movimiento', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MovimientoService]
    });
  });

  it('should ...', inject([MovimientoService], (service: MovimientoService) => {
    expect(service).toBeTruthy();
  }));
});
