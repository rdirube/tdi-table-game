import { TestBed } from '@angular/core/testing';

import { TdiChallengeService } from './tdi-challenge.service';

describe('TdiChallengeService', () => {
  let service: TdiChallengeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TdiChallengeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
