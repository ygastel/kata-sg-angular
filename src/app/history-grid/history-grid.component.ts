import {Component, OnDestroy} from '@angular/core';
import {ColDef, GridApi, GridOptions, GridReadyEvent} from 'ag-grid-community';
import {TransactionsService} from '../transactions.service';

@Component({
  selector: 'app-history-grid',
  templateUrl: './history-grid.component.html',
  styleUrls: ['./history-grid.component.scss']
})
export class HistoryGridComponent implements OnDestroy {

  public readonly gridOptions = HistoryGridComponent.buildGridOptions();
  private gridApi: GridApi | undefined;

  public readonly transactionSubscription = this.transactionService.getTransactionObs().subscribe(transaction => {
    this.gridApi?.applyTransaction({add: [transaction]});
  })

  constructor(private readonly transactionService: TransactionsService) {
  }

  private static getColumnsDefinition(): ColDef[] {
    return [
      {
        field: 'timeStamp',
        headerName: 'Date time',
        sort: 'asc'
      },
      {
        field: 'operationKind',
        headerName: 'Operation',
        valueGetter: params => params.data['operationKind'] === 1 ? 'Withdraw' : 'Deposit'
      },
      {
        field: 'amount',
        headerName: 'Amount',
        valueFormatter: params => `€ ${params.data['amount']}`,
        cellClass: 'fw-bold',
        cellClassRules: {
          'text-danger': params => params.data['operationKind'] === 1,
          'text-success': params => params.data['operationKind'] === 0
        }
      }
    ];
  }

  private static buildGridOptions(): GridOptions {
    return {
      columnDefs: HistoryGridComponent.getColumnsDefinition(),
      defaultColDef: {
        flex: 1,
        filter: true,
        sortable: true,
        resizable: true
      },
      suppressMovableColumns: true,
    };
  }

  public onGridReady(params: GridReadyEvent): void {
    this.gridApi = params.api;
    this.gridApi.hideOverlay();
  }

  ngOnDestroy(): void {
    this.transactionSubscription.unsubscribe();
  }
}
