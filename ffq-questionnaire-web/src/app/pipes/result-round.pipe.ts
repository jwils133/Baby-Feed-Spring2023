/*
Added by Christian Diaz
This pipe is used to round the results in FFQ History to 3 significant digits. If the value is greater than 1000, the number is rounded to the nearest integer
*/
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'resultRound'
})
export class ResultRoundPipe implements PipeTransform {

  transform(value: any): any {
    let roundedValue = 0;

    if (value >= 1000)
    {
      roundedValue = Math.round(value);
      return roundedValue;
    }

    roundedValue = value.toPrecision(3);
    return roundedValue;
  }

}
