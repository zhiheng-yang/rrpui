import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChinamapComponent } from './chinamap.component';

describe('ChinamapComponent', () => {
  let component: ChinamapComponent;
  let fixture: ComponentFixture<ChinamapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChinamapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChinamapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
