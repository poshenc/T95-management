import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { SwiperModule } from "swiper/angular";
import { SharedModule } from './../../shared/shared.module';
import { HoldingsCardComponent } from './components/holdings-card/holdings-card.component';
import { PortfolioCardComponent } from './components/portfolio-card/portfolio-card.component';
import { PriceCardComponent } from './components/price-card/price-card.component';
import { ProfileCardComponent } from './components/profile-card/profile-card.component';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './pages/home.component';



@NgModule({
  declarations: [
    HomeComponent,
    PriceCardComponent,
    HoldingsCardComponent,
    PortfolioCardComponent,
    ProfileCardComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    MatTableModule,
    SharedModule,
    SwiperModule,
    NgxChartsModule
  ]
})
export class HomeModule { }
