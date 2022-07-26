import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { AgGridModule } from 'ag-grid-angular';
import { PortfolioComponent } from './pages/portfolio/portfolio.component';
import { PortfoliosComponent } from './pages/portfolios/portfolios.component';
import { PortfolioRoutingModule } from './portfolio-routing.module';



@NgModule({
  declarations: [
    PortfolioComponent,
    PortfoliosComponent
  ],
  imports: [
    CommonModule,
    PortfolioRoutingModule,
    AgGridModule,
    NgxChartsModule
  ]
})
export class PortfolioModule { }
