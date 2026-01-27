/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { PropiedadService } from './propiedad.service';

describe('Service: Propiedad', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PropiedadService]
    });
  });

  it('should ...', inject([PropiedadService], (service: PropiedadService) => {
    expect(service).toBeTruthy();
  }));
});
