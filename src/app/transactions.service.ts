import {Injectable} from '@angular/core';
import {OperationKind, Transaction} from './model/transaction';
import {Observable, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TransactionsService {

  private readonly transaction = new Array<Transaction>();

  private readonly transactionSubject = new Subject<Transaction>();

  constructor() {
  }

  public getTransactionObs(): Observable<Transaction> {
    return this.transactionSubject.asObservable();
  }

  public doDeposit(amount: number) {
    if (amount < 0) {
      throw new Error('Deposit must a positive number');
    }
    this.transaction.push(new Transaction(OperationKind.DEPOSIT, amount));
    this.transactionSubject.next(this.transaction[this.transaction.length - 1]);
  }

  public doWithdraw(amount: number) {
    if (amount < 0) {
      throw new Error('Withdraw must a positive number');
    }
    this.transaction.push(new Transaction(OperationKind.WITHDRAW, -amount));
    this.transactionSubject.next(this.transaction[this.transaction.length - 1]);
  }

  public getBalance(): number {
    return this.transaction && this.transaction.length > 0 ?
      this.transaction.map<number>(transaction => transaction.amount).reduce((sum, current) => sum + current, 0) : 0;
  }

}
