import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'

const textureLoader = new THREE.TextureLoader()
const gradientTexture = textureLoader.load('./gradients/4.jpg')
const matcapTexutre = textureLoader.load('./textures/matcaps/3.png')
matcapTexutre.colorSpace = THREE.SRGBColorSpace;

// Fonts
const fontLoader = new FontLoader();
// Scene
const scene = new THREE.Scene()


fontLoader.load(
    '/fonts/helvetiker_regular.typeface.json',
    (font) => {
        const textGeometry = new TextGeometry(
            'CHROME', 
            {
                font: font,
                size: 0.5,
                height: 0.2,
                curveSegments: 10, 
                bevelEnabled: true,
                bevelThickness: 0.03,
                bevelSize: 0.02,
                bevelOffset: 0,
                bevelSegments: 2,
            }
        )
        textGeometry.center();

        const material = new THREE.MeshMatcapMaterial({
            matcap: matcapTexutre,
        });
        const text = new THREE.Mesh(textGeometry, material);
        scene.add(text);


        console.time('donuts');

        const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45);

        const donut = new THREE.Mesh(donutGeometry, material);
        scene.add(donut);
        donut.position.x = 0;
        donut.position.y = 1;

        for (let i = 0; i < 1000; i++){

            const donut = new THREE.Mesh(donutGeometry, material);
            
            donut.position.x = (Math.random()- 0.5) * 20;
            donut.position.y = (Math.random()- 0.5) * 20;
            donut.position.z = (Math.random()- 0.5) * 20;

            donut.rotation.x = Math.random() * Math.PI;
            donut.rotation.y = Math.random() * Math.PI;

            const scale = Math.random();
            donut.scale.set(scale, scale, scale);

            scene.add(donut);
        }
        console.timeEnd('donuts')

    }
);




// Canvas
const canvas = document.querySelector('canvas.webgl')


/**
 * Textures
 */


/**
 * Object
 */
// const cube = new THREE.Mesh(
//     new THREE.BoxGeometry(1, 1, 1),
//     new THREE.MeshBasicMaterial()
// )

// scene.add(cube)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

// Axes Helper
const axesHelper = new THREE.AxesHelper();
scene.add(axesHelper);

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

// Lights

const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 30);
pointLight.position.x = 2;
pointLight.position.y = 6;
pointLight.position.z = 4;
scene.add(pointLight);



/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()

/**
 * Base
 */
// Debug
const gui = new GUI()

const lightFolder = gui.addFolder('Point Light Manipulation');
lightFolder.add(pointLight.position, 'x', -10, 10).name('X Position');
lightFolder.add(pointLight.position, 'y', -10, 10).name('Y Position');
lightFolder.add(pointLight.position, 'z', -10, 10).name('Z Position');
lightFolder.addColor(pointLight, 'color').name('Light Color');
lightFolder.add(pointLight, 'intensity', 0, 2).name('Intensity');
lightFolder.add(pointLight, 'distance', 0, 20).name('Distance');
lightFolder.add(pointLight, 'decay', 0, 4).name('Decay');

const ambientLightFolder = gui.addFolder('Ambient Light Manipulation');
ambientLightFolder.add(ambientLight.position, 'x', -10, 10).name('X Position');
ambientLightFolder.add(ambientLight.position, 'y', -10, 10).name('Y Position');
ambientLightFolder.add(ambientLight.position, 'z', -10, 10).name('Z Position');
ambientLightFolder.add(ambientLight, 'intensity', 0, 2).name('Intensity');
