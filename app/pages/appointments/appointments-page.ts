import { EventData, Page } from '@nativescript/core';
import { AppointmentsViewModel } from './appointments-view-model';

export function navigatingTo(args: EventData) {
  const page = <Page>args.object;
  page.bindingContext = new AppointmentsViewModel();
}