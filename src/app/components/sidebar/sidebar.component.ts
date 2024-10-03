import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { mockData } from '../../mock-data/mock';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [MatIconModule, CommonModule, MatButtonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {
  data = mockData;
}
