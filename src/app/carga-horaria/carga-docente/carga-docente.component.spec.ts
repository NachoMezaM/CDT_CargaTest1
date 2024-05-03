import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CargaDocenteComponent } from './carga-docente.component';

describe('CargaDocenteComponent', () => {
  let component: CargaDocenteComponent;
  let fixture: ComponentFixture<CargaDocenteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CargaDocenteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CargaDocenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
