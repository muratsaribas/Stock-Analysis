import { Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ChartModule } from "src/@vex/components/chart/chart.module";
import { ApexOptions } from "src/@vex/components/chart/chart.component";

@Component({
  selector: "app-vex-chart",
  standalone: true,
  imports: [CommonModule, ChartModule],
  templateUrl: "./chart.component.html",
  styleUrls: ["./chart.component.scss"],
})
export class AppChartComponent {
  @Input() options!: ApexOptions;

  @Input() series!: ApexAxisChartSeries | ApexNonAxisChartSeries;

  @Input() skeleton!: boolean;

  constructor() { }
}
