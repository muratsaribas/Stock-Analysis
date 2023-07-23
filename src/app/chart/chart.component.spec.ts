import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { AppChartComponent } from './chart.component';
import { defaultChartOptions } from 'src/@vex/utils/default-chart-options';

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
    component.options = defaultChartOptions();
    component.series = [{ name: "name1", data: [0, 1, 2, 3] }];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display skeleton loading when skeleton is true', () => {
    component.skeleton = true;
    fixture.detectChanges();

    const skeletonElement = debugElement.query(By.css('.animate-pulse'));
    const vexChartElement = debugElement.query(By.css('vex-chart'));

    expect(skeletonElement).toBeTruthy();
    expect(vexChartElement).toBeNull();
  });

  it('should display vex-chart when skeleton is false', () => {
    component.skeleton = false;
    fixture.detectChanges();

    const skeletonElement = debugElement.query(By.css('.animate-pulse'));
    const vexChartElement = debugElement.query(By.css('vex-chart'));

    expect(skeletonElement).toBeNull();
    expect(vexChartElement).toBeTruthy();
  });

});
