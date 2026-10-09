import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TechCarrousel } from './tech-carrousel';

describe('TechCarrousel', () => {
  let component: TechCarrousel;
  let fixture: ComponentFixture<TechCarrousel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TechCarrousel]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TechCarrousel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
