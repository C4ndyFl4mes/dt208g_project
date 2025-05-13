import { Component, Input, Signal } from '@angular/core';
import { Page } from '../../models/page';

@Component({
  selector: 'app-table',
  imports: [],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss'
})
export class TableComponent {
  @Input() page!: Signal<Page>;

}
