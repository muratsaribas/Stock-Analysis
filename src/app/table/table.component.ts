import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableDataModel } from '../models/tableData.model';

@Component({
  selector: 'app-vex-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class AppTableComponent implements OnInit {

  @Input() skeleton!: boolean;

  @Input() data!: TableDataModel;

  constructor() { }

  ngOnInit(): void {
  }

  getTableHead() {
    return this.data.tableHead;
  }

  getTableData() {
    return this.data.tableData;
  }

}
