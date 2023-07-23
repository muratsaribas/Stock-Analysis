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
import { ApexOptions } from "src/@vex/components/chart/chart.component";
import { defaultChartOptions } from "src/@vex/utils/default-chart-options";
import { AppChartComponent } from "../chart/chart.component";
import { Stock, TimeSeries } from "../models/stock.model";
import { TableDataModel } from "../models/tableData.model";
import { StockAnalysisService } from "../services/stock-analysis.service";
import { AppTableComponent } from "../table/table.component";

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
    AppTableComponent,
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

  options: ApexOptions = defaultChartOptions({
    grid: {
      show: true,
      strokeDashArray: 3,
      padding: {
        left: 16,
      },
    },
    chart: {
      type: "line",
      height: 300,
      sparkline: {
        enabled: false,
      },
      zoom: {
        enabled: false,
      },
    },
    stroke: {
      width: 4,
    },
    labels: [],
    xaxis: {
      type: "datetime",
      labels: {
        show: true,
      },
    },
    yaxis: {
      decimalsInFloat: 2,
      labels: {
        show: true,
      },
    },
    legend: {
      show: true,
      itemMargin: {
        horizontal: 4,
        vertical: 4,
      },
    },
  });

  series: ApexAxisChartSeries = [];

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
    const labels: string[] = [];
    this.series = this.mapDataToSeries(data, labels);

    if (this.series.length === 0) {
      this.showSnackBar();
    }

    this.options.labels = [...labels];
    this.isLoading = false;
  }

  private mapDataToSeries(
    data: Stock[],
    labels: string[]
  ): { name: string; data: number[] }[] {
    return data
      .map((stockData, index) =>
        this.getStockSeries(stockData, index === 0 ? labels : undefined)
      )
      .filter((series) => series !== undefined);
  }

  private getStockSeries(
    stockData: Stock,
    labels?: string[]
  ): { name: string; data: number[] } {
    if (stockData["Information"]) {
      return undefined;
    }

    const symbol = stockData["Meta Data"]["2. Symbol"];
    const dailyData = stockData["Time Series (Daily)"];

    const data = this.filterAndTransformData(dailyData, labels);

    return { name: symbol, data };
  }

  private filterAndTransformData(
    dailyData: { [key: string]: TimeSeries },
    labels?: string[]
  ): number[] {
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
        return +dailyData[date]["4. close"];
      });
  }

  private getLabels(): string[] {
    return this.options.labels as string[];
  }

  getTableData(): TableDataModel {
    const tableHead = this.getLabels().reverse();
    const tableData = this.series.map(({ name, data }) => ({
      name,
      data: (data as number[]).reverse(),
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
