import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-child-details-table',
  templateUrl: './child-details-table.component.html',
  styleUrls: ['./child-details-table.component.css']
})
export class ChildDetailsTableComponent implements OnInit {
  
  people: {name: string; length: string; weight: string; age: number; }[];

  constructor() { }

  ngOnInit(): void {
    this.people = [
      { name: 'John', length: '180cm', weight: '75kg', age: 24 },
      { name: 'Jane', length: '165cm', weight: '60kg', age: 30 },
      { name: 'Bob', length: '190cm', weight: '90kg', age: 45 },
      { name: 'Alice', length: '155cm', weight: '50kg', age: 18 },
    ];
  }

}
