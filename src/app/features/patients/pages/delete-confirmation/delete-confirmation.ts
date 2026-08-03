import { Component } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';


@Component({
  selector: 'app-delete-confirmation',
  imports: [
    MatDialogModule,
    MatButtonModule
  ],
  templateUrl: './delete-confirmation.html',
  styleUrl: './delete-confirmation.scss'
})
export class DeleteConfirmation {

}
