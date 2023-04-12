import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import gsap from 'gsap';
import * as dat from 'lil-gui'
import LogoURL from '../../models/Logo.glb?url';
import RoomURL from '../../models/scene-room.glb?url';

export class HeroTHREE {
    constructor(container, callback) {
        this.container = {
            elem : container,
            box : null
        };
        this.start = false;
        // this.textureUrl = textureUrl
        this.load(callback);
    }
    load(callback) {
        const manager = new THREE.LoadingManager;
        const gltfLoader = new GLTFLoader(manager);
        gltfLoader.load(LogoURL, (obj) => {
            this.logoModel = obj.scene.children[0];
        });
        gltfLoader.load(RoomURL, (obj) => {
            this.roomScene = obj.scene.children[0];
        });
        
        //
        manager.onLoad = () => {
            this.init(callback);
        }
    }
    init(callback) {
        this.container.box = this.container.elem.getBoundingClientRect();
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(40, this.container.box.width/this.container.box.height, 0.1, 1000);
        this.camera.position.set(0, 0, 0);
        this.scene.add(this.camera);
        this.lights = {
            ambientLight: new THREE.AmbientLight(0xffffff, 1),
            directionalLight: new THREE.DirectionalLight(0xffffff, 1),
        }
        this.lights.directionalLight.position.set(-2, 5, 1);
        this.scene.add(this.lights.ambientLight);
        this.scene.add(this.lights.directionalLight);
        this.renderer = new THREE.WebGLRenderer({
            alpha: true, 
            color : 0xffffff,
            powerPreference: "high-performance",
            antialias: true,
            stencil: false,
            depth: true
        });

        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(this.container.box.width, this.container.box.height);
        this.renderer.toneMapping = THREE.ReinhardToneMapping;

        this.container.elem.appendChild(this.renderer.domElement);
        this.raycaster = new THREE.Raycaster();
        this.intersects = [];
        this.mouse = new THREE.Vector2();
        this.clock = new THREE.Clock();
        this.time = 0;

        this.createLogo();
        this.bindEvents();
        // this.createShader();
        // this.createPlane();
        callback();
        this.renderer.setAnimationLoop(() => {this.render();});
    }

    createLogo() {


        // normalize the geometry
        this.logoModel.geometry.center();
        this.logoModel.geometry.computeBoundingBox();
        const box = this.logoModel.geometry.boundingBox;
        const size = new THREE.Vector3();
        box.getSize(size);
        this.logoModel.scale.multiplyScalar(1 / size.length());
        this.logoModel.position.set(0, 0, 0);
        this.logoModel.rotation.set(0, 0, 0);
        this.logoModel.updateMatrix();
        this.logoModel.matrixAutoUpdate = false;
        this.logoModel.castShadow = true;
        this.logoModel.receiveShadow = true;
        this.logoModel.material = new THREE.MeshPhysicalMaterial({  
            color: (164, 33, 240),
            roughness: 1,  
            transmission: 0.1,  
          });
        this.logo = new THREE.Group();
        this.scene.add(this.logo);
        this.logo.add(this.logoModel);

        this.logo.position.set(5.6, 0.4, -18);
        this.logo.rotation.set( Math.PI / 2, 0, 0);
        // this.gui = new dat.GUI();
        // this.gui.add(this.logo.position, 'x', -10, 10, 0.01);
        // this.gui.add(this.logo.position, 'y', -10, 10, 0.01);
        // this.gui.add(this.logo.position, 'z', -10, 10, 0.01);
        // this.gui.add(this.logo.rotation, 'x', -Math.PI, Math.PI, 0.01);
        // this.gui.add(this.logo.rotation, 'y', -Math.PI, Math.PI, 0.01);
        // this.gui.add(this.logo.rotation, 'z', -Math.PI, Math.PI, 0.01);

    }
    
    bindEvents() {
        window.addEventListener('resize', () => {
            this.renderer.setSize(this.container.box.width, this.container.box.height);
            this.camera.aspect = this.container.box.width / this.container.box.height;
            this.camera.updateProjectionMatrix();
        });
        window.addEventListener('mousemove', (e) => {
            //set raycaster 
            this.mouse.x = ((e.clientX - this.container.box.x) / this.container.box.width) * 2 - 1;
            this.mouse.y = -((e.clientY - this.container.box.y) / this.container.box.height) * 2 + 1;
            this.raycaster.setFromCamera(this.mouse, this.camera);
            //set camera rotation
            gsap.to(this.camera.rotation, {
                x: this.mouse.y * 0.01,
                y: -this.mouse.x * 0.005,
                duration: 1,
                ease: 'power2.out'
            });
        });
    }

    render() {
        if (this.start === false) return;
        this.time += this.clock.getDelta();
        this.logo.rotateZ((Math.sin(this.time * 2) + 1 ) * 0.005 + 0.005);
        this.renderer.render(this.scene, this.camera);
    }
}