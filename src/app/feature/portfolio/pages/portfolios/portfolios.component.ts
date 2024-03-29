import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { curveBasis } from 'd3-shape';
import { lastValueFrom, Subject } from 'rxjs';
import { PortfolioDetail } from '../../models/portfolio-detail.model';
import { PortfolioPositionElement } from '../../models/portfolio-position.model';
import { PortfolioValueElement } from '../../models/portfolio-value.model';
import { PieChartElement } from '../../models/position-pie-chart.model';
import { PortfolioService } from '../../services/portfolio/portfolio.service';
import { NewPortfolioComponent } from '../new-portfolio/new-portfolio.component';


@Component({
  selector: 'app-portfolios',
  templateUrl: './portfolios.component.html',
  styleUrls: ['./portfolios.component.scss']
})
export class PortfoliosComponent implements OnInit {

  //custom legends
  allPortfoliosWithColor: any = [];
  onHoverTrueEmitSubject: Subject<void> = new Subject<void>();
  onHoverFalseEmitSubject: Subject<void> = new Subject<void>();

  //for pie chart
  public portfoliosLoaded = false;
  public positionsLoaded = false;
  public portfoliosData = [] as PortfolioDetail[];
  public allPortfolios = [] as PieChartElement[];
  public allPositions = [] as PieChartElement[];

  //for line chart
  historyData!: any;
  // public view: any = [700, 400];
  public curve: any = curveBasis;
  public showXAxis = true;
  public showYAxis = true;
  public gradient = false;
  public showLegend = true;
  public showXAxisLabel = true;
  public xAxisLabel!: "Years";
  public showYAxisLabel = true;
  public yAxisLabel!: "Dollars";
  public graphDataChart!: any[];
  public colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };

  constructor(private portfolioService: PortfolioService, private router: Router, private dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.fetchAllPortfolioPositions();
  }

  async fetchAllPortfolioPositions() {
    this.portfoliosData = [];
    this.allPortfolios = [];
    this.allPositions = [];
    this.portfoliosData = await lastValueFrom(this.portfolioService.getPortfolios());
    if (this.portfoliosData.length > 0) {
      this.fetchHistoricalData(this.portfoliosData);
      const portfolioPositions = await this.runAsync(this.portfoliosData);
      this.portfoliosLoaded = true;
      this.allPositions = this.portfolioService.calculateAllocations(portfolioPositions);
      this.positionsLoaded = true;
    }
  }

  async runAsync(portfoliosData: any): Promise<PortfolioPositionElement[]> {
    let portfolioPositions = [] as PortfolioPositionElement[];
    for (let portfolio of portfoliosData) {
      //fetch portfolio positions
      const position: PortfolioPositionElement[] = await lastValueFrom(this.portfolioService.getPortfolioPositions(portfolio.id));

      //for all portfolios data
      const numbers = position.map(val => Number(val.price) * val.quantity);
      const sum = numbers.reduce((a, b) => a + b, 0);
      const result = {
        name: portfolio.name,
        value: sum + portfolio.cash
      }
      this.allPortfolios = [...this.allPortfolios, result]

      //for all positions data
      portfolioPositions = [...portfolioPositions, ...position]
    }

    //for chart custom legend
    this.getColorCodes();

    return portfolioPositions
  }

  async fetchHistoricalData(portfoliosData: any) {
    const minDate = await this.getMinDateOfAllPortfolios()
    const nowDate = new Date().toISOString().slice(0, 10)
    const values: PortfolioValueElement[] = await lastValueFrom(this.portfolioService.getAllPortfoliosValueByDateRange(minDate, nowDate));
    this.historyData = this.sortPortfolios(portfoliosData, values);
  }

  async getMinDateOfAllPortfolios(): Promise<string> {
    let minDate: string = "";
    for (const portfolio of this.portfoliosData) {
      const res = await lastValueFrom(this.portfolioService.getEarliestDateOfPortfolio(portfolio.id))
      if (minDate === "") {
        minDate = res.date
      } else {
        minDate = Date.parse(res.date) < Date.parse(minDate) ? res.date : minDate
      }
    }
    return minDate
  }

  sortPortfolios(portfolios: PortfolioDetail[], values: PortfolioValueElement[]) {
    const portfolioIds = values.map((portfolio) => portfolio.portfolio_id);
    const uniqueIds = [...new Set(portfolioIds)];
    const portfoliosHistory = uniqueIds.map((id) => {
      const history = values.filter(portfolio => portfolio.portfolio_id === id);
      const portfolioValues = history.map((portfolio) => {
        return {
          name: portfolio.date,
          value: portfolio.value
        }
      });
      return {
        name: portfolios.find((p) => p.id === id)!.name,
        series: portfolioValues
      }
    })
    return portfoliosHistory;
  }

  onPieSelect(event: any) {
    const portfolio = this.portfoliosData.find(portfolio => portfolio.name === event.name);
    if (portfolio !== undefined) {
      this.router.navigate([`/portfolio/${portfolio.id}`]);
    }
  }

  onNewPortfolio() {
    const dialogRef = this.dialog.open(NewPortfolioComponent, {
      width: '300px',
      height: '250px'
    })

    dialogRef.afterClosed().subscribe(action => {
      if (action === 'onConfirm') {
        this.fetchAllPortfolioPositions();
      }
    })
  }

  //for custom legends
  getColorCodes(): void {
    let element;
    let colorCode;

    for (let i = 0; i < this.allPortfolios.length; i++) {
      element = document.querySelector('[ng-reflect-label="' + this.allPortfolios[i].name + '"');
      colorCode = element?.getAttribute("ng-reflect-color")
      this.allPortfoliosWithColor[i] = this.allPortfolios[i];
      this.allPortfoliosWithColor[i][i] = colorCode;
    }
  }

  onHover($event: any): void {
    this.onHoverTrueEmitSubject.next($event)
  }

  onHoverFalse($event: any): void {
    this.onHoverFalseEmitSubject.next($event)
  }

  onClickEmit(data: any) {
    const portfolioId = this.portfoliosData.find(portfolio => portfolio.name === data.name)?.id;
    if (data.name) {
      this.router.navigate([`/portfolio/${portfolioId}`]);
    }
  }

}
