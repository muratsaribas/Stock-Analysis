import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatButtonModule } from "@angular/material/button";
import {
  FormControl,
  Validators,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule } from "@angular/material/core";
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";
import { AppChartComponent } from "../chart/chart.component";
import { Stock, TimeSeries } from "../models/stock.model";
import { TableDataModel } from "../models/tableData.model";
import { StockAnalysisService } from "../services/stock-analysis.service";
import { AppTableComponent } from "../table/table.component";

type StockSeries = { seriesname: string, data: { value: string }[] };

@Component({
  selector: "vex-stock-analysis",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSnackBarModule,
    AppChartComponent,
    AppTableComponent
  ],
  templateUrl: "./stock-analysis.component.html",
  styleUrls: ["./stock-analysis.component.scss"],
})
export class StockAnalysisComponent implements OnInit {
  stockForm = new FormGroup({
    stocks: new FormControl<string[]>([], Validators.required),
    start: new FormControl<Date>(null, Validators.required),
    end: new FormControl<Date>(null, Validators.required),
  });

  stockList: string[];

  min = new Date();

  max = new Date();

  series: StockSeries[] = [];

  labels: string[] = [];

  isLoading = false;

  constructor(
    private stockService: StockAnalysisService,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.min.setMonth(this.max.getMonth() - 2);
    this.stockList = this.stockService.getStockList();
  }

  show(): void {
    const stocks = this.stockForm.get("stocks").value;

    this.isLoading = true;
    this.stockService.getDashboardData(stocks).subscribe({
      next: (data) => {
        this.handleData(data);
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  private handleData(data: Stock[]): void {
    let labels: string[] = [];
    this.series = this.mapDataToSeries(data, labels);

    if (this.series.includes(undefined)) {
      this.showSnackBar();
      this.series = [];
      labels = [];
    }

    this.labels = [...labels.reverse()];
    this.isLoading = false;
  }

  private mapDataToSeries(
    data: Stock[],
    labels: string[]
  ): StockSeries[] {
    return data
      .map((stockData, index) =>
        this.getStockSeries(stockData, index === 0 ? labels : undefined)
      )
  }

  private getStockSeries(
    stockData: Stock,
    labels?: string[]
  ): StockSeries {
    if (stockData["Information"] || stockData["Note"]) {
      return undefined;
    }

    const symbol = stockData["Meta Data"]["2. Symbol"];
    const dailyData = stockData["Time Series (Daily)"];

    const data = this.filterAndTransformData(dailyData, labels).reverse();

    return { seriesname: symbol, data };
  }

  private filterAndTransformData(
    dailyData: { [key: string]: TimeSeries },
    labels?: string[]
  ): { value: string }[] {
    return Object.keys(dailyData)
      .filter((date) =>
        this.isDateWithinRange(
          date,
          this.stockForm.get("start").value,
          this.stockForm.get("end").value
        )
      )
      .map((date) => {
        labels?.push(date);
        return { value: dailyData[date]["4. close"].slice(0, -2) };
      });
  }

  private getLabels(): string[] {
    return this.labels;
  }

  getTableData(): TableDataModel {
    const tableHead = this.getLabels();
    const tableData = this.series.map(({ seriesname, data }) => ({
      name: seriesname,
      data: data.map(item => item.value),
    }));

    return { tableHead, tableData };
  }

  private isDateWithinRange(
    targetDateString: string,
    startDate: Date,
    endDate: Date
  ): boolean {
    const targetDate = new Date(targetDateString);
    return targetDate >= startDate && targetDate <= endDate;
  }

  private showSnackBar(): void {
    this._snackBar.open(
      "Günlük veya dakikalık istek limiti aşıldı! Sonra tekrar deneyiniz.",
      "Anladım",
      {
        duration: 5000,
      }
    );
  }
}
