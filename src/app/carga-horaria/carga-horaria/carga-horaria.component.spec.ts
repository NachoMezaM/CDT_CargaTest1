import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CargaHorariaComponent } from './carga-horaria.component';

describe('CargaHorariaComponent', () => {
  let component: CargaHorariaComponent;
  let fixture: ComponentFixture<CargaHorariaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CargaHorariaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CargaHorariaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
