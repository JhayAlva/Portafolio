import { Component, ChangeDetectionStrategy, HostListener } from '@angular/core';
import { TimelineModule } from 'primeng/timeline';
import type { TimelineAlign } from 'primeng/types/timeline';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'experience-time-line',
  imports: [TimelineModule, CardModule],
  templateUrl: './time-line.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './time-line.css'
})
export class TimeLine {
  public events: any[];
  public timelineAlign: TimelineAlign = 'alternate';
  constructor() {
    this.events = [
      { status: 'Codepply', date: 'May 2025 - July 2025' },
      { status: 'Sanitesa', date: 'February 2025 - April 2025' },
      { status: 'Bar El Encuentro', date: 'February 2024 - May 2024' },
      { status: 'Grupo ISV', date: 'October 2023 - January 2024' }
    ];
    this.setTimelineAlign();

  }
  @HostListener('window:resize')
  setTimelineAlign() {
    this.timelineAlign = window.innerWidth < 768 ? 'left' : 'alternate';
  }
}
