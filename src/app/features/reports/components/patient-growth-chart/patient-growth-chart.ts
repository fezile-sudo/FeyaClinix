import { Component, Input, OnChanges } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { Chart, registerables } from 'chart.js';


Chart.register(...registerables);


@Component({
  selector: 'app-patient-growth-chart',
  standalone: true,
  imports: [
    BaseChartDirective
  ],
  templateUrl: './patient-growth-chart.html',
  styleUrl: './patient-growth-chart.scss',
})
export class PatientGrowthChart implements OnChanges {


  @Input()
  patientData: any[] = [];

  public lineChartType = 'line' as const;

  public lineChartData: any = {

    labels: [],

    datasets: [
      {
        label: 'New Patients',
        data: [],
        borderColor: '#2563eb',
        backgroundColor: '#93c5fd',
        tension: 0.4,
        fill: true

      }

    ]

  };

  ngOnChanges(): void {

    this.lineChartData = {

      labels: this.patientData.map(item => item.month),

      datasets: [
        {
          label: 'New Patients',
          data: this.patientData.map(item => item.patients),
          borderColor: '#2563eb',
          backgroundColor: '#93c5fd',
          tension: 0.4,
          fill: true
        }
      ]
    };
  }
}
