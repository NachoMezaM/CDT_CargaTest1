import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSeccionesComponent } from './view-secciones.component';

describe('ViewSeccionesComponent', () => {
  let component: ViewSeccionesComponent;
  let fixture: ComponentFixture<ViewSeccionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewSeccionesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewSeccionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
