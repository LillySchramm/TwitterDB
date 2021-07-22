import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainTopTableComponent } from './main-top-table.component';

describe('MainTopTableComponent', () => {
  let component: MainTopTableComponent;
  let fixture: ComponentFixture<MainTopTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MainTopTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MainTopTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
