import { TestBed } from '@angular/core/testing';

import { TdiScoreService } from './tdi-score.service';

describe('TdiScoreService', () => {
  let service: TdiScoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TdiScoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
