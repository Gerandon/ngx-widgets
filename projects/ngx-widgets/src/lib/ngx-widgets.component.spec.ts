import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxWidgetsComponent } from './ngx-widgets.component';

describe('NgxWidgetsComponent', () => {
  let component: NgxWidgetsComponent;
  let fixture: ComponentFixture<NgxWidgetsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxWidgetsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NgxWidgetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
