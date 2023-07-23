import { DebugElement } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";

import { AppTableComponent } from "./table.component";
import { TableDataModel } from "../models/tableData.model";

describe("TableComponent", () => {
  let component: AppTableComponent;
  let fixture: ComponentFixture<AppTableComponent>;
  let debugElement: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AppTableComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should display skeleton loading when skeleton is true", () => {
    component.skeleton = true;
    fixture.detectChanges();

    const skeletonElement = debugElement.query(
      By.css('[data-testid="skeleton"]')
    );
    const dataTableElement = debugElement.query(
      By.css('[data-testid="dataTable"]')
    );

    expect(skeletonElement).toBeTruthy();
    expect(dataTableElement).toBeNull();
  });

  it("should display dataTableElement when skeleton is false", () => {
    component.skeleton = false;
    fixture.detectChanges();

    const skeletonElement = debugElement.query(
      By.css('[data-testid="skeleton"]')
    );
    const dataTableElement = debugElement.query(
      By.css('[data-testid="dataTable"]')
    );

    expect(skeletonElement).toBeNull();
    expect(dataTableElement).toBeTruthy();
  });

  it("should get table head", () => {
    const mockTableHead = ["head1", "head2", "head3"];
    component.data = { tableHead: mockTableHead, tableData: [] };

    expect(component.getTableHead()).toEqual(mockTableHead);
  });

  it("should get table data", () => {
    const mockTableData = [
      { name: "name1", data: [0, 1] },
      { name: "name2", data: [2, 3] },
    ];
    component.data = { tableHead: [], tableData: mockTableData };

    expect(component.getTableData()).toEqual(mockTableData);
  });
});
