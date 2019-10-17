import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListRewardComponent } from './list-reward.component';

describe('ListRewardComponent', () => {
  let component: ListRewardComponent;
  let fixture: ComponentFixture<ListRewardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListRewardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListRewardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
