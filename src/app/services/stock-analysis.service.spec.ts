import { TestBed } from '@angular/core/testing';

import { StockAnalysisService } from './stock-analysis.service';

describe('StockAnalysisService', () => {
  let service: StockAnalysisService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StockAnalysisService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
