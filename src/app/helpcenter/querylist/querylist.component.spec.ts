import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuerylistComponent } from './querylist.component';

describe('QuerylistComponent', () => {
  let component: QuerylistComponent;
  let fixture: ComponentFixture<QuerylistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuerylistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuerylistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
