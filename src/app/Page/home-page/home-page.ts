import { AfterViewInit, Component, ChangeDetectionStrategy, ElementRef, NgZone, OnDestroy, inject } from '@angular/core';

import { TimeLine } from "../../components/time-line/time-line";
import { TechCarrousel } from "../../components/tech-carrousel/tech-carrousel";
@Component({
  selector: 'porta-home-page',
  imports: [TimeLine, TechCarrousel],
  templateUrl: './home-page.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './home-page.css'
})
export class HomePage implements AfterViewInit, OnDestroy {
  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly zone = inject(NgZone);
  private observer?: IntersectionObserver;

  ngAfterViewInit(): void {
    this.zone.runOutsideAngular(() => {
      if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      this.observer = new IntersectionObserver(entries => {
        for (const entry of entries) if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          this.observer?.unobserve(entry.target);
        }
      }, { threshold: 0.08 });
      for (const element of this.host.nativeElement.querySelectorAll('.reveal')) {
        element.classList.add('will-reveal');
        this.observer.observe(element);
      }
    });
  }

  ngOnDestroy(): void { this.observer?.disconnect(); }
  public studies = [
    {
      title: 'Master in Full Stack Development',
      institution: 'Nuclio Digital School',
      date: 'February 2025 - July 2025',
      description: 'Intensive training in Full Stack web development. Application of agile methodologies, best development practices, and application deployment. Complementary training with exploration of technologies such as Tailwind CSS.'
    },
    {
      title: 'Higher Degree in Web Application Development',
      institution: 'I.E.S Alonso De Avellaneda',
      date: 'September 2021 - December 2023',
      description: 'Comprehensive training in web application development with hands-on experience in backend using ASP.NET, Node.js, and Java, as well as frontend development with Blazor and Angular. Skilled in database management and design with MongoDB, SQL (Oracle, MySQL, SQL Server, PL/SQL), and Firebase, along with the implementation and consumption of web services through SOAP and REST APIs.'
    },
    {
      title: 'Higher Degree in Audiovisual Production and Shows',
      institution: 'I.E.S Carlos María Valcárcel',
      date: 'September 2019 - June 2021',
      description: 'Specialized training in the management and operation of audiovisual equipment for live productions and events, with experience in planning and executing audiovisual projects and shows while ensuring compliance with quality and safety standards.'
    }
  ];
  public projects = [
    {
      title: 'Portfolio Website',
      tech: 'Angular, Tailwind CSS',
      date: '2025',
      description: 'Personal portfolio to showcase my skills and projects.',
      link: 'https://portafolio-jeremie.netlify.app/',
      image: '/assets/proyectos/angularPortafolio.jpg'
    },
    {
      title: 'Codepply',
      tech: 'React, Node.js, Express, MongoDB',
      date: '2025',
      description: 'Codepply is a collaborative platform created to connect developers, featuring project management, candidate dashboards, real-time chat with notifications, and modules to showcase experience, projects, and education.',
      link: 'https://codepply.netlify.app/',
      image: '/assets/proyectos/codepply.jpg'
    },
    {
      title: 'RealG-Sneakers',
      tech: 'NestJS, Angular, Stripe, MongoDB, Paypal',
      date: '2024',
      description: 'RealG-Sneakers is a full-stack e-commerce platform for sneakers, clothing, and accessories, offering a seamless shopping experience with secure payment integrations like PayPal and Stripe.',
      link: 'https://realg4sneaker.netlify.app/auth/login',
      image: '/assets/proyectos/RealG.jpg'
    },
  ];
}
