import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApiSiteComponent } from './api-site.component';

describe('ApiSiteComponent', () => {
  let component: ApiSiteComponent;
  let fixture: ComponentFixture<ApiSiteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApiSiteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApiSiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
