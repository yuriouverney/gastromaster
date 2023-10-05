import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-view-action',
  template: `
    <button mat-icon-button (click)="onClick()">
      <mat-icon>visibility</mat-icon>
    </button>
  `,
  styles: [
    `
      .action-icon {
        cursor: pointer;
        font-size: 1.2rem;
        color: #007bff;
      }

      .action-icon:hover {
        color: #0056b3;
      }
    `,
  ],
})
export class ViewActionComponent {
  @Input() rowData: any;
  @Output() view: EventEmitter<any> = new EventEmitter();

  onClick() {
    this.view.emit(this.rowData);
  }
}
