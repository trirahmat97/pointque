import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataRewardComponent } from './data-reward.component';

describe('DataRewardComponent', () => {
  let component: DataRewardComponent;
  let fixture: ComponentFixture<DataRewardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataRewardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataRewardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
