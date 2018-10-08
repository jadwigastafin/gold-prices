import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Gold } from './gold.model';
import { SingleResult } from './singleResult.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  public startDate: Date;
  public endDate: Date;
  public goldRatings: Gold[] = [];
  public prices: number[];
  public maxPrice: Gold = null;
  public minPrice: Gold = null;
  public url: string;
  public singleResult: SingleResult;
  public results = [];
  public todaysDate: Date = new Date();

  constructor(
    private http: HttpClient
  ) { }

  public fetchGoldPrices(): Observable<Gold[]> {
    return this.http.get(this.url)
    .pipe(
      map((result: any[]) => result
      .map( data => new Gold(data.cena, data.data)))
    );
  }

  public getGoldPrices() {
    this.fetchGoldPrices()
      .subscribe(
        (response: Gold[]) => {
          this.goldRatings = response;
          this.prepareResults();
        }
      );
  }

  public startingDate(event, mc) {
    this.startDate = mc.inputFieldValue;
    return this.startDate;
  }

  public endingDate(event, mc) {
    this.endDate = mc.inputFieldValue;
    return this.endDate;
  }

  public setUrl(startDate: Date, endDate: Date) {
    this.url = `http://api.nbp.pl/api/cenyzlota/${startDate}/${endDate}/`;
    this.getGoldPrices();
  }

  public prepareResults() {
    const singleResult = new SingleResult(this.findMaxValue(), this.findMinValue(), this.findMedianValue() );
    this.results = new Array(singleResult);
  }

  public findMaxValue(): Gold {
    this.maxPrice = this.goldRatings.reduce((result, current) => {
      if (current.getPrice() > result.getPrice() ) {
        result = current;
      }
      return result;
    });
    return this.maxPrice;
  }

  public findMinValue(): Gold {
    this.minPrice = this.goldRatings.reduce((result, current) => {
      if (current.getPrice() < result.getPrice() ) {
        result = current;
      }
      return result;
    });
    return this.minPrice;
  }

  public findMedianValue(): number {

    this.prices = this.goldRatings.map( item => item.getPrice());
    if (this.prices.length === 0) {
      return;
    }

    this.prices.sort( (a, b) => (a - b));

    const half = Math.floor(this.prices.length / 2);

    if (this.prices.length % 2 !== 0) {
      return this.prices[half];
    }

    return Number((((this.prices[half - 1] + this.prices[half]) / 2).toFixed(2)));
  }
}
