import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { DateRange, MatDateRangePicker, MatDatepickerInput } from '@angular/material/datepicker';
import { MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrl: './date-picker.component.scss'
})
export class DatePickerComponent {
  dateRangeForm: FormGroup;
  minDate = new Date();
  blockedDates: Date[] = [
    this.minDate,
  ];

  constructor(public dialogRef: MatDialogRef<DatePickerComponent>, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.dateRangeForm = this.formBuilder.group({
      start: new FormControl(),
      end: new FormControl()
    });
  }

  onSubmit() {
    const selectedRange = this.dateRangeForm.value;
    this.dialogRef.close(selectedRange);
  }

  dateFilter = (d: Date | null): boolean => {
    const date = (d || new Date());
    const today = new Date();
    return date >= today && !this.blockedDates.some(blockedDate =>
      date.getDate() === blockedDate.getDate() &&
      date.getMonth() === blockedDate.getMonth() &&
      date.getFullYear() === blockedDate.getFullYear()
    );
  }
}
