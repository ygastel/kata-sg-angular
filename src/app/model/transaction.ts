export class Transaction {

  public timeStamp = new Date();

  constructor(public operationKind: OperationKind, public amount: number) {
  }

}

export enum OperationKind {
  DEPOSIT, WITHDRAW
}
