import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManufacturingUpdateformComponent } from './manufacturing-updateform.component';

describe('ManufacturingUpdateformComponent', () => {
  let component: ManufacturingUpdateformComponent;
  let fixture: ComponentFixture<ManufacturingUpdateformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManufacturingUpdateformComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManufacturingUpdateformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
