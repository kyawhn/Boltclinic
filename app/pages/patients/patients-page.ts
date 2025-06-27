import { EventData, Page } from '@nativescript/core';
import { PatientsViewModel } from './patients-view-model';

export function navigatingTo(args: EventData) {
  const page = <Page>args.object;
  page.bindingContext = new PatientsViewModel(args.context);
}