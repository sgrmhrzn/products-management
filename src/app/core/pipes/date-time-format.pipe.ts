import { Pipe, PipeTransform } from '@angular/core';
import dayjs from 'dayjs';

@Pipe({
  name: 'dateTimeFormat',
  standalone: true
})
/**
 * Pipe to format the given datetime to time or MMM D, YYYY format
 */
export class DateTimeFormatPipe implements PipeTransform {

  transform(value: Date | undefined, type: string = ''): string {
    if (type === 'time') {
      return dayjs(value).format('h:mm a')
    } else if (type) {
      return dayjs(value).format(type);
    }
    else {
      return dayjs(value).format('MMM D, YYYY')
    }
  }

}
