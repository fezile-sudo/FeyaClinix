import { Component, Input } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { Chart, registerables } from 'chart.js';


Chart.register(...registerables);


@Component({
  selector: 'app-appointment-status-chart',
  standalone: true,
  imports: [
    BaseChartDirective
  ],
  templateUrl: './appointment-status-chart.html',
  styleUrl: './appointment-status-chart.scss',
})
export class AppointmentStatusChart {

  @Input()
  completed = 0;

  @Input()
  pending = 0;

  @Input()
  cancelled = 0;

  public doughnutChartLabels = ['Completed', 'Pending', 'Cancelled'];

  public doughnutChartData = {

    labels: this.doughnutChartLabels,

    datasets: [
      {
        data: [ this.completed, this.pending, this.cancelled],

        backgroundColor: ['#22c55e', '#f59e0b', '#ef4444']

      }
    ]
  };

  public doughnutChartType = 'doughnut' as const;

  ngOnChanges(): void { this.doughnutChartData.datasets[0].data = 
  [this.completed, this.pending, this.cancelled];}
}
