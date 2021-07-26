import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FaqSiteComponent } from './faq-site.component';

describe('FaqSiteComponent', () => {
  let component: FaqSiteComponent;
  let fixture: ComponentFixture<FaqSiteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FaqSiteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FaqSiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
