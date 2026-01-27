/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ReservaService } from './reserva.service';

describe('Service: Reserva', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ReservaService]
    });
  });

  it('should ...', inject([ReservaService], (service: ReservaService) => {
    expect(service).toBeTruthy();
  }));
});
