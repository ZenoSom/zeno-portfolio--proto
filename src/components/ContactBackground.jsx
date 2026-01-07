import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const ContactBackground = () => {
    const containerRef = useRef(null);

    useEffect(() => {
        if (!containerRef.current) return;

        // --- SHADERS ---
        const vert = `
            varying vec3 vNormal;
            varying vec3 camPos;
            varying vec2 vUv;

            void main() {
                vNormal = normal;
                vUv = uv;
                camPos = cameraPosition;
                gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
            }
        `;

        const frag = `
            #define NUM_OCTAVES 5
            #define M_PI 3.1415926535897932384626433832795
            uniform vec4 resolution;
            varying vec3 vNormal;
            uniform sampler2D perlinnoise;
            uniform sampler2D sparknoise;
            uniform float time;
            uniform vec3 color0;
            uniform vec3 color1;
            uniform vec3 color2;
            uniform vec3 color3;
            uniform vec3 color4;
            uniform vec3 color5;
            varying vec3 camPos;
            varying vec2 vUv;

            float setOpacity(float r, float g, float b, float tonethreshold) {
                float tone = (r + g + b) / 3.0;
                float alpha = 1.0;
                if(tone<tonethreshold) {
                    alpha = 0.0;
                }
                return alpha;
            }

            vec3 rgbcol(vec3 col) {
                return vec3(col.r/255.0,col.g/255.0,col.b/255.0);
            }

            vec2 rotate(vec2 v, float a) {
                float s = sin(a);
                float c = cos(a);
                mat2 m = mat2(c, -s, s, c);
                return m * v;
            }

            vec2 UnityPolarCoordinates (vec2 UV, vec2 Center, float RadialScale, float LengthScale){
                vec2 delta = UV - Center;
                float radius = length(delta) * 2. * RadialScale;
                float angle = atan(delta.x, delta.y) * 1.0/6.28 * LengthScale;
                return vec2(radius, angle);
            }

            void main() {
                vec2 olduv = gl_FragCoord.xy/resolution.xy ;
                vec2 uv = vUv ; 
                vec2 imguv = uv;
                float scale = 1.;
                olduv *= 0.5 + time; 
                olduv.y = olduv.y ;
                vec2 p = olduv*scale;
                vec4 txt = texture2D(perlinnoise, olduv);
                float gradient = dot(normalize( -camPos ), normalize( vNormal ));
                float pct = distance(vUv,vec2(0.5));

                vec3 rgbcolor0 = rgbcol(color0);
                vec3 rgbcolor1 = rgbcol(color1);
                vec3 rgbcolor2 = rgbcol(color2);
                vec3 rgbcolor5 = rgbcol(color5);

                float y = smoothstep(0.16,0.525,pct);
                vec3 backcolor = mix(rgbcolor0, rgbcolor5, y);

                gl_FragColor = vec4(backcolor,1.);

                vec2 center = vec2(0.5);
                vec2 cor = UnityPolarCoordinates(vec2(vUv.x,vUv.y), center, 1., 1.);

                vec2 newUv = vec2(cor.x + time,cor.x*0.2+cor.y);
                vec3 noisetex = texture2D(perlinnoise,mod(newUv,1.)).rgb;    
                vec3 noisetex2 = texture2D(sparknoise,mod(newUv,1.)).rgb;    

                float tone0 =  1. - smoothstep(0.3,0.6,noisetex.r);
                float tone1 =  smoothstep(0.3,0.6,noisetex2.r);

                float opacity0 = setOpacity(tone0,tone0,tone0,.29);
                float opacity1 = setOpacity(tone1,tone1,tone1,.49);

                if(opacity1>0.0){
                    gl_FragColor = vec4(rgbcolor2,0.)*vec4(opacity1);
                } else if(opacity0>0.0){
                    gl_FragColor = vec4(rgbcolor1,0.)*vec4(opacity0);
                }   
            }
        `;

        const vertcylinder = `
            varying vec2 vUv;

            void main() {
                vUv = uv;
                vec3 pos = vec3(position.x/1.,position.y,position.z/1.);
                if(pos.y >= 1.87){
                    pos = vec3(position.x*(sin((position.y - 0.6)*1.27)-0.16),position.y,position.z*(sin((position.y - 0.6)*1.27)-0.16));
                } else{
                    pos = vec3(position.x*(sin((position.y/2. -  .01)*.11)+0.75),position.y,position.z*(sin((position.y/2. -  .01)*.11)+0.75));
                }
                gl_Position = projectionMatrix * modelViewMatrix * vec4( pos, 1.0 );
            }
        `;

        const fragcylinder = `
            varying vec2 vUv;
            uniform sampler2D perlinnoise;
            uniform vec3 color4;
            uniform float time;
            varying vec3 vNormal;

            vec3 rgbcol(vec3 col) {
                return vec3(col.r/255.0,col.g/255.0,col.b/255.0);
            }

            void main() {
                vec3 noisetex = texture2D(perlinnoise,mod(1.*vec2(vUv.y-time*2.,vUv.x + time*1.),1.)).rgb;    
                gl_FragColor = vec4(noisetex.r);

                if(gl_FragColor.r >= 0.5){
                    gl_FragColor = vec4(rgbcol(color4),gl_FragColor.r);
                }else{
                    gl_FragColor = vec4(0.);
                }
                gl_FragColor *= vec4(sin(vUv.y) - 0.1);
                gl_FragColor *= vec4(smoothstep(0.3,0.628,vUv.y));

            }
        `;

        const vertflame = `
            varying vec2 vUv;
            varying vec3 camPos;
            varying vec3 vNormal;
            varying vec3 nois;
            uniform sampler2D noise;
            uniform float time;

            void main() {
                vUv = uv;
                camPos = cameraPosition;
                vNormal = normal;
                vec3 pos = vec3(position.x/1.,position.y,position.z/1.);
                vec3 noisetex = texture2D(noise,mod(1.*vec2(vUv.y-time*2.,vUv.x + time*1.),1.)).rgb;
                if(pos.y >= 1.87){
                    pos = vec3(position.x*(sin((position.y - 0.64)*1.27)-0.12),position.y,position.z*(sin((position.y - 0.64)*1.27)-0.12));
                } else{
                    pos = vec3(position.x*(sin((position.y/2. -  .01)*.11)+0.79),position.y,position.z*(sin((position.y/2. -  .01)*.11)+0.79));
                }
                pos.xz *= noisetex.r;
                gl_Position = projectionMatrix * modelViewMatrix * vec4( pos, 1.0 );
            }
        `;

        const fragflame = `
            varying vec2 vUv;
            uniform sampler2D perlinnoise;
            uniform sampler2D noise;
            uniform vec3 color4;
            uniform float time;
            varying vec3 camPos;
            varying vec3 vNormal;
            varying vec3 nois;

            vec3 rgbcol(vec3 col) {
                return vec3(col.r/255.0,col.g/255.0,col.b/255.0);
            }

            void main() {
                vec3 noisetex = texture2D(noise,mod(1.*vec2(vUv.y-time*2.,vUv.x + time*1.),1.)).rgb;
                gl_FragColor = vec4(noisetex.r);

                if(gl_FragColor.r >= 0.44){
                    gl_FragColor = vec4(rgbcol(color4),gl_FragColor.r);
                }
                else{
                    gl_FragColor = vec4(0.);
                }
                gl_FragColor *= vec4(smoothstep(0.2,0.628,vUv.y));
            }
        `;

        // --- SETUP ---
        const options = {
            exposure: 2.8,
            bloomStrength: 3.5,
            bloomRadius: 0.39,
            color0: [0, 0, 0],
            color1: [81, 14, 5],
            color2: [181, 156, 24],
            color3: [66, 66, 66],
            color4: [79, 79, 79],
            color5: [64, 27, 0]
        };

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, containerRef.current.clientWidth / containerRef.current.clientHeight, 0.1, 1000);
        camera.position.set(3.43, 3.52, 2.99);

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setClearColor(new THREE.Color('#000'), 0); // Transparent background
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
        containerRef.current.appendChild(renderer.domElement);

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableZoom = false; // Disable zoom for background

        // --- POST PROCESSING ---
        const renderScene = new RenderPass(scene, camera);
        const bloomPass = new UnrealBloomPass(
            new THREE.Vector2(containerRef.current.clientWidth, containerRef.current.clientHeight),
            1.5,
            0.4,
            0.85
        );
        bloomPass.threshold = 0;
        bloomPass.strength = options.bloomStrength;
        bloomPass.radius = options.bloomRadius;

        const bloomComposer = new EffectComposer(renderer);
        bloomComposer.addPass(renderScene);
        bloomComposer.addPass(bloomPass);

        // --- MATERIALS & MESHES ---
        // TEXTURE LOADERS
        const textureLoader = new THREE.TextureLoader();
        const noise9 = textureLoader.load("https://raw.githubusercontent.com/pizza3/asset/master/noise9.jpg");
        const sparklenoise = textureLoader.load("https://raw.githubusercontent.com/pizza3/asset/master/sparklenoise.jpg");
        const waterMin = textureLoader.load("https://raw.githubusercontent.com/pizza3/asset/master/water-min.jpg");

        // Sphere
        const geometry = new THREE.SphereGeometry(1, 30, 30);
        const material = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0.0 },
                perlinnoise: { value: noise9 },
                sparknoise: { value: sparklenoise },
                color5: { value: new THREE.Vector3(...options.color5) },
                color4: { value: new THREE.Vector3(...options.color4) },
                color3: { value: new THREE.Vector3(...options.color3) },
                color2: { value: new THREE.Vector3(...options.color2) },
                color1: { value: new THREE.Vector3(...options.color1) },
                color0: { value: new THREE.Vector3(...options.color0) },
                resolution: { value: new THREE.Vector2(containerRef.current.clientWidth, containerRef.current.clientHeight) }
            },
            vertexShader: vert,
            fragmentShader: frag
        });
        const sphereMesh = new THREE.Mesh(geometry, material);
        sphereMesh.scale.set(0.78, 0.78, 0.78);
        sphereMesh.position.set(1, 0, 0);
        scene.add(sphereMesh);

        // Cylinder
        const cylGeometry = new THREE.CylinderGeometry(1.11, 0, 5.3, 50, 50, true);
        const material2 = new THREE.ShaderMaterial({
            uniforms: {
                perlinnoise: { value: waterMin },
                color4: { value: new THREE.Vector3(...options.color4) },
                time: { value: 0.0 },
                noise: { value: noise9 }
            },
            vertexShader: vertcylinder,
            fragmentShader: fragcylinder,
            transparent: true,
            depthWrite: false,
            side: THREE.DoubleSide
        });
        const cylMesh = new THREE.Mesh(cylGeometry, material2);
        cylMesh.rotation.set(0, 0, -Math.PI / 2);
        cylMesh.position.set(1 - 4.05, 0, 0);
        cylMesh.scale.set(1.5, 1.7, 1.5);
        scene.add(cylMesh);

        // Flame
        const flameGeometry = new THREE.CylinderGeometry(1, 0, 5.3, 50, 50, true);
        const material3 = new THREE.ShaderMaterial({
            uniforms: {
                perlinnoise: { value: waterMin },
                color4: { value: new THREE.Vector3(...options.color5) },
                time: { value: 0.0 },
                noise: { value: noise9 }
            },
            vertexShader: vertflame,
            fragmentShader: fragflame,
            transparent: true,
            depthWrite: false,
            side: THREE.DoubleSide
        });
        const flameMesh = new THREE.Mesh(flameGeometry, material3);
        flameMesh.rotation.set(0, 0, -Math.PI / 2);
        flameMesh.position.set(1 - 4.78, 0, 0);
        flameMesh.scale.set(2, 2, 2);
        scene.add(flameMesh);

        // --- ANIMATION ---
        let animationId;
        const clock = new THREE.Clock(); // Use THREE.Clock for consistent deltaTime

        const animate = () => {
            animationId = requestAnimationFrame(animate);
            const delta = clock.getDelta() * 1000; // ms

            material.uniforms.time.value -= delta / (1000 * 2);
            material2.uniforms.time.value -= delta / (3000 * 2);
            material3.uniforms.time.value -= delta / (3000 * 2);

            controls.update();
            bloomComposer.render();
        };
        animate();

        // --- RESIZE ---
        const handleResize = () => {
            if (!containerRef.current) return;
            const w = containerRef.current.clientWidth;
            const h = containerRef.current.clientHeight;
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            renderer.setSize(w, h);
            bloomComposer.setSize(w, h);
        };
        window.addEventListener('resize', handleResize);

        // --- CLEANUP ---
        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationId);
            if (containerRef.current && renderer.domElement) {
                containerRef.current.removeChild(renderer.domElement);
            }
            // Dispose
            geometry.dispose();
            cylGeometry.dispose();
            flameGeometry.dispose();
            material.dispose();
            material2.dispose();
            material3.dispose();
            renderer.dispose();
        };
    }, []);

    return (
        <div
            ref={containerRef}
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: 0,
                pointerEvents: 'none' // Click through to form
            }}
        />
    );
};

export default ContactBackground;
