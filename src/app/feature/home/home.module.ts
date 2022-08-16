import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './pages/home.component';
import { HomeRoutingModule } from './home-routing.module';
import { PriceCardComponent } from './components/price-card/price-card.component';
import { HoldingsCardComponent } from './components/holdings-card/holdings-card.component';
import { PortfolioCardComponent } from './components/portfolio-card/portfolio-card.component';



@NgModule({
  declarations: [
    HomeComponent,
    PriceCardComponent,
    HoldingsCardComponent,
    PortfolioCardComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule
  ]
})
export class HomeModule { }
