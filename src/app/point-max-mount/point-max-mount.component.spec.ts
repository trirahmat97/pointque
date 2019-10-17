import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PointMaxMountComponent } from './point-max-mount.component';

describe('PointMaxMountComponent', () => {
  let component: PointMaxMountComponent;
  let fixture: ComponentFixture<PointMaxMountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PointMaxMountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PointMaxMountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
