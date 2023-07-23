import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { StockAnalysisService } from './stock-analysis.service';
import { of } from 'rxjs';
import { Stock } from '../models/stock.model';

describe('StockAnalysisService', () => {
  let service: StockAnalysisService;
  let httpTestingController: HttpTestingController;

  const mockStockData: Stock = {
    "Meta Data": {
      "1. Information": "Daily Prices (open, high, low, close) and Volumes",
      "2. Symbol": "IBM",
      "3. Last Refreshed": "2023-06-30",
      "4. Output Size": "Compact",
      "5. Time Zone": "US/Eastern"
    },
    "Time Series (Daily)": {
      "2023-06-30": {
        "1. open": "140.4100",
        "2. high": "141.3300",
        "3. low": "139.6300",
        "4. close": "140.0400",
      },
    }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [StockAnalysisService]
    });

    service = TestBed.inject(StockAnalysisService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return predefined stock list', () => {
    expect(service.getStockList()).toEqual(["IBM", "AAPL", "MSFT", "AMZN", "GOOG"]);
  });

  it('should return an array of stock data observables', () => {
    const stockSymbols = ['IBM', 'AAPL'];
    spyOn(service, 'getStockData').and.returnValue(of(mockStockData));

    const observables = service.getStockObservables(stockSymbols);

    expect(observables.length).toEqual(stockSymbols.length);
    expect(service.getStockData).toHaveBeenCalledTimes(stockSymbols.length);
  });

  it('should return stock data for multiple stocks', () => {
    const stockSymbols = ['IBM', 'AAPL'];
    spyOn(service, 'getStockData').and.returnValue(of(mockStockData));

    service.getDashboardData(stockSymbols).subscribe(data => {
      expect(data.length).toEqual(stockSymbols.length);
      expect(service.getStockData).toHaveBeenCalledTimes(stockSymbols.length);
    });
  });

  it('should fetch stock data from the API', () => {
    const symbol = 'IBM';
    service.getStockData(symbol).subscribe((data: Stock) => {
      expect(data).toEqual(mockStockData);
    });

    const req = httpTestingController.expectOne(
      `${service['API_URL']}query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${service['API_KEY']}`,
    );
    expect(req.request.method).toEqual('GET');
    req.flush(mockStockData);
  });
});
