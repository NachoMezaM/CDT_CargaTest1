import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CargaHoraria2Component } from './carga-horaria2.component';

describe('CargaHoraria2Component', () => {
  let component: CargaHoraria2Component;
  let fixture: ComponentFixture<CargaHoraria2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CargaHoraria2Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CargaHoraria2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
