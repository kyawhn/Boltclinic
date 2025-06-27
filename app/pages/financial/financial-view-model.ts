import { Observable, Frame } from '@nativescript/core';
import { DataService } from '../../services/data.service';
import { FinancialRecord } from '../../models/financial.model';

export class FinancialViewModel extends Observable {
  private dataService: DataService;
  private _records: FinancialRecord[] = [];
  private _filteredRecords: FinancialRecord[] = [];
  private _filterType: string = 'All';
  private _totalIncome: string = '$0';
  private _totalExpenses: string = '$0';
  private _netProfit: string = '$0';

  constructor() {
    super();
    this.dataService = DataService.getInstance();
    this.loadFinancialRecords();
  }

  get records(): FinancialRecord[] {
    return this._records;
  }

  get filteredRecords(): FinancialRecord[] {
    return this._filteredRecords;
  }

  get totalIncome(): string {
    return this._totalIncome;
  }

  get totalExpenses(): string {
    return this._totalExpenses;
  }

  get netProfit(): string {
    return this._netProfit;
  }

  get allSelected(): boolean {
    return this._filterType === 'All';
  }

  get incomeSelected(): boolean {
    return this._filterType === 'Income';
  }

  get expensesSelected(): boolean {
    return this._filterType === 'Expense';
  }

  private async loadFinancialRecords() {
    try {
      this._records = await this.dataService.getFinancialRecords();
      this.calculateSummary();
      this.filterRecords();
    } catch (error) {
      console.error('Error loading financial records:', error);
    }
  }

  private calculateSummary() {
    const income = this._records
      .filter(r => r.type === 'Income')
      .reduce((sum, r) => sum + Number(r.amount), 0);
    
    const expenses = this._records
      .filter(r => r.type === 'Expense')
      .reduce((sum, r) => sum + Number(r.amount), 0);

    this._totalIncome = `$${income.toLocaleString()}`;
    this._totalExpenses = `$${expenses.toLocaleString()}`;
    this._netProfit = `$${(income - expenses).toLocaleString()}`;

    this.notifyPropertyChange('totalIncome', this._totalIncome);
    this.notifyPropertyChange('totalExpenses', this._totalExpenses);
    this.notifyPropertyChange('netProfit', this._netProfit);
  }

  private filterRecords() {
    if (this._filterType === 'All') {
      this._filteredRecords = [...this._records];
    } else {
      this._filteredRecords = this._records.filter(r => r.type === this._filterType);
    }
    
    this._filteredRecords.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    this.notifyPropertyChange('filteredRecords', this._filteredRecords);
  }

  onFilterAll() {
    this._filterType = 'All';
    this.filterRecords();
    this.updateFilterButtons();
  }

  onFilterIncome() {
    this._filterType = 'Income';
    this.filterRecords();
    this.updateFilterButtons();
  }

  onFilterExpenses() {
    this._filterType = 'Expense';
    this.filterRecords();
    this.updateFilterButtons();
  }

  private updateFilterButtons() {
    this.notifyPropertyChange('allSelected', this.allSelected);
    this.notifyPropertyChange('incomeSelected', this.incomeSelected);
    this.notifyPropertyChange('expensesSelected', this.expensesSelected);
  }

  onAddRecordTap() {
    Frame.topmost().navigate('pages/financial/add-financial-page');
  }

  onBackTap() {
    Frame.topmost().goBack();
  }
}