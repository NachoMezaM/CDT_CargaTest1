import { TestBed } from '@angular/core/testing';

import { VisualizarCargaService } from './visualizar-carga.service';

describe('VisualizarCargaService', () => {
  let service: VisualizarCargaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VisualizarCargaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
