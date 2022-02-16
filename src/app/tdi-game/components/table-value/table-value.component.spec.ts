import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableValueComponent } from './table-value.component';

describe('TableValueComponent', () => {
  let component: TableValueComponent;
  let fixture: ComponentFixture<TableValueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TableValueComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TableValueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
