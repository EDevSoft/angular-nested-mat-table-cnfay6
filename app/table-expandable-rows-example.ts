import { Component, ViewChild, ViewChildren, QueryList, ChangeDetectorRef } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTable } from '@angular/material/table';

@Component({
  selector: 'table-expandable-rows-example',
  styleUrls: ['table-expandable-rows-example.css'],
  templateUrl: 'table-expandable-rows-example.html',
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class TableExpandableRowsExample {
  @ViewChild('outerSort', { static: true }) sort: MatSort;
  @ViewChildren('innerSort') innerSort: QueryList<MatSort>;
  @ViewChildren('innerTables') innerTables: QueryList<MatTable<Address>>;

  dataSource: MatTableDataSource<User>;
  usersData: User[] = [];
  columnsToDisplay = ['name', 'email', 'phone'];
  innerDisplayedColumns = ['street', 'zipCode', 'city'];
  allRowsExpandedStates: boolean[] = [];
  isAllRowsExpanded = false;

  constructor(private cd: ChangeDetectorRef) { }

  ngOnInit() {
    USERS.forEach(user => {
      if (user.addresses && Array.isArray(user.addresses) && user.addresses.length) {
        this.usersData = [...this.usersData, {...user, addresses: new MatTableDataSource(user.addresses), isExpanded: false}];
      } else {
        this.usersData = [...this.usersData, user];
      }
      this.allRowsExpandedStates.push(false); // Initialize the state for each button
    });
    this.dataSource = new MatTableDataSource(this.usersData);
    this.dataSource.sort = this.sort;
  }

  toggleRow(element: User) {
    element.addresses && (element.addresses as MatTableDataSource<Address>).data.length ? 
      (element.isExpanded = !element.isExpanded) : null;
    this.cd.detectChanges();
    this.updateAllRowsExpandedState();
    this.innerTables.forEach((table, index) => (table.dataSource as MatTableDataSource<Address>).sort = this.innerSort.toArray()[index]);
  }

  toggleAllRows() {
    this.isAllRowsExpanded = !this.isAllRowsExpanded;
    const newState = this.isAllRowsExpanded;
    this.dataSource.data.forEach((user, i) => {
      user.isExpanded = newState;
    });
    this.cd.detectChanges();
    this.innerTables.forEach((table, i) => (table.dataSource as MatTableDataSource<Address>).sort = this.innerSort.toArray()[i]);
  }

  updateAllRowsExpandedState() {
    debugger
    this.allRowsExpandedStates = this.dataSource.data.map(user => user.isExpanded);
    this.isAllRowsExpanded = this.allRowsExpandedStates.every(state => state);
  }

  applyFilter(filterValue: string) {
    this.innerTables.forEach((table, index) => (table.dataSource as MatTableDataSource<Address>).filter = filterValue.trim().toLowerCase());
  }
}

export interface User {
  name: string;
  email: string;
  phone: string;
  addresses?: Address[] | MatTableDataSource<Address>;
  isExpanded?: boolean;
}

export interface Address {
  street: string;
  zipCode: string;
  city: string;
}

const USERS: User[] = [
  {
    name: "Mason",
    email: "mason@test.com",
    phone: "9864785214",
    addresses: [
      {
        street: "Street 1",
        zipCode: "78542",
        city: "Kansas"
      },
      {
        street: "Street 2",
        zipCode: "78554",
        city: "Texas"
      }
    ]
  },
  {
    name: "Eugene",
    email: "eugene@test.com",
    phone: "8786541234",addresses: [
      {
        street: "Street 1",
        zipCode: "78542",
        city: "Kansas"
      },
      {
        street: "Street 2",
        zipCode: "78554",
        city: "Texas"
      }
    ]
  },
  {
    name: "Jason",
    email: "jason@test.com",
    phone: "7856452187",
    addresses: [
      {
        street: "Street 5",
        zipCode: "23547",
        city: "Utah"
      },
      {
        street: "Street 5",
        zipCode: "23547",
        city: "Ohio"
      }
    ]
  }
];
