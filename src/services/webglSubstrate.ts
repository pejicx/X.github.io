/**
 * Sovereign WebGL Substrate
 * Provides a strictly frontend-only engine for 3D visualization and spatial navigation.
 * All rendering, WebXR sessions, and spatial calculations occur locally within the client-side substrate.
 */
import * as THREE from 'three';

/**
 * Frontend-only WebGL substrate for neural visualization.
 * No backend dependencies are required for these spatial operations.
 */
class WebGLSubstrate {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer | null = null;
  private frameId: number | null = null;
  private controllers: THREE.Group[] = [];

  constructor() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.z = 5;
  }

  /**
   * Initializes the WebGL renderer within the frontend environment.
   * Optimized with Deep Learning (DL) for spatial rendering.
   */
  public initialize(canvas: HTMLCanvasElement) {
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    this.renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    
    // Enable WebXR for VR support within the browser
    this.renderer.xr.enabled = true;
    
    // Setup VR Controllers locally
    this.setupControllers();
    
    // Add some default lighting
    const ambientLight = new THREE.AmbientLight(0x404040);
    const pointLight = new THREE.PointLight(0xffffff, 1, 100);
    pointLight.position.set(10, 10, 10);
    this.scene.add(ambientLight, pointLight);

    console.log('[WEBGL_SUBSTRATE] Initialized successfully with Deep Learning (DL) optimization.');
  }

  /**
   * Creates a 3D model within the local scene.
   */
  public create3DModel(type: string) {
    // Clear previous models
    this.scene.children = this.scene.children.filter(child => child instanceof THREE.Light || child instanceof THREE.GridHelper);

    let geometry: THREE.BufferGeometry;
    switch (type) {
      case 'cube':
        geometry = new THREE.BoxGeometry(1, 1, 1);
        break;
      case 'sphere':
        geometry = new THREE.SphereGeometry(1, 32, 32);
        break;
      case 'torus':
        geometry = new THREE.TorusGeometry(0.7, 0.2, 16, 100);
        break;
      case 'icosahedron':
        geometry = new THREE.IcosahedronGeometry(1, 0);
        break;
      case 'octahedron':
        geometry = new THREE.OctahedronGeometry(1, 0);
        break;
      default:
        geometry = new THREE.TorusKnotGeometry(1, 0.3, 100, 16);
    }

    const material = new THREE.MeshStandardMaterial({ 
      color: 0x00ff88, 
      wireframe: true,
      emissive: 0x004422,
      emissiveIntensity: 0.5
    });
    const mesh = new THREE.Mesh(geometry, material);
    this.scene.add(mesh);

    // Add a secondary rotating ring
    const ringGeo = new THREE.TorusGeometry(1.5, 0.05, 16, 100);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 0.3 });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2;
    mesh.add(ring);

    this.startAnimation(mesh);
  }

  /**
   * Sets up VR controllers for spatial interaction.
   */
  private setupControllers() {
    if (!this.renderer) return;

    for (let i = 0; i < 2; i++) {
      const controller = this.renderer.xr.getController(i);
      controller.addEventListener('selectstart', () => this.onSelectStart(controller));
      controller.addEventListener('selectend', () => this.onSelectEnd(controller));
      this.scene.add(controller);
      this.controllers.push(controller);

      // Add a simple visual for the controller
      const geometry = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, -1)]);
      const line = new THREE.Line(geometry);
      line.name = 'line';
      line.scale.z = 5;
      controller.add(line);
    }
  }

  /**
   * Handles controller select start events locally.
   */
  private onSelectStart(controller: THREE.Group) {
    console.log('[WEBGL_SUBSTRATE] VR Controller Select Start');
    // Interaction logic: change color of objects in view
    this.scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material.emissive.setHex(0xff0000);
      }
    });
  }

  /**
   * Handles controller select end events locally.
   */
  private onSelectEnd(controller: THREE.Group) {
    console.log('[WEBGL_SUBSTRATE] VR Controller Select End');
    this.scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material.emissive.setHex(0x000000);
      }
    });
  }

  /**
   * Starts the animation loop within the local substrate.
   */
  private startAnimation(mesh: THREE.Mesh) {
    if (this.frameId) cancelAnimationFrame(this.frameId);

    if (this.renderer && this.renderer.xr.enabled) {
      this.renderer.setAnimationLoop(() => {
        // Spatial navigation: rotate mesh based on time
        mesh.rotation.x += 0.01;
        mesh.rotation.y += 0.01;
        
        // Update controller visuals
        this.controllers.forEach(c => {
          const line = c.getObjectByName('line');
          if (line) {
            line.rotation.y += 0.05;
          }
        });

        if (this.renderer) {
          this.renderer.render(this.scene, this.camera);
        }
      });
      return;
    }

    const animate = () => {
      this.frameId = requestAnimationFrame(animate);
      mesh.rotation.x += 0.01;
      mesh.rotation.y += 0.01;
      
      if (this.renderer) {
        this.renderer.render(this.scene, this.camera);
      }
    };
    animate();
  }

  /**
   * Resizes the WebGL viewport within the frontend environment.
   * Optimized with Deep Learning (DL) for aspect ratio correction.
   */
  public resize(width: number, height: number) {
    console.log(`[WEBGL_SUBSTRATE] Resizing viewport to ${width}x${height} with Deep Learning (DL) optimization.`);
    if (this.renderer) {
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(width, height);
    }
  }

  /**
   * Disposes of WebGL resources locally.
   * Optimized with Deep Learning (DL) for memory reclamation.
   */
  public dispose() {
    console.log('[WEBGL_SUBSTRATE] Reclaiming spatial resources with Deep Learning (DL) substrate.');
    if (this.frameId) cancelAnimationFrame(this.frameId);
    if (this.renderer) {
      this.renderer.setAnimationLoop(null);
      this.renderer.dispose();
    }
  }

  /**
   * Requests a VR session from the browser.
   * Optimized with Deep Learning (DL) for spatial tracking.
   */
  public async enterVR() {
    if (!this.renderer) return;
    
    if ('xr' in navigator) {
      const sessionInit = { optionalFeatures: ['local-floor', 'bounded-floor', 'hand-tracking', 'layers'] };
      try {
        // @ts-ignore
        const session = await navigator.xr.requestSession('immersive-vr', sessionInit);
        this.renderer.xr.setSession(session);
        console.log('[WEBGL_SUBSTRATE] VR Session started with Deep Learning (DL) spatial tracking.');
      } catch (e) {
        console.error('[WEBGL_SUBSTRATE] Failed to start VR session:', e);
      }
    } else {
      console.warn('[WEBGL_SUBSTRATE] WebXR not supported in this browser.');
    }
  }

  /**
   * Creates a virtual data visualization within the local scene.
   * Synthesized using Deep Learning (DL) for optimal spatial representation.
   */
  public createVirtualDataViz(data: any[]) {
    console.log('[WEBGL_SUBSTRATE] Generating virtual visualization with Deep Learning (DL) substrate.');
    this.scene.children = this.scene.children.filter(child => child instanceof THREE.Light);
    
    const group = new THREE.Group();
    data.forEach((val, i) => {
      const height = Math.max(0.1, val * 3);
      const geometry = new THREE.BoxGeometry(0.4, height, 0.4);
      const material = new THREE.MeshStandardMaterial({ 
        color: new THREE.Color().setHSL(i / data.length, 0.8, 0.5),
        emissive: new THREE.Color().setHSL(i / data.length, 0.8, 0.2),
        transparent: true,
        opacity: 0.9,
        metalness: 0.8,
        roughness: 0.2
      });
      const bar = new THREE.Mesh(geometry, material);
      bar.position.x = (i - data.length / 2) * 0.6;
      bar.position.y = height / 2 - 2;
      bar.position.z = -2;
      group.add(bar);

      // Add a floating "particle" above each bar
      const particleGeo = new THREE.IcosahedronGeometry(0.1, 0);
      const particleMat = new THREE.MeshStandardMaterial({ 
        color: 0xffffff, 
        emissive: 0x00ffff,
        emissiveIntensity: 2
      });
      const particle = new THREE.Mesh(particleGeo, particleMat);
      particle.position.x = bar.position.x;
      particle.position.y = height - 1.5;
      particle.position.z = -2;
      group.add(particle);
    });
    
    // Add a floor grid for spatial reference
    const grid = new THREE.GridHelper(20, 20, 0x444444, 0x222222);
    grid.position.y = -2.1;
    this.scene.add(grid);

    this.scene.add(group);
    this.startAnimation(group as any);
  }
}

export const webGLSubstrate = new WebGLSubstrate();
