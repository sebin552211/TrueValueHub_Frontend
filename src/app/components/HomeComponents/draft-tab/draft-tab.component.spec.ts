import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DraftTabComponent } from './draft-tab.component';

describe('DraftTabComponent', () => {
  let component: DraftTabComponent;
  let fixture: ComponentFixture<DraftTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DraftTabComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DraftTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
