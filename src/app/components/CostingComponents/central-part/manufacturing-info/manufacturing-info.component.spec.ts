import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManufacturingInfoComponent } from './manufacturing-info.component';

describe('ManufacturingInfoComponent', () => {
  let component: ManufacturingInfoComponent;
  let fixture: ComponentFixture<ManufacturingInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManufacturingInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManufacturingInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
