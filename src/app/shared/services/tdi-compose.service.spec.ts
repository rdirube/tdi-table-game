import { TestBed } from '@angular/core/testing';

import { TdiComposeService } from './tdi-compose.service';

describe('TdiComposeService', () => {
  let service: TdiComposeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TdiComposeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
