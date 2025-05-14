import { Component, Input, Signal } from '@angular/core';
import { Page } from '../../models/page';
import { FrameworkService } from '../../services/framework.service';

@Component({
  selector: 'app-table',
  imports: [],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss'
})
export class TableComponent {
  @Input() parentPage!: Signal<string>;
  @Input() page!: Signal<Page>;

  constructor(public framework: FrameworkService) {}

  openPlan(link: string): void {
    window.open(link, "_blank");
  }
}
