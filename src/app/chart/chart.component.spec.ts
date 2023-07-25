import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { AppChartComponent } from './chart.component';

describe('ChartComponent', () => {
  let component: AppChartComponent;
  let fixture: ComponentFixture<AppChartComponent>;
  let debugElement: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppChartComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(AppChartComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    component.series = [{ seriesname: "name1", data: [{ value: "0" }] }];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display skeleton loading when skeleton is true', () => {
    component.skeleton = true;
    fixture.detectChanges();

    const skeletonElement = debugElement.query(By.css('.animate-pulse'));
    const fusionChartElement = debugElement.query(By.css('fusioncharts'));

    expect(skeletonElement).toBeTruthy();
    expect(fusionChartElement).toBeNull();
  });

  it('should display fusioncharts when skeleton is false', () => {
    component.skeleton = false;
    fixture.detectChanges();

    const skeletonElement = debugElement.query(By.css('.animate-pulse'));
    const fusionChartElement = debugElement.query(By.css('fusioncharts'));

    expect(skeletonElement).toBeNull();
    expect(fusionChartElement).toBeTruthy();
  });

  it('should convert categories and assign to dataSource on ngOnChanges', () => {
    const mockCategories = ['Category1', 'Category2'];
    const mockSeries = [{ seriesname: "name1", data: [{ value: "0" }] }];
    const convertedCategories = mockCategories.map((label) => { return { label }; });

    component.categories = mockCategories;
    component.series = mockSeries;

    component.ngOnChanges();

    expect(component.dataSource.dataset).toEqual(mockSeries);
    expect(component.dataSource.categories[0].category).toEqual(convertedCategories);
  });

  it('should correctly convert categories', () => {
    const mockCategories = ['Category1', 'Category2'];
    const expectedResult = mockCategories.map((label) => { return { label }; });

    const result = component["convertToCategories"](mockCategories);

    expect(result).toEqual(expectedResult);
  });

});
