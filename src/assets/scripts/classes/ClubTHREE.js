import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import * as dat from 'lil-gui'
import RoomURL from '../../models/scene-room.glb?url';
// import { scrollPercent } from '../functions/ScrollFunctions';

export class ClubTHREE {
    constructor(container, section, callback) {
        this.container = {
            elem : container,
            box : null
        };
        this.section = section;
        this.start = false;
        this.load(callback);
    }
    load(callback) {
        const manager = new THREE.LoadingManager;
        const gltfLoader = new GLTFLoader(manager);

        gltfLoader.load(RoomURL, (obj) => {
            this.roomScene = obj.scene;
        });
        
        //
        manager.onLoad = () => {
            this.init(callback);
        }
    }
    init(callback) {

        gsap.registerPlugin(ScrollTrigger);

        this.container.box = this.container.elem.getBoundingClientRect();
        this.scene = new THREE.Scene();
        // this.texture.encoding = THREE.sRGBEncoding;
        // this.scene.background = this.texture;
        this.camera = new THREE.PerspectiveCamera(40, this.container.box.width/this.container.box.height, 0.1, 1000);
        this.camera.position.set(0, 0, 0);

        this.gui = new dat.GUI();
        this.gui.add(this.camera.position, 'x', -10, 10, 0.01);
        this.gui.add(this.camera.position, 'y', -20, 20, 0.01);
        this.gui.add(this.camera.position, 'z', -20, 20, 0.01);
        this.gui.add(this.camera.rotation, 'x', -Math.PI, Math.PI, 0.01);
        this.gui.add(this.camera.rotation, 'y', -Math.PI, Math.PI, 0.01);
        this.gui.add(this.camera.rotation, 'z', -Math.PI, Math.PI, 0.01);

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

        this.createRoom();
        this.bindEvents();
        this.addGsap();
        // this.createShader();
        // this.createPlane();
        callback();
        this.renderer.setAnimationLoop(() => {this.render();});
    }

    createRoom() {
        this.room = this.roomScene;
        this.scene.add(this.room);
        this.room.position.set(0, -0.08, -7);
        this.room.rotation.set(0, -Math.PI/2, 0);
        // this.gui.add(this.room.position, 'x', -10, 10, 0.01);
        // this.gui.add(this.room.position, 'y', -20, 20, 0.01);
        // this.gui.add(this.room.position, 'z', -20, 20, 0.01);
        // this.gui.add(this.room.rotation, 'x', -Math.PI, Math.PI, 0.01);
        // this.gui.add(this.room.rotation, 'y', -Math.PI, Math.PI, 0.01);
        // this.gui.add(this.room.rotation, 'z', -Math.PI, Math.PI, 0.01);

        // this.room.traverse((child) => {
        //     if (child.isMesh) {
        //         child.material = new THREE.MeshPhysicalMaterial({  
        //             color: (200, 50, 240),
        //             roughness: 0.7,  
        //             transmission: 0.2,  
        //           });
        //     }
        // });



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
            // gsap.to(this.camera.rotation, {
            //     x: this.mouse.y * 0.01,
            //     y: -this.mouse.x * 0.005,
            //     duration: 1,
            //     ease: 'power2.out'
            // });
        });
        // trouve la face de l'objet qui est visée par le raycaser lors du clic
    }

    addGsap() {
        // find an object with name = Screen in this.room
        this.room.traverse((child) => {
            if (child.name === 'Screen') {
                this.screen = child;
            }
        });
        console.log(this.screen);

        this.zoom = new gsap.timeline({
            scrollTrigger: {
                trigger: this.container.elem,
                start: 'top 0%',
                end: 'top -50%',
                scrub: true,
                markers: true
            }
        });
        this.zoom.fromTo(
            this.camera.position,
            {
                x:0,
                y:0,
                z:0
            },
            {
                x:0.2,
                y:0.18,
                z:-5
            }
        )

        // this.zoom = ScrollTrigger.create({
        //     id:'zoom',
        //     trigger: this.container.elem,
        //     markers: true,
        //     start: 'top 0%',
        //     end: 'top 10%',
        //     scrub: true,

        // })
    }

    render() {
        if (this.start === false) return;
        this.time += this.clock.getDelta();
        this.renderer.render(this.scene, this.camera);
    }
}