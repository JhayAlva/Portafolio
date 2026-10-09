import { AfterViewInit, Component, ElementRef, NgZone, OnDestroy, ViewChild, inject } from '@angular/core';
import type * as Three from 'three';

@Component({
  selector: 'porta-space-scene',
  template: '<canvas #canvas aria-hidden="true"></canvas>',
  styles: [':host { position: fixed; inset: 0; z-index: 0; pointer-events: none; } canvas { display: block; width: 100%; height: 100%; }']
})
export class SpaceScene implements AfterViewInit, OnDestroy {
  @ViewChild('canvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;
  private readonly zone = inject(NgZone);
  private disposeScene?: () => void;
  private destroyed = false;

  ngAfterViewInit(): void {
    this.zone.runOutsideAngular(() => { void this.start(); });
  }

  private async start(): Promise<void> {
    try {
      const T = await import('three');
      if (this.destroyed) return;
      const renderer = new T.WebGLRenderer({ canvas: this.canvas.nativeElement, alpha: true, antialias: window.innerWidth > 768, powerPreference: 'low-power' });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, window.innerWidth < 768 ? 1.25 : 1.75));
      const scene = new T.Scene();
      const camera = new T.PerspectiveCamera(55, 1, .1, 450);
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
      const planets: Three.Group[] = [];
      const textures: Three.Texture[] = [];
      let frame = 0;
      let scroll = 0;
      let smooth = 0;
      let pointerX = 0;
      let pointerY = 0;
      let lastTime = 0;
      let activeTime = 0;

      // Seeded generation keeps the universe stable between visits.
      let seed = 731;
      const random = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
      const count = window.innerWidth < 768 ? 1100 : 2600;
      const positions = new Float32Array(count * 3);
      const colors = new Float32Array(count * 3);
      for (let i = 0; i < count; i++) {
        positions.set([(random() - .5) * 190, (random() - .5) * 100, 20 - random() * 390], i * 3);
        const tint = new T.Color().setHSL(.55 + random() * .15, .25, .55 + random() * .4);
        colors.set([tint.r, tint.g, tint.b], i * 3);
      }
      const starsGeometry = new T.BufferGeometry();
      starsGeometry.setAttribute('position', new T.BufferAttribute(positions, 3));
      starsGeometry.setAttribute('color', new T.BufferAttribute(colors, 3));
      const stars = new T.Points(starsGeometry, new T.PointsMaterial({ size: .09, vertexColors: true, transparent: true, opacity: .9, depthWrite: false }));
      scene.add(stars);

      const vertexShader = `varying vec3 vNormal; varying vec3 vPosition; varying vec3 vView;
        void main(){ vNormal=normalize(normalMatrix*normal); vPosition=position;
        vec4 mv=modelViewMatrix*vec4(position,1.); vView=-mv.xyz; gl_Position=projectionMatrix*mv; }`;
      const fragmentShader = `uniform vec3 base; uniform vec3 accent; uniform float gas;
        varying vec3 vNormal; varying vec3 vPosition; varying vec3 vView;
        float hash(vec3 p){return fract(sin(dot(p,vec3(127.1,311.7,74.7)))*43758.5453);}
        float noise(vec3 p){vec3 i=floor(p),f=fract(p); f=f*f*(3.-2.*f);
          return mix(mix(mix(hash(i),hash(i+vec3(1,0,0)),f.x),mix(hash(i+vec3(0,1,0)),hash(i+vec3(1,1,0)),f.x),f.y),
          mix(mix(hash(i+vec3(0,0,1)),hash(i+vec3(1,0,1)),f.x),mix(hash(i+vec3(0,1,1)),hash(i+vec3(1,1,1)),f.x),f.y),f.z);}
        void main(){vec3 p=normalize(vPosition); float n=noise(p*5.)*.6+noise(p*12.)*.3+noise(p*28.)*.1;
          float bands=sin(p.y*42.+n*8.)*.5+.5; float pattern=mix(smoothstep(.38,.62,n),bands,gas);
          vec3 surface=mix(base,accent,pattern); float light=max(dot(normalize(vNormal),normalize(vec3(-.7,.65,1.))),0.);
          float rim=pow(1.-max(dot(normalize(vNormal),normalize(vView)),0.),3.);
          gl_FragColor=vec4(surface*(.055+light*.95)+accent*rim*.35,1.); }`;
      const makePlanet = (x: number, y: number, z: number, radius: number, base: string, accent: string, gas = 0, rings = false) => {
        const group = new T.Group();
        const geometry = new T.SphereGeometry(radius, 48, 32);
        const planet = new T.Mesh(geometry, new T.ShaderMaterial({ vertexShader, fragmentShader, uniforms: { base: { value: new T.Color(base) }, accent: { value: new T.Color(accent) }, gas: { value: gas } } }));
        group.add(planet);
        const glow = new T.Mesh(new T.SphereGeometry(radius * 1.065, 40, 28), new T.ShaderMaterial({
          vertexShader,
          fragmentShader: `uniform vec3 color; varying vec3 vNormal; varying vec3 vView;
            void main(){float rim=pow(1.-abs(dot(normalize(vNormal),normalize(vView))),3.); gl_FragColor=vec4(color,rim*.45);}`,
          uniforms: { color: { value: new T.Color(accent) } }, transparent: true, blending: T.AdditiveBlending, depthWrite: false
        }));
        group.add(glow);
        if (rings) {
          for (let i = 0; i < 3; i++) {
            const ring = new T.Mesh(new T.RingGeometry(radius * (1.45 + i * .22), radius * (1.61 + i * .22), 100), new T.MeshBasicMaterial({ color: accent, side: T.DoubleSide, transparent: true, opacity: .28 - i * .05, depthWrite: false }));
            ring.rotation.x = 1.13; ring.rotation.y = .27; group.add(ring);
          }
        }
        group.position.set(x, y, z); group.rotation.z = -.2;
        scene.add(group); planets.push(group);
      };
      makePlanet(10, 1, -18, 5.8, '#092035', '#53c7de', 0, true);
      makePlanet(-14, -1, -65, 7, '#27133f', '#b793f4');
      makePlanet(16, 3, -113, 8, '#62351a', '#edba80', 1, true);
      makePlanet(-15, 2, -165, 7, '#081d30', '#53bfd4');
      makePlanet(16, -2, -218, 8, '#321744', '#d097e7', 1);
      makePlanet(-12, 0, -278, 6, '#623824', '#f4b57d', 0, true);

      // Soft procedural nebulae: no external textures or download requests.
      const cloudCanvas = document.createElement('canvas');
      cloudCanvas.width = cloudCanvas.height = 256;
      const ctx = cloudCanvas.getContext('2d');
      if (ctx) {
        const gradient = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
        gradient.addColorStop(0, 'rgba(255,255,255,.6)'); gradient.addColorStop(.3, 'rgba(255,255,255,.25)'); gradient.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = gradient; ctx.fillRect(0, 0, 256, 256);
        const texture = new T.CanvasTexture(cloudCanvas); textures.push(texture);
        for (let i = 0; i < 32; i++) {
          const cloud = new T.Sprite(new T.SpriteMaterial({ map: texture, color: i % 3 ? '#533bad' : '#12607c', transparent: true, opacity: .18, blending: T.AdditiveBlending, depthWrite: false }));
          cloud.position.set((random() - .5) * 90, (random() - .5) * 45, -20 - random() * 340);
          cloud.scale.set(45 + random() * 35, 20 + random() * 30, 1); scene.add(cloud);
        }
      }
      const resize = () => { renderer.setSize(window.innerWidth, window.innerHeight); camera.aspect = window.innerWidth / window.innerHeight; camera.updateProjectionMatrix(); updateScroll(); if (reduced.matches) drawOnce(); };
      const updateScroll = () => { const distance = document.documentElement.scrollHeight - window.innerHeight; scroll = distance > 0 ? window.scrollY / distance : 0; if (reduced.matches) drawOnce(); };
      const pointer = (event: PointerEvent) => { pointerX = event.clientX / window.innerWidth - .5; pointerY = event.clientY / window.innerHeight - .5; };
      const drawOnce = () => { camera.position.set(0, 0, 4); renderer.render(scene, camera); };
      const animate = (time: number) => {
        frame = 0;
        if (document.hidden || reduced.matches) return;
        const delta = Math.min((time - lastTime) / 1000, .05); lastTime = time; activeTime += delta;
        smooth += (scroll - smooth) * (1 - Math.exp(-delta * 5));
        const narrow = window.innerWidth < 768;
        camera.position.set(Math.sin(smooth * Math.PI * 3) * (narrow ? .5 : 2) + pointerX * .7, -pointerY * .45, 4 - smooth * 275);
        camera.rotation.set(pointerY * .015, -pointerX * .02, Math.sin(smooth * Math.PI * 2) * .015);
        for (const planet of planets) planet.children[0].rotation.y = activeTime * .035;
        renderer.render(scene, camera); frame = requestAnimationFrame(animate);
      };
      const resume = () => { cancelAnimationFrame(frame); frame = 0; if (reduced.matches) drawOnce(); else if (!document.hidden) { lastTime = performance.now(); frame = requestAnimationFrame(animate); } };
      window.addEventListener('resize', resize); window.addEventListener('scroll', updateScroll, { passive: true }); window.addEventListener('pointermove', pointer, { passive: true });
      document.addEventListener('visibilitychange', resume); reduced.addEventListener('change', resume);
      resize(); resume();
      this.disposeScene = () => {
        cancelAnimationFrame(frame); window.removeEventListener('resize', resize); window.removeEventListener('scroll', updateScroll); window.removeEventListener('pointermove', pointer);
        document.removeEventListener('visibilitychange', resume); reduced.removeEventListener('change', resume);
        scene.traverse(object => { const mesh = object as Three.Mesh; mesh.geometry?.dispose(); if (mesh.material) for (const material of Array.isArray(mesh.material) ? mesh.material : [mesh.material]) material.dispose(); });
        textures.forEach(texture => texture.dispose()); renderer.dispose(); renderer.forceContextLoss();
      };
    } catch {
      // The CSS universe remains visible if WebGL is unavailable.
      this.canvas.nativeElement.style.display = 'none';
    }
  }
  ngOnDestroy(): void { this.destroyed = true; this.disposeScene?.(); }
}
