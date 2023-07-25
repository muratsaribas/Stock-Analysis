import { ComponentFixture, TestBed } from "@angular/core/testing";

import { StockAnalysisComponent } from "./stock-analysis.component";
import { StockAnalysisService } from "../services/stock-analysis.service";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { ReactiveFormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { TableDataModel } from "../models/tableData.model";
import { Stock } from "../models/stock.model";
import { of, throwError } from "rxjs";

describe("StockAnalysisComponent", () => {
  let component: StockAnalysisComponent;
  let fixture: ComponentFixture<StockAnalysisComponent>;
  let mockStockAnalysisService = jasmine.createSpyObj(["getStockList", "getDashboardData"]);

  const stockData: Stock = {
    "Meta Data": {
      "1. Information": "Test",
      "2. Symbol": "MSFT",
      "3. Last Refreshed": "",
      "4. Output Size": "",
      "5. Time Zone": "",
    },
    "Time Series (Daily)": {
      "2023-07-22": {
        "1. open": "",
        "2. high": "",
        "3. low": "",
        "4. close": "140.0000",
      },
      "2023-07-21": {
        "1. open": "",
        "2. high": "",
        "3. low": "",
        "4. close": "138.0000",
      },
    },
  };

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        ReactiveFormsModule,
        StockAnalysisComponent,
        MatSnackBarModule
      ],
      providers: [
        { provide: StockAnalysisService, useValue: mockStockAnalysisService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(StockAnalysisComponent);
    component = fixture.componentInstance;
    component.stockForm.setValue({
      stocks: [],
      start: new Date("2023-07-01"),
      end: new Date("2023-07-31"),
    });
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should load stockList on init", () => {
    const testStockList = ["IBM", "AAPL", "MSFT", "AMZN", "GOOG"];
    mockStockAnalysisService.getStockList.and.returnValue(testStockList);
    component.ngOnInit();

    expect(component.stockList).toEqual(testStockList);
  });

  it("should correctly check if date is within range", () => {
    const startDate = new Date("2023-07-01");
    const endDate = new Date("2023-07-31");

    let targetDate = "2023-07-15";
    expect(
      component["isDateWithinRange"](targetDate, startDate, endDate)
    ).toBeTrue();

    targetDate = "2022-06-30";
    expect(
      component["isDateWithinRange"](targetDate, startDate, endDate)
    ).toBeFalse();

    targetDate = "2022-08-01";
    expect(
      component["isDateWithinRange"](targetDate, startDate, endDate)
    ).toBeFalse();
  });

  it("should return labels", () => {
    component.labels = ["label1", "label2", "label3"];

    expect(component["getLabels"]()).toEqual(["label1", "label2", "label3"]);
  });

  it("should return table data", () => {
    component.labels = ["label1", "label2", "label3"];
    component.series = [
      { seriesname: "series1", data: [{ value: "0" }, { value: "1" }, { value: "2" }] },
      { seriesname: "series2", data: [{ value: "4" }, { value: "5" }, { value: "6" }] },
    ];

    const expectedTableData: TableDataModel = {
      tableHead: ["label1", "label2", "label3"],
      tableData: [
        { name: "series1", data: ["0", "1", "2"] },
        { name: "series2", data: ["4", "5", "6"] },
      ],
    };

    expect(component.getTableData()).toEqual(expectedTableData);
  });

  it("should map data to series", () => {
    const labels: string[] = [];
    const series = component["mapDataToSeries"]([stockData], labels);

    expect(series).toEqual([{ seriesname: "MSFT", data: [{ value: "138.00" }, { value: "140.00" }] }]);

    expect(labels).toEqual(["2023-07-22", "2023-07-21"]);
  });

  it("should get stock series", () => {
    const series = component["getStockSeries"](stockData);

    expect(series).toEqual({ seriesname: "MSFT", data: [{ value: "138.00" }, { value: "140.00" }] });
  });

  it("should filter and transform data", () => {
    component.stockForm.get("start").setValue(new Date("2023-07-21"));
    component.stockForm.get("end").setValue(new Date("2023-07-22"));
    const data = component["filterAndTransformData"](
      stockData["Time Series (Daily)"]
    );

    expect(data).toEqual([{ value: "140.00" }, { value: "138.00" }]);
  });

  it("should handle data correctly", () => {
    const mockStocks = ["MSFT", "AAPL"];
    const mockData: Stock[] = [
      {
        "Meta Data": {
          "1. Information": "Test",
          "2. Symbol": "MSFT",
          "3. Last Refreshed": "",
          "4. Output Size": "",
          "5. Time Zone": "",
        },
        "Time Series (Daily)": {
          "2023-07-22": {
            "1. open": "",
            "2. high": "",
            "3. low": "",
            "4. close": "140.00",
          },
          "2023-07-21": {
            "1. open": "",
            "2. high": "",
            "3. low": "",
            "4. close": "138.00",
          },
        },
      },
      {
        "Meta Data": {
          "1. Information": "Test",
          "2. Symbol": "AAPL",
          "3. Last Refreshed": "",
          "4. Output Size": "",
          "5. Time Zone": "",
        },
        "Time Series (Daily)": {
          "2023-07-22": {
            "1. open": "",
            "2. high": "",
            "3. low": "",
            "4. close": "140.00",
          },
          "2023-07-21": {
            "1. open": "",
            "2. high": "",
            "3. low": "",
            "4. close": "138.00",
          },
        },
      },
    ];

    component.stockForm.get("stocks").setValue(mockStocks);
    mockStockAnalysisService.getDashboardData.and.returnValue(of(mockData));

    component.show();

    expect(component.isLoading).toBeFalse();
    expect(component.labels.length).toBeGreaterThan(0);
  });

  it("should clear series and labels when the series includes undefined", () => {
    const mockStocks = ["MSFT", "AAPL"];
    const mockData: Stock[] = [
      {
        "Meta Data": {
          "1. Information": "Test",
          "2. Symbol": "MSFT",
          "3. Last Refreshed": "",
          "4. Output Size": "",
          "5. Time Zone": "",
        },
        "Time Series (Daily)": {},
        "Note": "test"
      }
    ];

    component.stockForm.get("stocks").setValue(mockStocks);

    component["handleData"](mockData);

    expect(component.series).toEqual([]);
    expect(component.labels).toEqual([]);
  });

  it("should log an error when getDashboardData fails", () => {
    const mockStocks = ["MSFT", "AAPL"];

    component.stockForm.get("stocks").setValue(mockStocks);
    mockStockAnalysisService.getDashboardData.and.returnValue(throwError(() => new Error('test')));

    spyOn(console, 'error');

    component.show();

    expect(console.error).toHaveBeenCalled();
  });

});
