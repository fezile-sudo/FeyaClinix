import { Component, Input, OnChanges } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { Chart, registerables } from 'chart.js';


Chart.register(...registerables);

@Component({
  selector: 'app-doctor-performance-chart',
  standalone: true,
  imports: [
    BaseChartDirective
  ],
  templateUrl: './doctor-performance-chart.html',
  styleUrl: './doctor-performance-chart.scss',
})

export class DoctorPerformanceChart implements OnChanges {

  @Input()
  doctorData: any[] = [];

  public barChartType = 'bar' as const;

  public barChartData: any = {

    labels: [],

    datasets: [
      {
        label: 'Appointments',

        data: [],

        backgroundColor: '#3b82f6'

      }
    ]

  };

  ngOnChanges(): void {

    this.barChartData = {

      labels: this.doctorData.map(doctor => doctor.name),

      datasets: [
        {
          label: 'Appointments',

          data: this.doctorData.map(doctor => doctor.appointments),

          backgroundColor: '#3b82f6'}
        ]

    };

  }

}
