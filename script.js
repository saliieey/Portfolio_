// ==================== GSAP SETUP ====================
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// ==================== VARIABLES ====================
let isLoading = true;
let mouseX = 0;
let mouseY = 0;
let cursorX = 0;
let cursorY = 0;

// ==================== PRELOADER ====================
// Initialize animations immediately for better UX
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        initAnimations();
        initThreeJS();
        initAboutAnimation();
    });
} else {
    // DOM already loaded
    initAnimations();
    initThreeJS();
    initAboutAnimation();
}

// ==================== PRELOADER ANIMATION ====================
function initPreloaderAnimation() {
    const canvas = document.getElementById('preloader-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = 200;
    canvas.height = 200;
    
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const size = 60;
    let time = 0;
    
    // 3D wireframe cube vertices
    const vertices = [
        [-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1],
        [-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1]
    ];
    
    const edges = [
        [0, 1], [1, 2], [2, 3], [3, 0],
        [4, 5], [5, 6], [6, 7], [7, 4],
        [0, 4], [1, 5], [2, 6], [3, 7]
    ];
    
    function rotateX(vertex, angle) {
        const y = vertex[1];
        const z = vertex[2];
        return [vertex[0], y * Math.cos(angle) - z * Math.sin(angle), y * Math.sin(angle) + z * Math.cos(angle)];
    }
    
    function rotateY(vertex, angle) {
        const x = vertex[0];
        const z = vertex[2];
        return [x * Math.cos(angle) + z * Math.sin(angle), vertex[1], -x * Math.sin(angle) + z * Math.cos(angle)];
    }
    
    function project(vertex) {
        const scale = 80;
        const distance = 3;
        const z = vertex[2] + distance;
        return [
            centerX + (vertex[0] * scale) / z,
            centerY + (vertex[1] * scale) / z
        ];
    }
    
    function animateCube() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        time += 0.02;
        
        // Rotate and project vertices
        const rotated = vertices.map(v => {
            let rotated = rotateY(v, time);
            rotated = rotateX(rotated, time * 0.7);
            return project(rotated.map(coord => coord * size * 0.4));
        });
        
        // Draw wireframe cube
        ctx.strokeStyle = 'rgba(96, 165, 250, 0.8)';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        
        edges.forEach(edge => {
            const [start, end] = edge;
            ctx.beginPath();
            ctx.moveTo(rotated[start][0], rotated[start][1]);
            ctx.lineTo(rotated[end][0], rotated[end][1]);
            ctx.stroke();
        });
        
        // Draw vertices with glow
        rotated.forEach(vertex => {
            ctx.beginPath();
            ctx.arc(vertex[0], vertex[1], 4, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(59, 130, 246, 1)';
            ctx.fill();
            
            // Glow effect
            const gradient = ctx.createRadialGradient(vertex[0], vertex[1], 0, vertex[0], vertex[1], 8);
            gradient.addColorStop(0, 'rgba(59, 130, 246, 0.6)');
            gradient.addColorStop(1, 'rgba(59, 130, 246, 0)');
            ctx.fillStyle = gradient;
            ctx.fill();
        });
        
        requestAnimationFrame(animateCube);
    }
    
    animateCube();
    
    // Animate tech icons
    const techIcons = document.querySelectorAll('.tech-icon-loader');
    techIcons.forEach((icon, i) => {
        gsap.to(icon, {
            rotation: 360,
            duration: 3 + i,
            repeat: -1,
            ease: 'none'
        });
        
        gsap.to(icon, {
            y: -15,
            duration: 1.5 + i * 0.3,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            delay: i * 0.2
        });
        
        gsap.to(icon, {
            opacity: 0.4,
            duration: 1 + i * 0.2,
            repeat: -1,
            yoyo: true,
            ease: 'power2.inOut',
            delay: i * 0.3
        });
    });
    
    // Animate code text
    const codeChars = document.querySelectorAll('.code-char');
    codeChars.forEach((char, i) => {
        gsap.from(char, {
            opacity: 0,
            y: 10,
            duration: 0.5,
            delay: i * 0.1,
            ease: 'power2.out',
            repeat: -1,
            yoyo: true,
            repeatDelay: 2
        });
    });
}

// Initialize preloader animation immediately
initPreloaderAnimation();

window.addEventListener('load', () => {
    const preloader = document.querySelector('.preloader');
    const progress = document.querySelector('.loader-progress');
    const percent = document.querySelector('.loader-percent');
    const loaderGlow = document.querySelector('.loader-glow');
    
    if (!preloader) return;
    
    let loadProgress = 0;
    const loadInterval = setInterval(() => {
        loadProgress += Math.random() * 12 + 3;
        if (loadProgress >= 100) {
            loadProgress = 100;
            clearInterval(loadInterval);
            
            // Final animation
            gsap.to(progress, {
                width: '100%',
                duration: 0.5,
                ease: 'power2.out'
            });
            
            if (loaderGlow) {
                gsap.to(loaderGlow, {
                    width: '100%',
                    duration: 0.5,
                    ease: 'power2.out'
                });
            }
            
            setTimeout(() => {
                gsap.to(preloader, {
                    opacity: 0,
                    scale: 0.95,
                    duration: 0.8,
                    ease: 'power4.inOut',
                    onComplete: () => {
                        preloader.style.display = 'none';
                        isLoading = false;
                    }
                });
            }, 500);
        }
        
        if (progress) {
            gsap.to(progress, {
                width: `${loadProgress}%`,
                duration: 0.3,
                ease: 'power2.out'
            });
        }
        
        if (loaderGlow) {
            gsap.to(loaderGlow, {
                width: `${loadProgress}%`,
                duration: 0.3,
                ease: 'power2.out'
            });
        }
        
        if (percent) {
            percent.textContent = Math.floor(loadProgress);
        }
    }, 100);
    
    // Fallback: Hide preloader after max 3 seconds
    setTimeout(() => {
        if (preloader && preloader.style.display !== 'none') {
            clearInterval(loadInterval);
            gsap.to(preloader, {
                opacity: 0,
                duration: 0.5,
                onComplete: () => {
                    preloader.style.display = 'none';
                    isLoading = false;
                }
            });
        }
    }, 3000);
});

// ==================== THREE.JS BACKGROUND ====================
function initThreeJS() {
    const canvas = document.getElementById('canvas-3d');
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: true
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Create particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 1500;
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 100;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.03,
        color: 0x3b82f6,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // Create geometric shapes
    const torusGeometry = new THREE.TorusGeometry(12, 3, 16, 100);
    const torusMaterial = new THREE.MeshBasicMaterial({
        color: 0x3b82f6,
        wireframe: true,
        transparent: true,
        opacity: 0.08
    });
    const torus = new THREE.Mesh(torusGeometry, torusMaterial);
    torus.position.set(20, -10, -30);
    scene.add(torus);

    const octahedronGeometry = new THREE.OctahedronGeometry(10);
    const octahedronMaterial = new THREE.MeshBasicMaterial({
        color: 0x60a5fa,
        wireframe: true,
        transparent: true,
        opacity: 0.06
    });
    const octahedron = new THREE.Mesh(octahedronGeometry, octahedronMaterial);
    octahedron.position.set(-20, 10, -40);
    scene.add(octahedron);

    camera.position.z = 50;

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);

        particlesMesh.rotation.y += 0.0003;
        particlesMesh.rotation.x += 0.0002;

        torus.rotation.x += 0.005;
        torus.rotation.y += 0.003;

        octahedron.rotation.x += 0.003;
        octahedron.rotation.y += 0.005;

        // Mouse parallax
        camera.position.x += (mouseX * 0.05 - camera.position.x) * 0.05;
        camera.position.y += (-mouseY * 0.05 - camera.position.y) * 0.05;
        camera.lookAt(scene.position);

        renderer.render(scene, camera);
    }

    animate();

    // Handle resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

// ==================== ABOUT SECTION ANIMATION ====================
function initAboutAnimation() {
    const canvas = document.getElementById('about-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const container = canvas.parentElement;
    
    function resizeCanvas() {
        const rect = container.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    let time = 0;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const size = Math.min(canvas.width, canvas.height) * 0.4;
    
    // 3D wireframe cube vertices
    const vertices = [
        [-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1],
        [-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1]
    ];
    
    const edges = [
        [0, 1], [1, 2], [2, 3], [3, 0],
        [4, 5], [5, 6], [6, 7], [7, 4],
        [0, 4], [1, 5], [2, 6], [3, 7]
    ];
    
    function rotateX(vertex, angle) {
        const y = vertex[1];
        const z = vertex[2];
        return [vertex[0], y * Math.cos(angle) - z * Math.sin(angle), y * Math.sin(angle) + z * Math.cos(angle)];
    }
    
    function rotateY(vertex, angle) {
        const x = vertex[0];
        const z = vertex[2];
        return [x * Math.cos(angle) + z * Math.sin(angle), vertex[1], -x * Math.sin(angle) + z * Math.cos(angle)];
    }
    
    function project(vertex) {
        const scale = 200;
        const distance = 3;
        const z = vertex[2] + distance;
        return [
            centerX + (vertex[0] * scale) / z,
            centerY + (vertex[1] * scale) / z
        ];
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        time += 0.01;
        
        // Background gradient
        const bgGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, size * 1.5);
        bgGradient.addColorStop(0, 'rgba(59, 130, 246, 0.15)');
        bgGradient.addColorStop(0.5, 'rgba(96, 165, 250, 0.08)');
        bgGradient.addColorStop(1, 'rgba(59, 130, 246, 0)');
        ctx.fillStyle = bgGradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Rotate and project vertices
        const rotated = vertices.map(v => {
            let rotated = rotateY(v, time * 0.5);
            rotated = rotateX(rotated, time * 0.3);
            return project(rotated.map(coord => coord * size * 0.3));
        });
        
        // Draw wireframe cube
        ctx.strokeStyle = 'rgba(147, 197, 253, 0.6)';
        ctx.lineWidth = 1.5;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        
        edges.forEach(edge => {
            const [start, end] = edge;
            ctx.beginPath();
            ctx.moveTo(rotated[start][0], rotated[start][1]);
            ctx.lineTo(rotated[end][0], rotated[end][1]);
            ctx.stroke();
        });
        
        // Draw vertices
        rotated.forEach(vertex => {
            ctx.beginPath();
            ctx.arc(vertex[0], vertex[1], 3, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(59, 130, 246, 0.8)';
            ctx.fill();
        });
        
        // Add glow effect
        const glowGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, size);
        glowGradient.addColorStop(0, 'rgba(147, 197, 253, 0.2)');
        glowGradient.addColorStop(1, 'rgba(147, 197, 253, 0)');
        ctx.fillStyle = glowGradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        requestAnimationFrame(animate);
    }
    
    animate();
    
    // Animate code snippets
    const codeSnippets = document.querySelectorAll('.code-snippet');
    codeSnippets.forEach((snippet, i) => {
        gsap.from(snippet, {
            scrollTrigger: {
                trigger: '.about-grid',
                start: 'top 70%'
            },
            opacity: 0,
            y: 30,
            duration: 1,
            delay: 0.5 + i * 0.2,
            ease: 'power3.out'
        });
        
        // Subtle floating animation
        gsap.to(snippet, {
            y: '+=10',
            duration: 3 + i,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            delay: i * 0.5
        });
    });
    
    // Animate tech badges
    const techBadges = document.querySelectorAll('.tech-badge');
    techBadges.forEach((badge, i) => {
        gsap.from(badge, {
            scrollTrigger: {
                trigger: '.about-grid',
                start: 'top 70%'
            },
            opacity: 0,
            scale: 0.8,
            rotation: -180,
            duration: 0.8,
            delay: 1 + i * 0.15,
            ease: 'back.out(1.7)'
        });
        
        // Hover effect
        badge.addEventListener('mouseenter', () => {
            gsap.to(badge, {
                scale: 1.15,
                y: -5,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
        
        badge.addEventListener('mouseleave', () => {
            gsap.to(badge, {
                scale: 1,
                y: 0,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
    });
}

// ==================== CUSTOM CURSOR ====================
const cursor = document.querySelector('.cursor');

let lastMouseX = 0;
let lastMouseY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    mouseY = (e.clientY / window.innerHeight) * 2 - 1;
    lastMouseX = e.clientX;
    lastMouseY = e.clientY;
});

function animateCursor() {
    if (!cursor) return;
    
    cursorX += (lastMouseX - cursorX) * 0.15;
    cursorY += (lastMouseY - cursorY) * 0.15;
    
    cursor.style.left = cursorX + 'px';
    cursor.style.top = cursorY + 'px';
    
    requestAnimationFrame(animateCursor);
}

animateCursor();

// Cursor hover effects
const hoverElements = document.querySelectorAll('a, button, .btn, .project-card, .skill-card');
hoverElements.forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
});

// ==================== NAVIGATION ====================
const nav = document.querySelector('.nav');
const navLinks = document.querySelectorAll('.nav-link');
const menuToggle = document.querySelector('.nav-menu-toggle');
const navLinksContainer = document.querySelector('.nav-links');

// Scroll effect
window.addEventListener('scroll', () => {
    if (window.pageYOffset > 100) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
});

// Active section indicator - Improved with debouncing and better logic
const sections = document.querySelectorAll('section[id]');
let activeSection = '';
let scrollTimeout = null;

function updateActiveSection() {
    const scrollPos = window.pageYOffset + window.innerHeight / 3; // Use 1/3 of viewport as trigger point
    let newActiveSection = '';
    
    // Check sections from bottom to top to get the most relevant one
    for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionBottom = sectionTop + sectionHeight;
        
        // More precise calculation - section is active if scroll position is within its bounds
        if (scrollPos >= sectionTop - 100 && scrollPos < sectionBottom - 100) {
            newActiveSection = section.getAttribute('id');
            break;
        }
    }
    
    // Special case for home section (at top)
    if (scrollPos < 300) {
        newActiveSection = 'home';
    }
    
    // Only update if section changed to prevent flickering
    if (newActiveSection !== activeSection && newActiveSection !== '') {
        activeSection = newActiveSection;
        
        // Remove active class from all links with smooth transition
        navLinks.forEach(link => {
            if (link.classList.contains('active')) {
                gsap.to(link, {
                    opacity: 0.7,
                    duration: 0.2,
                    ease: 'power2.out',
                    onComplete: () => {
                        link.classList.remove('active');
                        gsap.set(link, { opacity: 1 });
                    }
                });
            } else {
                link.classList.remove('active');
            }
        });
        
        // Add active class to current link with smooth transition
        navLinks.forEach(link => {
            if (link.getAttribute('href') === `#${activeSection}`) {
                gsap.fromTo(link, 
                    { opacity: 0.7 },
                    {
                        opacity: 1,
                        duration: 0.3,
                        ease: 'power2.out',
                        onStart: () => {
                            link.classList.add('active');
                        }
                    }
                );
            }
        });
    }
}

// Throttled scroll handler to prevent performance issues
let ticking = false;
window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            updateActiveSection();
            ticking = false;
        });
        ticking = true;
    }
    
    // Also update nav scrolled state
    if (window.pageYOffset > 100) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
});

// Initial call
updateActiveSection();

// Mobile menu
if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        navLinksContainer.classList.toggle('active');
    });
}

// Smooth scroll with proper active state handling
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute('href'));
        
        if (!target) return;
        
        // Temporarily disable scroll-based active state updates during smooth scroll
        let isScrolling = true;
        
        // Update active state immediately for clicked link
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        activeSection = target.getAttribute('id');
        
        gsap.to(window, {
            duration: 1.2,
            scrollTo: {
                y: target,
                offsetY: 80
            },
            ease: 'power3.inOut',
            onComplete: () => {
                isScrolling = false;
                // Final update after scroll completes
                setTimeout(() => {
                    updateActiveSection();
                }, 100);
            }
        });
        
        navLinksContainer.classList.remove('active');
    });
});

// ==================== ANIMATIONS ====================
function initAnimations() {
    // Ensure all content is visible first
    gsap.set('body', { visibility: 'visible' });
    gsap.set('.hero, .section', { visibility: 'visible' });
    
    // Hero animations
    const heroTl = gsap.timeline({ defaults: { ease: 'power4.out' } });
    
    const sheenTl = gsap.timeline({ defaults: { ease: 'power2.out' } });
    sheenTl
        .set('.title-line', {
            '--sheen-pos': '-140%',
            '--sheen-alpha': 0
        })
        .to('.title-line', {
            '--sheen-alpha': 0.85,
            duration: 0.01,
            stagger: 0.2
        })
        .to('.title-line', {
            '--sheen-pos': '140%',
            duration: 1.2,
            stagger: 0.2
        }, 0)
        .to('.title-line', {
            '--sheen-alpha': 0,
            duration: 0.6,
            ease: 'power1.out'
        }, 0.9);

    heroTl
        .from('.nav', {
            yPercent: -100,
            opacity: 0,
            duration: 1,
            delay: 0.3
        })
        .from('.hero-badge', {
            opacity: 0,
            scale: 0.8,
            duration: 0.8
        }, '-=0.5')
        .from('.title-wrapper', {
            yPercent: 100,
            opacity: 0,
            stagger: 0.2,
            duration: 1.2,
            ease: 'power4.out'
        }, '-=0.4')
        .from('.hero-subtitle span', {
            opacity: 0,
            y: 30,
            stagger: 0.15,
            duration: 0.8
        }, '-=0.6')
        .from('.hero-cta .btn', {
            opacity: 0,
            y: 30,
            scale: 0.9,
            stagger: 0.15,
            duration: 0.8
        }, '-=0.4')
        .from('.hero-scroll-indicator', {
            opacity: 0,
            y: 20,
            duration: 0.8
        }, '-=0.4')
        .add(sheenTl, '-=0.6');

    // Section headers animation
    gsap.utils.toArray('.section-header').forEach(header => {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: header,
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            }
        });

        tl.from(header.querySelector('.section-number'), {
            opacity: 0,
            x: -30,
            duration: 0.8,
            ease: 'power3.out'
        })
        .from(header.querySelector('.section-title .title-word'), {
            opacity: 0,
            y: 60,
            rotationX: -45,
            stagger: 0.1,
            duration: 1,
            ease: 'power4.out'
        }, '-=0.5')
        .from(header.querySelector('.section-line'), {
            scaleX: 0,
            transformOrigin: 'left',
            duration: 0.8,
            ease: 'power3.out'
        }, '-=0.5');
    });

    // About section
    gsap.from('.about-image', {
        scrollTrigger: {
            trigger: '.about-grid',
            start: 'top 70%'
        },
        opacity: 0,
        scale: 0.9,
        rotationY: -15,
        duration: 1.2,
        ease: 'power4.out'
    });

    gsap.from('.about-content > *', {
        scrollTrigger: {
            trigger: '.about-content',
            start: 'top 75%'
        },
        opacity: 0,
        x: 50,
        stagger: 0.15,
        duration: 1,
        ease: 'power3.out'
    });

    // Stats counter
    gsap.utils.toArray('.stat-number').forEach(stat => {
        const target = parseInt(stat.dataset.target, 10);
        const suffix = stat.dataset.suffix || '';
        const counter = { value: 0 };

        gsap.to(counter, {
            scrollTrigger: {
                trigger: stat,
                start: 'top 85%',
                once: true
            },
            value: target,
            duration: 2.5,
            ease: 'power2.out',
            onUpdate: () => {
                const roundedValue = Math.round(counter.value);
                stat.textContent = roundedValue + suffix;
            },
            onComplete: () => {
                // Ensure suffix is added even if animation completes quickly
                if (suffix && !stat.textContent.includes(suffix)) {
                    stat.textContent = target + suffix;
                }
            }
        });

        const statItem = stat.closest('.stat-item');
        const statBar = statItem?.querySelector('.stat-bar');

        if (statBar) {
            const fill = { width: 0 };
            gsap.to(fill, {
                scrollTrigger: {
                    trigger: statBar,
                    start: 'top 85%',
                    once: true
                },
                width: 100,
                duration: 2,
                ease: 'power3.out',
                onUpdate: () => {
                    statBar.style.setProperty('--fill-width', `${fill.width}%`);
                }
            });
        }
    });

    // Skills cards with 3D effect
    gsap.utils.toArray('.skill-card').forEach((card, i) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 80%'
            },
            opacity: 0,
            y: 80,
            rotationX: -20,
            rotationY: -10,
            scale: 0.9,
            duration: 1.2,
            delay: i * 0.15,
            ease: 'power4.out'
        });

        // Skill bars animation
        const skillBars = card.querySelectorAll('.skill-bar');
        skillBars.forEach((bar, index) => {
            const width = bar.dataset.width;
            
            gsap.to(bar, {
                scrollTrigger: {
                    trigger: bar,
                    start: 'top 85%',
                    once: true
                },
                onStart: () => {
                    const style = document.createElement('style');
                    style.textContent = `
                        .skill-bar[data-width="${width}"]::after {
                            animation: fillBar${width} 1.5s ${index * 0.1}s forwards cubic-bezier(0.65, 0, 0.35, 1);
                        }
                        @keyframes fillBar${width} {
                            to { width: ${width}%; }
                        }
                    `;
                    document.head.appendChild(style);
                }
            });
        });

        // 3D hover effect
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 15;
            const rotateY = (centerX - x) / 15;
            
            gsap.to(card.querySelector('.card-content'), {
                rotationX: -rotateX,
                rotationY: rotateY,
                duration: 0.5,
                ease: 'power2.out'
            });
        });

        card.addEventListener('mouseleave', () => {
            gsap.to(card.querySelector('.card-content'), {
                rotationX: 0,
                rotationY: 0,
                duration: 0.5,
                ease: 'power2.out'
            });
        });
    });

    // Section reveal
    gsap.utils.toArray('.section').forEach(section => {
        if (section.id === 'home') return;

        gsap.from(section, {
            scrollTrigger: {
                trigger: section,
                start: 'top 80%',
                once: true
            },
            opacity: 0,
            y: 60,
            duration: 1,
            ease: 'power3.out'
        });

        gsap.from(section, {
            scrollTrigger: {
                trigger: section,
                start: 'top 80%',
                once: true
            },
            clipPath: 'inset(12% 18% 12% 18%)',
            duration: 1.15,
            ease: 'power2.out'
        });
    });

    // Experience timeline
    gsap.utils.toArray('.experience-item').forEach((item, i) => {
        gsap.from(item.querySelector('.experience-card'), {
            scrollTrigger: {
                trigger: item,
                start: 'top 75%'
            },
            opacity: 0,
            x: -80,
            duration: 1,
            ease: 'power4.out'
        });

        gsap.from(item.querySelector('.experience-dot'), {
            scrollTrigger: {
                trigger: item,
                start: 'top 75%'
            },
            scale: 0,
            duration: 0.6,
            delay: 0.3,
            ease: 'back.out(2)'
        });

        gsap.from(item.querySelectorAll('.experience-list li'), {
            scrollTrigger: {
                trigger: item,
                start: 'top 70%'
            },
            opacity: 0,
            x: 30,
            stagger: 0.1,
            duration: 0.8,
            delay: 0.5,
            ease: 'power3.out'
        });
    });

    // Projects - Professional Animation
    gsap.utils.toArray('.project-card').forEach((card, i) => {
        if (!card) return;
        
        const inner = card.querySelector('.project-card-inner');
        const header = card.querySelector('.project-header');
        const image = card.querySelector('.project-image-container');
        const content = card.querySelector('.project-content');
        const title = content ? content.querySelector('.project-title') : null;
        const desc = content ? content.querySelector('.project-desc') : null;
        const tags = card.querySelectorAll('.tag');
        const stats = card.querySelectorAll('.stat');
        const link = card.querySelector('.project-link');
        const cardGlow = card.querySelector('.card-glow');
        const imageShine = card.querySelector('.image-shine');
        if (!inner) return;
        
        // Always ensure card is visible first (critical for preventing layout bugs)
        gsap.set(inner, { 
            opacity: 1, 
            y: 0, 
            scale: 1,
            visibility: 'visible',
            clearProps: 'all'
        });
        
        // Ensure all content is visible by default
        if (header) gsap.set(header, { opacity: 1, visibility: 'visible', clearProps: 'all' });
        if (image) gsap.set(image, { opacity: 1, visibility: 'visible', clearProps: 'all' });
        if (content) gsap.set(content, { opacity: 1, visibility: 'visible', clearProps: 'all' });
        if (tags.length > 0) gsap.set(tags, { opacity: 1, x: 0, visibility: 'visible', clearProps: 'all' });
        if (stats.length > 0) gsap.set(stats, { opacity: 1, scale: 1, visibility: 'visible', clearProps: 'all' });
        if (link) gsap.set(link, { opacity: 1, x: 0, visibility: 'visible', clearProps: 'all' });
        
        // Small delay to ensure DOM is ready, then check viewport
        setTimeout(() => {
            const rect = card.getBoundingClientRect();
            const isInViewport = rect.top < window.innerHeight + 100;
            
            // Only set animation states if not in viewport
            if (!isInViewport) {
                gsap.set(inner, { opacity: 0, y: 60, scale: 0.95 });
                if (header) gsap.set(header, { opacity: 0 });
                if (image) gsap.set(image, { opacity: 0 });
                if (content) gsap.set(content, { opacity: 0 });
                if (tags.length > 0) gsap.set(tags, { opacity: 0, x: -20 });
                if (stats.length > 0) gsap.set(stats, { opacity: 0, scale: 0.8 });
                if (link) gsap.set(link, { opacity: 0, x: -10 });
            }
        }, 50);
        
        // Main card animation
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: card,
                start: 'top 85%',
                once: true
            }
        });
        
        tl.to(inner, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            ease: 'power3.out'
        });
        
        if (header) {
            tl.from(header, {
                opacity: 0,
                y: -20,
                duration: 0.6,
                ease: 'power2.out'
            }, '-=0.4');
        }
        
        if (image) {
            tl.from(image, {
                opacity: 0,
                scale: 1.1,
                duration: 0.7,
                ease: 'power2.out'
            }, '-=0.5');
        }
        
        if (title) {
            tl.from(title, {
                opacity: 0,
                y: 20,
                duration: 0.6,
                ease: 'power2.out'
            }, '-=0.4');
        }
        
        if (desc) {
            tl.from(desc, {
                opacity: 0,
                y: 15,
                duration: 0.6,
                ease: 'power2.out'
            }, '-=0.5');
        }
        
        if (tags.length > 0) {
            tl.to(tags, {
                opacity: 1,
                x: 0,
                duration: 0.5,
                stagger: 0.08,
                ease: 'power2.out'
            }, '-=0.3');
        }
        
        if (stats.length > 0) {
            tl.to(stats, {
                opacity: 1,
                scale: 1,
                duration: 0.5,
                stagger: 0.1,
                ease: 'back.out(1.2)'
            }, '-=0.4');
        }
        
        if (link) {
            tl.to(link, {
                opacity: 1,
                x: 0,
                duration: 0.5,
                ease: 'power2.out'
            }, '-=0.3');
        }
        
        // Smooth hover effect
        card.addEventListener('mousemove', (e) => {
            if (!inner) return;
            
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 25;
            const rotateY = (centerX - x) / 25;
            
            gsap.to(inner, {
                rotationX: -rotateX * 0.5,
                rotationY: rotateY * 0.5,
                y: -8,
                scale: 1.02,
                duration: 0.4,
                ease: 'power2.out'
            });
            
            if (cardGlow) {
                gsap.to(cardGlow, {
                    opacity: 0.4,
                    scale: 1.1,
                    duration: 0.4,
                    ease: 'power2.out'
                });
            }
            
            if (imageShine) {
                gsap.to(imageShine, {
                    opacity: 0.6,
                    x: (centerX - x) / 20,
                    y: (centerY - y) / 20,
                    duration: 0.4,
                    ease: 'power2.out'
                });
            }
            
        });
        
        card.addEventListener('mouseleave', () => {
            if (!inner) return;
            
            gsap.to(inner, {
                rotationX: 0,
                rotationY: 0,
                y: 0,
                scale: 1,
                duration: 0.5,
                ease: 'power2.out'
            });
            
            if (cardGlow) {
                gsap.to(cardGlow, {
                    opacity: 0.1,
                    scale: 1,
                    duration: 0.5,
                    ease: 'power2.out'
                });
            }
            
            if (imageShine) {
                gsap.to(imageShine, {
                    opacity: 0,
                    x: 0,
                    y: 0,
                    duration: 0.5,
                    ease: 'power2.out'
                });
            }
        });
        
        // Link hover animation
        if (link) {
            link.addEventListener('mouseenter', () => {
                gsap.to(link, {
                    x: 5,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            });
            
            link.addEventListener('mouseleave', () => {
                gsap.to(link, {
                    x: 0,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            });
        }
    });

    // Contact section
    gsap.from('.contact-intro', {
        scrollTrigger: {
            trigger: '.contact-content',
            start: 'top 75%'
        },
        opacity: 0,
        y: 50,
        duration: 1,
        ease: 'power4.out'
    });

    gsap.utils.toArray('.contact-card').forEach((card, i) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: '.contact-grid',
                start: 'top 80%'
            },
            opacity: 0,
            y: 60,
            scale: 0.9,
            duration: 1,
            delay: i * 0.15,
            ease: 'power4.out'
        });
    });

    gsap.from('.social-link', {
        scrollTrigger: {
            trigger: '.social-links',
            start: 'top 85%'
        },
        opacity: 0,
        x: -30,
        stagger: 0.1,
        duration: 0.8,
        ease: 'power3.out'
    });

    // Parallax sections
    gsap.utils.toArray('.section').forEach(section => {
        gsap.to(section, {
            scrollTrigger: {
                trigger: section,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1
            },
            y: -50,
            ease: 'none'
        });
    });
}

// ==================== MAGNETIC BUTTONS ====================
document.querySelectorAll('.btn, .project-link, .social-link').forEach(btn => {
    btn.addEventListener('mousemove', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        gsap.to(this, {
            x: x * 0.3,
            y: y * 0.3,
            duration: 0.4,
            ease: 'power2.out'
        });
    });

    btn.addEventListener('mouseleave', function() {
        gsap.to(this, {
            x: 0,
            y: 0,
            duration: 0.6,
            ease: 'elastic.out(1, 0.3)'
        });
    });
});

// ==================== SMOOTH SCROLL REVEAL ====================
ScrollTrigger.create({
    start: 'top -80',
    end: 99999,
    toggleClass: {
        className: 'scrolled',
        targets: '.nav'
    }
});

// ==================== PAGE TRANSITIONS ====================
window.addEventListener('beforeunload', () => {
    gsap.to('body', {
        opacity: 0,
        duration: 0.5
    });
});

// ==================== RESIZE HANDLER ====================
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        ScrollTrigger.refresh();
    }, 250);
});

// ==================== FALLBACK: ENSURE CONTENT IS VISIBLE ====================
// If animations fail or take too long, ensure content is visible
setTimeout(() => {
    const hero = document.querySelector('.hero');
    const sections = document.querySelectorAll('.section');
    const projectCards = document.querySelectorAll('.project-card-inner');
    
    // Check if hero is visible
    if (hero) {
        const heroOpacity = window.getComputedStyle(hero).opacity;
        if (heroOpacity === '0' || heroOpacity === '') {
            gsap.set(hero, { opacity: 1, visibility: 'visible' });
        }
    }
    
    // Check project cards
    projectCards.forEach(card => {
        if (card) {
            const cardOpacity = window.getComputedStyle(card).opacity;
            if (cardOpacity === '0') {
                gsap.set(card, { opacity: 1, visibility: 'visible' });
                // Also show child elements
                const children = card.querySelectorAll('*');
                children.forEach(child => {
                    const childOpacity = window.getComputedStyle(child).opacity;
                    if (childOpacity === '0') {
                        gsap.set(child, { opacity: 1, visibility: 'visible' });
                    }
                });
            }
        }
    });
}, 2000);