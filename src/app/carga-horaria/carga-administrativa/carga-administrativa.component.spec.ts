import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CargaAdministrativaComponent } from './carga-administrativa.component';

describe('CargaAdministrativaComponent', () => {
  let component: CargaAdministrativaComponent;
  let fixture: ComponentFixture<CargaAdministrativaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CargaAdministrativaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CargaAdministrativaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
