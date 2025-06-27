import { EventData, Page } from '@nativescript/core';
import { AddPatientViewModel } from './add-patient-view-model';

export function navigatingTo(args: EventData) {
  const page = <Page>args.object;
  page.bindingContext = new AddPatientViewModel();
}