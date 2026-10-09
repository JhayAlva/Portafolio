import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'skills-tech-carrousel',
  imports: [],
  templateUrl: './tech-carrousel.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './tech-carrousel.css'
})
export class TechCarrousel {
  public tecnologias = [
    { nombre: 'Angular', logo: 'assets/tecnologias/angular-icon.png' },
    { nombre: 'React', logo: 'assets/tecnologias/react-icon.png' },
    { nombre: 'TypeScript', logo: 'assets/tecnologias/typescript-icon.png' },
    { nombre: 'JavaScript', logo: 'assets/tecnologias/javascript-icon.png' },
    { nombre: 'HTML5', logo: 'assets/tecnologias/html5-icon.png' },
    { nombre: 'CSS3', logo: 'assets/tecnologias/css3-icon.png' },
    { nombre: 'Blazor', logo: 'assets/tecnologias/blazor-icon.png' },
    { nombre: 'C#', logo: 'assets/tecnologias/c-icon.png' },
    { nombre: '.Net', logo: 'assets/tecnologias/net-icon.png' },
    { nombre: 'Springboot', logo: 'assets/tecnologias/springboot-icon.png' },
    { nombre: 'MySql', logo: 'assets/tecnologias/mysql-icon.png' },
    { nombre: 'PostgreSQL', logo: 'assets/tecnologias/postgresql-icon.png' },
    { nombre: 'Oracle', logo: 'assets/tecnologias/oracle-icon.png' },
    { nombre: 'FireBase', logo: 'assets/tecnologias/firebase-icon.png' },
    { nombre: 'SQLServer', logo: 'assets/tecnologias/sqlserver-icon.png' },
    { nombre: 'Bootstrap', logo: 'assets/tecnologias/bootstrap-icon.png' },
    { nombre: 'Git', logo: 'assets/tecnologias/git-icon.png' },
    { nombre: 'Node.js', logo: 'assets/tecnologias/node-icon.png' },
    { nombre: 'Nest.js', logo: 'assets/tecnologias/nestjs-icon.png' },
    { nombre: 'Tailwind', logo: 'assets/tecnologias/tailwind-icon.png' },
    { nombre: 'PrimeNG', logo: 'assets/tecnologias/primeng-icon.webp' },
  ];
}
