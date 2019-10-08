import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NasabahComponent } from './nasabah.component';

describe('NasabahComponent', () => {
  let component: NasabahComponent;
  let fixture: ComponentFixture<NasabahComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NasabahComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NasabahComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
