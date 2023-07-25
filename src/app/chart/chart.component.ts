import { Component, Input, OnChanges } from "@angular/core";
import { CommonModule } from "@angular/common";

import { FusionChartsModule } from "angular-fusioncharts";

// Load FusionCharts
import * as FusionCharts from "fusioncharts";
// Load Charts module
import * as Charts from "fusioncharts/fusioncharts.charts";
// Load fusion theme
import * as FusionTheme from "fusioncharts/themes/fusioncharts.theme.fusion";

// Add dependencies to FusionChartsModule
FusionChartsModule.fcRoot(FusionCharts, Charts, FusionTheme);

@Component({
  selector: "app-fusion-chart",
  standalone: true,
  imports: [CommonModule, FusionChartsModule],
  templateUrl: "./chart.component.html",
  styleUrls: ["./chart.component.scss"],
})
export class AppChartComponent implements OnChanges {
  @Input() skeleton!: boolean;

  @Input() series!: { seriesname: string; data: { value: string }[] }[];

  @Input() categories!: string[];

  width = "100%";

  height = "400";

  type = "msline";

  dataFormat = "json";

  dataSource = {
    chart: {
      showHoverEffect: "1",
      drawCrossLine: "1",
      theme: "fusion",
    },
    categories: [
      {
        category: [],
      },
    ],
    dataset: [],
  };

  constructor() { }

  ngOnChanges(): void {
    this.dataSource.dataset = this.series;
    this.dataSource.categories[0].category = this.convertToCategories(
      this.categories
    );
  }

  private convertToCategories(stringArr: string[]): { label: string }[] {
    return stringArr.map((label) => {
      return { label };
    });
  }
}
