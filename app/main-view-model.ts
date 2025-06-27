import { Observable, Frame } from '@nativescript/core';
import { DataService } from './services/data.service';

export class MainViewModel extends Observable {
  private dataService: DataService;
  private _todayAppointments: number = 0;
  private _totalPatients: number = 0;
  private _monthlyIncome: string = '$0';
  private _pendingAppointments: number = 0;
  private _searchText: string = '';
  private _recentActivities: any[] = [];

  constructor() {
    super();
    this.dataService = DataService.getInstance();
    this.loadDashboardData();
  }

  get todayAppointments(): number {
    return this._todayAppointments;
  }

  get totalPatients(): number {
    return this._totalPatients;
  }

  get monthlyIncome(): string {
    return this._monthlyIncome;
  }

  get pendingAppointments(): number {
    return this._pendingAppointments;
  }

  get searchText(): string {
    return this._searchText;
  }

  set searchText(value: string) {
    if (this._searchText !== value) {
      this._searchText = value;
      this.notifyPropertyChange('searchText', value);
    }
  }

  get recentActivities(): any[] {
    return this._recentActivities;
  }

  private async loadDashboardData() {
    try {
      const today = new Date().toISOString().split('T')[0];
      const currentMonth = today.substring(0, 7);

      // Load appointments
      const appointments = await this.dataService.getAppointments();
      this._todayAppointments = appointments.filter(a => a.date === today).length;
      this._pendingAppointments = appointments.filter(a => a.status === 'Scheduled').length;

      // Load patients
      const patients = await this.dataService.getPatients();
      this._totalPatients = patients.length;

      // Load financial data
      const financialRecords = await this.dataService.getFinancialRecords();
      const monthlyIncomeRecords = financialRecords.filter(r => 
        r.type === 'Income' && r.date.startsWith(currentMonth)
      );
      const monthlyIncomeTotal = monthlyIncomeRecords.reduce((sum, r) => sum + Number(r.amount), 0);
      this._monthlyIncome = `$${monthlyIncomeTotal.toLocaleString()}`;

      // Recent activities
      this._recentActivities = [
        { activity: 'New patient registered: John Doe', time: '2 hours ago' },
        { activity: 'Appointment completed: Jane Smith', time: '4 hours ago' },
        { activity: 'Payment received: $150', time: '6 hours ago' }
      ];

      this.notifyPropertyChange('todayAppointments', this._todayAppointments);
      this.notifyPropertyChange('totalPatients', this._totalPatients);
      this.notifyPropertyChange('monthlyIncome', this._monthlyIncome);
      this.notifyPropertyChange('pendingAppointments', this._pendingAppointments);
      this.notifyPropertyChange('recentActivities', this._recentActivities);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  }

  onSearchPatients() {
    if (this._searchText.trim()) {
      Frame.topmost().navigate({
        moduleName: 'pages/patients/patients-page',
        context: { searchQuery: this._searchText }
      });
    }
  }

  onAppointmentsTap() {
    Frame.topmost().navigate('pages/appointments/appointments-page');
  }

  onPatientsTap() {
    Frame.topmost().navigate('pages/patients/patients-page');
  }

  onFinancialTap() {
    Frame.topmost().navigate('pages/financial/financial-page');
  }

  onReportsTap() {
    Frame.topmost().navigate('pages/reports/reports-page');
  }

  onSettingsTap() {
    Frame.topmost().navigate('pages/settings/settings-page');
  }
}