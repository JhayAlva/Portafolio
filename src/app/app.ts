import { SpaceScene } from './components/space-scene/space-scene';
import { Component, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';
import { NavBar } from "./components/nav-bar/nav-bar";
import { PrimeNG } from 'primeng/config';
import { FooterEnd } from "./components/footer-end/footer-end";
import { HomePage } from "./Page/home-page/home-page";

@Component({
  selector: 'app-root',
  imports: [NavBar, FooterEnd, HomePage, SpaceScene],
  templateUrl: './app.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './app.css'
})
export class App implements OnInit{
  protected readonly title = signal('portafolioAngular');
  constructor(private primeng: PrimeNG){}
  ngOnInit() {
    this.primeng.ripple.set(true);
  }
}
