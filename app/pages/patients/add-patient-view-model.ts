import { Observable, Frame, dialogs } from '@nativescript/core';
import { DataService } from '../../services/data.service';
import { Patient } from '../../models/patient.model';

export class AddPatientViewModel extends Observable {
  private dataService: DataService;
  private _name: string = '';
  private _age: string = '';
  private _gender: string = '';
  private _phone: string = '';
  private _email: string = '';
  private _address: string = '';
  private _medicalHistory: string = '';
  private _allergies: string = '';
  private _emergencyContact: string = '';

  constructor() {
    super();
    this.dataService = DataService.getInstance();
  }

  get name(): string { return this._name; }
  set name(value: string) {
    if (this._name !== value) {
      this._name = value;
      this.notifyPropertyChange('name', value);
    }
  }

  get age(): string { return this._age; }
  set age(value: string) {
    if (this._age !== value) {
      this._age = value;
      this.notifyPropertyChange('age', value);
    }
  }

  get gender(): string { return this._gender; }
  set gender(value: string) {
    if (this._gender !== value) {
      this._gender = value;
      this.notifyPropertyChange('gender', value);
    }
  }

  get phone(): string { return this._phone; }
  set phone(value: string) {
    if (this._phone !== value) {
      this._phone = value;
      this.notifyPropertyChange('phone', value);
    }
  }

  get email(): string { return this._email; }
  set email(value: string) {
    if (this._email !== value) {
      this._email = value;
      this.notifyPropertyChange('email', value);
    }
  }

  get address(): string { return this._address; }
  set address(value: string) {
    if (this._address !== value) {
      this._address = value;
      this.notifyPropertyChange('address', value);
    }
  }

  get medicalHistory(): string { return this._medicalHistory; }
  set medicalHistory(value: string) {
    if (this._medicalHistory !== value) {
      this._medicalHistory = value;
      this.notifyPropertyChange('medicalHistory', value);
    }
  }

  get allergies(): string { return this._allergies; }
  set allergies(value: string) {
    if (this._allergies !== value) {
      this._allergies = value;
      this.notifyPropertyChange('allergies', value);
    }
  }

  get emergencyContact(): string { return this._emergencyContact; }
  set emergencyContact(value: string) {
    if (this._emergencyContact !== value) {
      this._emergencyContact = value;
      this.notifyPropertyChange('emergencyContact', value);
    }
  }

  async onGenderTap() {
    const result = await dialogs.action('Select Gender', 'Cancel', ['Male', 'Female', 'Other']);
    if (result !== 'Cancel') {
      this.gender = result;
    }
  }

  async onSaveTap() {
    if (!this.validateForm()) {
      return;
    }

    try {
      const patient: Patient = {
        id: this.dataService.generateId(),
        name: this._name,
        age: parseInt(this._age),
        gender: this._gender as 'Male' | 'Female' | 'Other',
        phone: this._phone,
        email: this._email,
        address: this._address,
        medicalHistory: this._medicalHistory,
        allergies: this._allergies,
        emergencyContact: this._emergencyContact,
        registrationDate: new Date().toISOString().split('T')[0]
      };

      await this.dataService.savePatient(patient);
      
      await dialogs.alert({
        title: 'Success',
        message: 'Patient saved successfully!',
        okButtonText: 'OK'
      });

      Frame.topmost().goBack();
    } catch (error) {
      console.error('Error saving patient:', error);
      await dialogs.alert({
        title: 'Error',
        message: 'Failed to save patient. Please try again.',
        okButtonText: 'OK'
      });
    }
  }

  private validateForm(): boolean {
    if (!this._name.trim()) {
      dialogs.alert('Please enter patient name');
      return false;
    }
    if (!this._age.trim() || isNaN(parseInt(this._age))) {
      dialogs.alert('Please enter valid age');
      return false;
    }
    if (!this._gender) {
      dialogs.alert('Please select gender');
      return false;
    }
    if (!this._phone.trim()) {
      dialogs.alert('Please enter phone number');
      return false;
    }
    if (!this._emergencyContact.trim()) {
      dialogs.alert('Please enter emergency contact');
      return false;
    }
    return true;
  }

  onBackTap() {
    Frame.topmost().goBack();
  }
}