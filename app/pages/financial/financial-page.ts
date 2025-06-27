import { EventData, Page } from '@nativescript/core';
import { FinancialViewModel } from './financial-view-model';

export function navigatingTo(args: EventData) {
  const page = <Page>args.object;
  page.bindingContext = new FinancialViewModel();
}