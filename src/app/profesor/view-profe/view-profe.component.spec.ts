import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewProfeComponent } from './view-profe.component';

describe('ViewProfeComponent', () => {
  let component: ViewProfeComponent;
  let fixture: ComponentFixture<ViewProfeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewProfeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewProfeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
