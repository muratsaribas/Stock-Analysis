import { Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TableDataModel } from "../models/tableData.model";

@Component({
  selector: "app-vex-table",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./table.component.html",
  styleUrls: ["./table.component.scss"],
})
export class AppTableComponent {
  @Input() skeleton!: boolean;

  @Input() data!: TableDataModel;

  constructor() { }

  getTableHead() {
    return this.data?.tableHead;
  }

  getTableData() {
    return this.data?.tableData;
  }
}
