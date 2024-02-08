import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'stockMessage',
  standalone: true,
})
export class StockMessage implements PipeTransform {
  transform(value: number) {
    if (value === 0) {
      return 'Stoc epuizat';
    } else if (value >= 1 && value <= 15) {
      return 'Ultimele produse';
    } else if (value >= 16 && value <= 50) {
      return 'Stoc limitat';
    } else {
      return 'In stoc';
    }
  }
}
