import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterEnd } from './footer-end';

describe('FooterEnd', () => {
  let component: FooterEnd;
  let fixture: ComponentFixture<FooterEnd>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FooterEnd]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FooterEnd);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
