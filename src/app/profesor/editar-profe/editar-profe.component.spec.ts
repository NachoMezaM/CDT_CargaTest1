import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarProfeComponent } from './editar-profe.component';

describe('EditarProfeComponent', () => {
  let component: EditarProfeComponent;
  let fixture: ComponentFixture<EditarProfeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditarProfeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditarProfeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
