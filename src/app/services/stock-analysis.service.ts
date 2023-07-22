import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { Stock } from "../models/stock.model";
import { Observable, forkJoin } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class StockAnalysisService {
  private API_URL = environment.apiUrl;

  private API_KEY = environment.apiKey;

  private stockList = ["IBM", "AAPL", "MSFT", "AMZN", "GOOG"];

  constructor(private http: HttpClient) { }

  getStockData(symbol: string): Observable<Stock> {
    return this.http.get<Stock>(
      `${this.API_URL}query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${this.API_KEY}`
    );
  }

  getDashboardData(stocks: string[]): Observable<Stock[]> {
    return forkJoin([...this.getStockObservables(stocks)]);
  }

  getStockObservables(stocks: string[]): Observable<Stock>[] {
    return stocks.map(stock => this.getStockData(stock));
  }

  getStockList(): string[] {
    return this.stockList;
  }

}
