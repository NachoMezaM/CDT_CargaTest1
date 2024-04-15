import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndexProfeComponent } from './index-profe.component';

describe('IndexProfeComponent', () => {
  let component: IndexProfeComponent;
  let fixture: ComponentFixture<IndexProfeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IndexProfeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(IndexProfeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
