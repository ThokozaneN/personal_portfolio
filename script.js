// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Initialize animations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {

    // Set current year in footer
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
    
    // Update local time
    function updateTime() {
const now = new Date();
const options = { 
    timeZone: 'Africa/Johannesburg',
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
};
const timeString = now.toLocaleTimeString('en-US', options);
document.getElementById('local-time').textContent = timeString;
    }
    updateTime();
    setInterval(updateTime, 1000);
    
    // Hamburger Menu Toggle
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobile-menu');
    
    hamburger.addEventListener('click', () => {
hamburger.classList.toggle('active');
mobileMenu.classList.toggle('active');
    });
    
    // Close mobile menu when clicking links
    mobileMenu.querySelectorAll('a').forEach(link => {
link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    mobileMenu.classList.remove('active');
});
    });
    
    // Preloader Animation
    const preloaderTl = gsap.timeline({
onComplete: () => {
    document.body.classList.remove('overflow-hidden'); // Enable scrolling after preloader
    animateHero();
}
    });

    preloaderTl.to("#loading-bar", {
width: "100%",
duration: 1.8,
ease: "power2.inOut"
    })
    .to("#preloader", {
opacity: 0,
duration: 0.6,
ease: "power2.out",
onComplete: () => {
    document.getElementById("preloader").style.display = "none";
}
    });

    // Hero Animation Function
    function animateHero() {
const heroTl = gsap.timeline({ 
    defaults: { ease: "power3.out" },
    onComplete: initHeroScrollTriggers // Important: Init scroll triggers only AFTER entrance animation
});

// Animate navbar elements
heroTl.to(".logo", {
    opacity: 1,
    y: 0,
    duration: 0.8
}, 0)
.to(".nav-item", {
    opacity: 1,
    y: 0,
    duration: 0.6,
    stagger: 0.1
}, 0.2)
.to(".hamburger", {
    opacity: 1,
    duration: 0.6
}, 0.2)

// Animate "Imagine" background text first (appears behind)
.fromTo(".imagine-container",
    { opacity: 0, scale: 0.95 },
    { opacity: 1, scale: 1, duration: 1, ease: "power2.out" }
, 0.2)

// Animate profile image (slides in from left, covers "Imagine")
.fromTo(".profile-container", 
    { opacity: 0, x: -200 },
    { opacity: 1, x: 0, duration: 1.2, ease: "power3.out" }
, 0.4)

// Animate "Develop" foreground text (appears in front)
.fromTo(".develop-container",
    { opacity: 0, clipPath: "inset(0 100% 0 0)" },
    { opacity: 1, clipPath: "inset(0 0% 0 0)", duration: 1, ease: "power3.inOut" }
, 0.8)


// Animate location/time
.to(".location-time", {
    opacity: 1,
    y: 0,
    duration: 0.8
}, 1)

// Animate social icons
.to(".social-icons", {
    opacity: 1,
    y: 0,
    duration: 0.8
}, 1.1);
    }
    
    // Hero Scroll Animations - Initialize these separately
    function initHeroScrollTriggers() {
// Animation starts when scrolling starts (scrubs based on hero position)
gsap.to(".imagine-container", {
    scrollTrigger: {
trigger: "#hero",
start: "top top",
end: "bottom top",
scrub: true
    },
    x: -100,
    opacity: 0
});

gsap.to(".profile-container", {
    scrollTrigger: {
trigger: "#hero",
start: "top top",
end: "bottom top",
scrub: true
    },
    y: 50,
    x: -150,
    scale: 0.85,
    opacity: 0
});

gsap.to(".develop-container", {
    scrollTrigger: {
trigger: "#hero",
start: "top top",
end: "bottom top",
scrub: true
    },
    x: 100,
    opacity: 0
});

gsap.to(".location-time", {
    scrollTrigger: {
trigger: "#hero",
start: "top top",
end: "60% top",
scrub: true
    },
    opacity: 0,
    y: 20
});

gsap.to(".social-icons", {
    scrollTrigger: {
trigger: "#hero",
start: "top top",
end: "60% top",
scrub: true
    },
    opacity: 0,
    y: 20
});
    }
    
    // Navbar background on scroll - This can run independently
    ScrollTrigger.create({
trigger: "#hero",
start: "bottom top+=100", // Becomes active when hero bottom is near top
onEnter: () => {
    gsap.to(".navbar", {
backgroundColor: "rgba(255,255,255,0.95)",
backdropFilter: "blur(10px)",
boxShadow: "0 1px 20px rgba(0,0,0,0.05)",
duration: 0.3
    });
},
onLeaveBack: () => {
    gsap.to(".navbar", {
backgroundColor: "transparent",
backdropFilter: "none",
boxShadow: "none",
duration: 0.3
    });
}
    });

    // Hide navbar during Projects section; show again on Approach
    // (keeps existing hero background behavior; this only manages overall visibility)
    ScrollTrigger.create({
trigger: "#projects-section",
start: "top top+=1",
end: () => {
    const approach = document.querySelector('#approach-section');
    if (!approach) return "bottom bottom";
    return `bottom top+=1`;
},
onEnter: () => {
    gsap.to('.navbar', { opacity: 0, y: -12, duration: 0.25, ease: 'power2.out', pointerEvents: 'none' });
},
onEnterBack: () => {
    gsap.to('.navbar', { opacity: 0, y: -12, duration: 0.25, ease: 'power2.out', pointerEvents: 'none' });
},
onLeave: () => {
    gsap.to('.navbar', { opacity: 1, y: 0, duration: 0.25, ease: 'power2.out', pointerEvents: 'auto' });
},
onLeaveBack: () => {
    gsap.to('.navbar', { opacity: 1, y: 0, duration: 0.25, ease: 'power2.out', pointerEvents: 'auto' });
}
    });

    // Who Am I Section Animations
    const whoAmISection = document.querySelector('#who-am-i');
    
    // Header animation
    gsap.from('.who-header', {
scrollTrigger: {
    trigger: '.who-header',
    start: 'top 80%',
    toggleActions: 'play none none reverse'
},
y: 60,
opacity: 0,
duration: 1,
ease: 'power3.out'
    });

    // Intro animation
    gsap.from('.who-intro p', {
scrollTrigger: {
    trigger: '.who-intro',
    start: 'top 80%',
    toggleActions: 'play none none reverse'
},
y: 40,
opacity: 0,
duration: 0.8,
stagger: 0.2,
ease: 'power3.out'
    });

    // Counter animations
    const counterItems = document.querySelectorAll('.counter-item');
    counterItems.forEach((item, index) => {
gsap.from(item, {
    scrollTrigger: {
trigger: '.counters-section',
start: 'top 80%',
toggleActions: 'play none none reverse'
    },
    y: 50,
    opacity: 0,
    duration: 0.8,
    delay: index * 0.15,
    ease: 'power3.out'
});
    });

    // Animated counters
    const counters = document.querySelectorAll('.counter-value');
    counters.forEach(counter => {
const target = parseInt(counter.getAttribute('data-target'));

ScrollTrigger.create({
    trigger: '.counters-section',
    start: 'top 80%',
    onEnter: () => {
gsap.to(counter, {
    duration: 2,
    ease: 'power2.out',
    onUpdate: function() {
counter.textContent = Math.floor(this.progress() * target);
    },
    onComplete: function() {
counter.textContent = target;
    }
});
    },
    once: true
});
    });

    // Tech tags animation
    const techTags = document.querySelectorAll('.tech-tag');
    techTags.forEach((tag, index) => {
gsap.from(tag, {
    scrollTrigger: {
trigger: '.tech-section',
start: 'top 85%',
toggleActions: 'play none none reverse'
    },
    scale: 0,
    opacity: 0,
    duration: 0.5,
    delay: index * 0.05,
    ease: 'back.out(1.7)'
});
    });

    // Image Card Pin and Dynamic Content
    const imageCard = document.querySelector('.image-card');
    const pinnedCard = document.getElementById('pinned-card');
    const images = [
document.getElementById('card-image-1'),
document.getElementById('card-image-2')
    ];
    const dots = [
document.getElementById('dot-1'),
document.getElementById('dot-2')
    ];
    const cardLabel = document.getElementById('card-label');
    const cardTitle = document.getElementById('card-title');
    const cardDesc = document.getElementById('card-desc');

    const cardContent = [
{ label: 'Creative Mind', title: 'Alex Morgan', desc: 'Digital Creator & Developer' },
{ label: 'Your Expert', title: 'Skills & Services', desc: 'Delivering excellence in every project' }
    ];

    let currentImageIndex = 0;

    function updateCardContent(index) {
if (index === currentImageIndex) return;

// Update images
images.forEach((img, i) => {
    if (img) img.style.opacity = i === index ? '1' : '0';
});

// Update dots
dots.forEach((dot, i) => {
    if (dot) {
dot.classList.toggle('bg-indigo-500', i === index);
dot.classList.toggle('bg-gray-600', i !== index);
    }
});

// Update content with animation
if (cardLabel && cardTitle && cardDesc) {
    gsap.to([cardLabel, cardTitle, cardDesc], {
y: -20,
opacity: 0,
duration: 0.3,
onComplete: () => {
    cardLabel.textContent = cardContent[index].label;
    cardTitle.textContent = cardContent[index].title;
    cardDesc.textContent = cardContent[index].desc;
    gsap.fromTo([cardLabel, cardTitle, cardDesc], 
{ y: 20, opacity: 0 },
{ y: 0, opacity: 1, duration: 0.3, stagger: 0.05 }
    );
}
    });
}

currentImageIndex = index;
    }

    // Create a wrapper for both sections for the pin effect
    const whoSection = document.querySelector('#who-am-i');
    const skillsSection = document.querySelector('#what-can-i-do');
    
    // GSAP Pin effect - pins the image card across both sections
    if (pinnedCard && whoSection && skillsSection) {
ScrollTrigger.create({
    trigger: '#who-am-i',
    start: 'top top',
    endTrigger: '#what-can-i-do .skills-list',
    end: 'top center',
    pin: pinnedCard,
    pinSpacing: false,
    onUpdate: (self) => {
const progress = self.progress;

// Two images: first half shows image 1, second half shows image 2
if (progress < 0.35) {
    updateCardContent(0);
} else {
    updateCardContent(1);
}

// Subtle card rotation based on scroll (no fade)
if (imageCard) {
    const rotateY = (progress - 0.5) * 6;
    const scale = 1 + Math.sin(progress * Math.PI) * 0.02;
    imageCard.style.transform = `perspective(1000px) rotateY(${rotateY}deg) scale(${scale})`;
}
    }
});
    }

    // What Can I Do Section Animations
    gsap.from('.skills-header', {
scrollTrigger: {
    trigger: '.skills-header',
    start: 'top 80%',
    toggleActions: 'play none none reverse'
},
y: 60,
opacity: 0,
duration: 1,
ease: 'power3.out'
    });

    // Skill items entrance animation
    const skillItems = document.querySelectorAll('.skill-item');
    skillItems.forEach((item, index) => {
gsap.from(item, {
    scrollTrigger: {
trigger: item,
start: 'top 90%',
toggleActions: 'play none none reverse'
    },
    y: 40,
    opacity: 0,
    duration: 0.6,
    delay: index * 0.1,
    ease: 'power3.out'
});

// Click to expand/collapse
item.addEventListener('click', () => {
    const isExpanded = item.classList.contains('expanded');
    
    // Close all other items
    skillItems.forEach(i => {
if (i !== item) {
    i.classList.remove('expanded');
}
    });
    
    // Toggle current item
    item.classList.toggle('expanded');

    // Animate sub-skills
    const subSkills = item.querySelectorAll('.sub-skill-item');
    if (!isExpanded) {
subSkills.forEach((skill, i) => {
    gsap.fromTo(skill, 
{ x: -15, opacity: 0 },
{ x: 0, opacity: 1, duration: 0.3, delay: i * 0.04, ease: 'power2.out' }
    );
});
    }
});
    });

    // Projects Section Sequence Animation
    const projectsTl = gsap.timeline({
scrollTrigger: {
    trigger: "#projects-section",
    start: "top top",
    end: "bottom bottom",
    pin: "#projects-pin",
    scrub: 1,
    anticipatePin: 1
}
    });

    projectsTl
// 1. Split the covers open (push slightly past 100% to guarantee full clearance)
.to("#split-top", { yPercent: -110, ease: "power2.inOut", duration: 1.2 })
.to("#split-bottom", { yPercent: 110, ease: "power2.inOut", duration: 1.2 }, "<")

// 1b. Ensure covers stay out of view after opening
.set(["#split-top", "#split-bottom"], { pointerEvents: "none" })

// 2. Animate Project 1 Text In (Simultaneously with split end)
.to(".project-anim-1", {
    y: 0,
    opacity: 1,
    stagger: 0.1,
    duration: 0.7,
    ease: "power2.out"
}, "-=0.6")

// 3. Slide in Project 2 (slightly longer for smoother pacing)
.to("#project-2", {
    xPercent: -100, // Move left by 100% to enter viewport
    ease: "none", // Linear scrub for slide effect
    duration: 2.0
})

// 4. Slide in Project 3 (slow it down more so it doesn't rush)
.to("#project-3", {
    xPercent: -100,
    ease: "none",
    duration: 2.6
});

    // Approach Section Animation
    const approachContainer = document.querySelector("#approach-container");
    const approachSection = document.querySelector("#approach-section");
    
    if (approachContainer && approachSection) {
// Calculate total scroll distance
// We want to scroll until the end of the container is visible
// So we move it left by (scrollWidth - window.innerWidth)
// Add some padding to the calculation

const getScrollAmount = () => {
    let amount = approachContainer.scrollWidth - window.innerWidth;
    return -(amount);
};

const tween = gsap.to(approachContainer, {
    x: getScrollAmount,
    ease: "none"
});

ScrollTrigger.create({
    trigger: "#approach-section",
    start: "top top",
    end: () => `+=${getScrollAmount() * -1}`, // scroll distance matches horizontal width
    pin: true,
    animation: tween,
    scrub: 1,
    invalidateOnRefresh: true,
    onUpdate: (self) => {
// Update Progress Bar
const progress = self.progress;
gsap.to("#approach-progress", {
    width: `${progress * 100}%`,
    duration: 0.1,
    ease: "none"
});

// Parallax Background Text (Moves slightly opposite to scroll)
gsap.to("#approach-bg-text", {
    x: -100 * progress, // subtle movement
    duration: 0.5,
    ease: "power1.out"
});

// Reveal active step line
const steps = document.querySelectorAll('.approach-step');
steps.forEach((step, index) => {
    // Simple logic: if progress roughly matches step index
    // This adds a nice interactive "highlight" as you pass by
    const stepProgress = index / (steps.length - 1);
    const distance = Math.abs(progress - stepProgress);
    
    const line = step.querySelector('.border-t div');
    if (line) {
if (distance < 0.15) {
    line.style.transform = 'scaleX(1)';
} else {
    line.style.transform = 'scaleX(0)';
}
    }
});
    }
});
    }

    // Contact / Creative Form animations
    if (document.querySelector('#contact')) {
gsap.from('.contact-head', {
    scrollTrigger: {
trigger: '#contact',
start: 'top 75%',
toggleActions: 'play none none reverse'
    },
    y: 40,
    opacity: 0,
    duration: 0.9,
    ease: 'power3.out'
});

gsap.from('.contact-sub', {
    scrollTrigger: {
trigger: '#contact',
start: 'top 72%',
toggleActions: 'play none none reverse'
    },
    y: 24,
    opacity: 0,
    duration: 0.8,
    ease: 'power3.out'
});

gsap.utils.toArray('.form-line').forEach((line, i) => {
    gsap.from(line, {
scrollTrigger: {
    trigger: line,
    start: 'top 85%',
    toggleActions: 'play none none reverse'
},
y: 24,
opacity: 0,
duration: 0.7,
delay: Math.min(i * 0.05, 0.25),
ease: 'power3.out'
    });
});
    }

    // Creative form submit (FormSubmit)
    const creativeForm = document.getElementById('creative-form');
    const cfStatus = document.getElementById('cf-status');
    const sendBtn = creativeForm?.querySelector('button[type="submit"]');

    const setSendBtnState = (state) => {
if (!sendBtn) return;
const states = {
    idle: { text: 'Send', classes: 'bg-black text-white' },
    success: { text: '✓', classes: 'bg-emerald-500 text-white' },
    fail: { text: '✕', classes: 'bg-neutral-700 text-white' },
    sending: { text: '…', classes: 'bg-white/80 text-black' }
};
const s = states[state] || states.idle;
sendBtn.textContent = s.text;

// keep existing hover/shape classes, only swap color-related classes
sendBtn.classList.remove('bg-black', 'bg-emerald-500', 'bg-neutral-700', 'bg-white/80', 'text-white', 'text-black');
s.classes.split(' ').forEach(c => sendBtn.classList.add(c));
    };

    if (creativeForm) {
// reset button if user edits anything after a submission
creativeForm.addEventListener('input', () => setSendBtnState('idle'));

creativeForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Honeypot: if filled, silently pretend success
    const honey = creativeForm.querySelector('input[name="_honey"]')?.value;
    if (honey && honey.trim().length) {
setSendBtnState('success');
if (cfStatus) cfStatus.textContent = "Thanks — message received.";
return;
    }

    const topic = creativeForm.querySelector('input[name="topic"]:checked')?.value || '';
    const channel = creativeForm.querySelector('input[name="channel"]:checked')?.value || '';

    // Update FormSubmit subject dynamically
    const subjEl = creativeForm.querySelector('input[name="_subject"]');
    if (subjEl) subjEl.value = `New Inquiry: ${topic}`;

    // Add a friendly combined meta field (helps readability in the email)
    let metaEl = creativeForm.querySelector('input[name="meta"]');
    if (!metaEl) {
metaEl = document.createElement('input');
metaEl.type = 'hidden';
metaEl.name = 'meta';
creativeForm.appendChild(metaEl);
    }
    metaEl.value = `Topic: ${topic} | Preferred channel: ${channel}`;

    const creativeMessages = [
"Sending your message…",
"Sealing the envelope…",
"Routing this to my inbox…",
"Dispatching…",
"Delivering your brief…"
    ];
    if (cfStatus) cfStatus.textContent = creativeMessages[Math.floor(Math.random() * creativeMessages.length)];

    setSendBtnState('sending');

    try {
const action = creativeForm.getAttribute('action');
const formData = new FormData(creativeForm);

const res = await fetch(action, {
    method: 'POST',
    body: formData,
    headers: {
'Accept': 'application/json'
    }
});

if (res.ok) {
    setSendBtnState('success');
    if (cfStatus) cfStatus.textContent = "Sent — I’ll get back to you shortly.";
    creativeForm.reset();
    setTimeout(() => setSendBtnState('idle'), 2200);
} else {
    setSendBtnState('fail');
    if (cfStatus) cfStatus.textContent = "Hmm—something blocked the send. Please try again or email me directly.";
    setTimeout(() => setSendBtnState('idle'), 2400);
}
    } catch (err) {
setSendBtnState('fail');
if (cfStatus) cfStatus.textContent = "Network error — please check your connection and try again.";
setTimeout(() => setSendBtnState('idle'), 2400);
    }
});
    }

    // Smooth scrolling for internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
anchor.addEventListener('click', function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute('href')).scrollIntoView({
behavior: 'smooth'
    });
});
    });

});

