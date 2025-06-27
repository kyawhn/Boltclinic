import { Observable, Frame } from '@nativescript/core';
import { DataService } from '../../services/data.service';
import { Patient } from '../../models/patient.model';

export class PatientsViewModel extends Observable {
  private dataService: DataService;
  private _patients: Patient[] = [];
  private _filteredPatients: Patient[] = [];
  private _searchQuery: string = '';

  constructor(context?: any) {
    super();
    this.dataService = DataService.getInstance();
    
    if (context?.searchQuery) {
      this._searchQuery = context.searchQuery;
    }
    
    this.loadPatients();
  }

  get patients(): Patient[] {
    return this._patients;
  }

  get filteredPatients(): Patient[] {
    return this._filteredPatients;
  }

  get searchQuery(): string {
    return this._searchQuery;
  }

  set searchQuery(value: string) {
    if (this._searchQuery !== value) {
      this._searchQuery = value;
      this.filterPatients();
      this.notifyPropertyChange('searchQuery', value);
    }
  }

  private async loadPatients() {
    try {
      this._patients = await this.dataService.getPatients();
      this.filterPatients();
      this.notifyPropertyChange('filteredPatients', this._filteredPatients);
    } catch (error) {
      console.error('Error loading patients:', error);
    }
  }

  private filterPatients() {
    if (!this._searchQuery.trim()) {
      this._filteredPatients = [...this._patients];
    } else {
      const query = this._searchQuery.toLowerCase();
      this._filteredPatients = this._patients.filter(patient =>
        patient.name.toLowerCase().includes(query) ||
        patient.phone.includes(query) ||
        patient.email?.toLowerCase().includes(query)
      );
    }
    this.notifyPropertyChange('filteredPatients', this._filteredPatients);
  }

  onPatientTap(args: any) {
    const patient = args.object.bindingContext;
    Frame.topmost().navigate({
      moduleName: 'pages/patients/patient-detail-page',
      context: { patient }
    });
  }

  onAddPatientTap() {
    Frame.topmost().navigate('pages/patients/add-patient-page');
  }

  onBackTap() {
    Frame.topmost().goBack();
  }
}