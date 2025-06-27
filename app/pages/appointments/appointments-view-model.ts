import { Observable, Frame, dialogs } from '@nativescript/core';
import { DataService } from '../../services/data.service';
import { Appointment } from '../../models/appointment.model';

export class AppointmentsViewModel extends Observable {
  private dataService: DataService;
  private _appointments: Appointment[] = [];
  private _filteredAppointments: Appointment[] = [];
  private _selectedDate: string = '';
  private _filterStatus: string = 'All';

  constructor() {
    super();
    this.dataService = DataService.getInstance();
    this._selectedDate = new Date().toISOString().split('T')[0];
    this.loadAppointments();
  }

  get appointments(): Appointment[] {
    return this._appointments;
  }

  get filteredAppointments(): Appointment[] {
    return this._filteredAppointments;
  }

  get selectedDate(): string {
    return new Date(this._selectedDate).toLocaleDateString();
  }

  get allSelected(): boolean {
    return this._filterStatus === 'All';
  }

  get scheduledSelected(): boolean {
    return this._filterStatus === 'Scheduled';
  }

  get completedSelected(): boolean {
    return this._filterStatus === 'Completed';
  }

  private async loadAppointments() {
    try {
      this._appointments = await this.dataService.getAppointments();
      this.filterAppointments();
    } catch (error) {
      console.error('Error loading appointments:', error);
    }
  }

  private filterAppointments() {
    let filtered = this._appointments.filter(apt => apt.date === this._selectedDate);
    
    if (this._filterStatus !== 'All') {
      filtered = filtered.filter(apt => apt.status === this._filterStatus);
    }

    this._filteredAppointments = filtered.sort((a, b) => a.time.localeCompare(b.time));
    this.notifyPropertyChange('filteredAppointments', this._filteredAppointments);
  }

  async onDatePickerTap() {
    const result = await dialogs.prompt({
      title: 'Select Date',
      message: 'Enter date (YYYY-MM-DD):',
      defaultText: this._selectedDate,
      okButtonText: 'Select',
      cancelButtonText: 'Cancel'
    });

    if (result.result) {
      this._selectedDate = result.text;
      this.notifyPropertyChange('selectedDate', this.selectedDate);
      this.filterAppointments();
    }
  }

  onFilterAll() {
    this._filterStatus = 'All';
    this.filterAppointments();
    this.notifyPropertyChange('allSelected', true);
    this.notifyPropertyChange('scheduledSelected', false);
    this.notifyPropertyChange('completedSelected', false);
  }

  onFilterScheduled() {
    this._filterStatus = 'Scheduled';
    this.filterAppointments();
    this.notifyPropertyChange('allSelected', false);
    this.notifyPropertyChange('scheduledSelected', true);
    this.notifyPropertyChange('completedSelected', false);
  }

  onFilterCompleted() {
    this._filterStatus = 'Completed';
    this.filterAppointments();
    this.notifyPropertyChange('allSelected', false);
    this.notifyPropertyChange('scheduledSelected', false);
    this.notifyPropertyChange('completedSelected', true);
  }

  onAppointmentTap(args: any) {
    const appointment = args.object.bindingContext;
    Frame.topmost().navigate({
      moduleName: 'pages/appointments/appointment-detail-page',
      context: { appointment }
    });
  }

  onAddAppointmentTap() {
    Frame.topmost().navigate('pages/appointments/add-appointment-page');
  }

  onBackTap() {
    Frame.topmost().goBack();
  }
}