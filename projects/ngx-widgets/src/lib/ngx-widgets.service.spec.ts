import { TestBed } from '@angular/core/testing';

import { NgxWidgetsService } from './ngx-widgets.service';

describe('NgxWidgetsService', () => {
  let service: NgxWidgetsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgxWidgetsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
