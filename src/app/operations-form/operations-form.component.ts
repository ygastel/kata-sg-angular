import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, Validators} from '@angular/forms';
import {TransactionsService} from '../transactions.service';

@Component({
  selector: 'app-operations-form',
  templateUrl: './operations-form.component.html',
  styleUrls: ['./operations-form.component.scss']
})
export class OperationsFormComponent implements OnInit {

  public readonly operationsForm = this.formBuilder.group({
    operationType: new FormControl('deposit'),
    /** Regex use to validate max two decimals digits. */
    amount: new FormControl(0, [Validators.required, Validators.pattern('^[0-9]\\d{0,9}(\\.\\d{1,2})?%?$')])
  })

  public balance = 0;

  constructor(private readonly formBuilder: FormBuilder, private readonly transactionsService: TransactionsService) {
  }

  ngOnInit(): void {
  }

  public onSubmit(): void {
    const amount = this.operationsForm.get('amount')?.value;
    if ('deposit' === this.operationsForm.get('operationType')?.value) {
      this.transactionsService.doDeposit(amount);
    } else {
      this.transactionsService.doWithdraw(amount);
    }
    this.balance = this.transactionsService.getBalance();
  }
}
