import { TestBed } from '@angular/core/testing';

import { TdiAnswerService } from './tdi-answer.service';

describe('TdiAnswerService', () => {
  let service: TdiAnswerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TdiAnswerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
