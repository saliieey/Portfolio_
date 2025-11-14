// ==================== GSAP SETUP ====================
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// ==================== VARIABLES ====================
let isLoading = true;
let mouseX = 0;
let mouseY = 0;
let cursorX = 0;
let cursorY = 0;

// ==================== PRELOADER ====================
window.addEventListener('load', () => {
    const preloader = document.querySelector('.preloader');
    const progress = document.querySelector('.loader-progress');
    const percent = document.querySelector('.loader-percent');
    
    let loadProgress = 0;
    const loadInterval = setInterval(() => {
        loadProgress += Math.random() * 15;
        if (loadProgress >= 100) {
            loadProgress = 100;
            clearInterval(loadInterval);
            
            gsap.to(preloader, {
                yPercent: -100,
                duration: 1,
                delay: 0.5,
                ease: 'power4.inOut',
                onComplete: () => {
                    preloader.style.display = 'none';
                    isLoading = false;
                    initAnimations();
                    initThreeJS();
                }
            });
        }
        
        gsap.to(progress, {
            width: `${loadProgress}%`,
            duration: 0.3,
            ease: 'power2.out'
        });
        
        percent.textContent = Math.floor(loadProgress);
    }, 100);
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

// ==================== CUSTOM CURSOR ====================
const cursor = document.querySelector('.cursor');

document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    mouseY = (e.clientY / window.innerHeight) * 2 - 1;
});

function animateCursor() {
    cursorX += (event.clientX - cursorX) * 0.15;
    cursorY += (event.clientY - cursorY) * 0.15;
    
    cursor.style.left = cursorX + 'px';
    cursor.style.top = cursorY + 'px';
    
    requestAnimationFrame(animateCursor);
}

document.addEventListener('mousemove', (e) => {
    if (!cursor) return;
    event = e;
});

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

// Active section indicator
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').includes(current)) {
            link.classList.add('active');
        }
    });
});

// Mobile menu
if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        navLinksContainer.classList.toggle('active');
    });
}

// Smooth scroll
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute('href'));
        
        gsap.to(window, {
            duration: 1.5,
            scrollTo: {
                y: target,
                offsetY: 0
            },
            ease: 'power4.inOut'
        });
        
        navLinksContainer.classList.remove('active');
    });
});

// ==================== ANIMATIONS ====================
function initAnimations() {
    
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
                stat.textContent = Math.round(counter.value);
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

    // Projects 3D cards
    gsap.utils.toArray('.project-card').forEach((card, i) => {
        const inner = card.querySelector('.project-card-inner');
        
        gsap.from(inner, {
            scrollTrigger: {
                trigger: card,
                start: 'top 75%'
            },
            opacity: 0,
            y: 100,
            rotationX: -25,
            rotationY: i % 2 === 0 ? -15 : 15,
            scale: 0.85,
            duration: 1.5,
            ease: 'power4.out'
        });

        // Stagger content
        gsap.from(card.querySelectorAll('.project-title, .project-desc, .project-tags, .project-stats, .project-link'), {
            scrollTrigger: {
                trigger: card,
                start: 'top 70%'
            },
            opacity: 0,
            y: 40,
            stagger: 0.15,
            duration: 0.8,
            delay: 0.5,
            ease: 'power3.out'
        });

        const cardGlow = card.querySelector('.card-glow');
        if (cardGlow) {
            ScrollTrigger.create({
                trigger: card,
                start: 'top 78%',
                once: true,
                onEnter: () => {
                    gsap.fromTo(cardGlow, {
                        opacity: 0
                    }, {
                        opacity: 0.28,
                        duration: 0.8,
                        ease: 'power2.out',
                        yoyo: true,
                        repeat: 1,
                        repeatDelay: 0.1,
                        onComplete: () => {
                            gsap.to(cardGlow, {
                                opacity: 0.14,
                                duration: 0.6,
                                ease: 'power1.out'
                            });
                        }
                    });
                }
            });
        }

        // Advanced 3D hover
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            gsap.to(inner, {
                rotationX: -rotateX,
                rotationY: rotateY,
                transformPerspective: 1000,
                duration: 0.5,
                ease: 'power2.out'
            });

            // Parallax image
            gsap.to(card.querySelector('.project-image'), {
                x: (centerX - x) / 30,
                y: (centerY - y) / 30,
                duration: 0.5,
                ease: 'power2.out'
            });
        });

        card.addEventListener('mouseleave', () => {
            gsap.to(inner, {
                rotationX: 0,
                rotationY: 0,
                duration: 0.6,
                ease: 'power2.out'
            });

            gsap.to(card.querySelector('.project-image'), {
                x: 0,
                y: 0,
                duration: 0.6,
                ease: 'power2.out'
            });
        });
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