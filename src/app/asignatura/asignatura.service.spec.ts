import { TestBed } from '@angular/core/testing';

import { asignaturaService } from './asignatura.service';

describe('AsignaturaService', () => {
  let service: asignaturaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(asignaturaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
