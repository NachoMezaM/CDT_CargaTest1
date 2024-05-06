import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualizarCargaComponent } from './visualizar-carga.component';

describe('VisualizarCargaComponent', () => {
  let component: VisualizarCargaComponent;
  let fixture: ComponentFixture<VisualizarCargaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VisualizarCargaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VisualizarCargaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
