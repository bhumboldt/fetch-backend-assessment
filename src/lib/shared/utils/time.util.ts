import * as moment from 'moment';

export const getMoment = (dateTime: string, format?: string): moment.Moment =>
  moment(dateTime, format);
