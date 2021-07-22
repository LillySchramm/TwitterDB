import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainTopTopTableButtonComponent } from './main-top-top-table-button.component';

describe('MainTopTopTableButtonComponent', () => {
  let component: MainTopTopTableButtonComponent;
  let fixture: ComponentFixture<MainTopTopTableButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MainTopTopTableButtonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MainTopTopTableButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
