// Animated Welcome Video - HTML5 Canvas Animation
document.addEventListener('DOMContentLoaded', function() {
    const videoContainer = document.querySelector('.welcome-video');
    if (!videoContainer) return;
    
    // Create canvas element
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 450;
    canvas.style.width = '100%';
    canvas.style.height = 'auto';
    canvas.style.borderRadius = '8px';
    canvas.style.backgroundColor = '#7a0019'; // UMD Maroon
    
    // Replace video element with canvas
    const videoElement = videoContainer.querySelector('video');
    if (videoElement) {
        videoElement.replaceWith(canvas);
    } else {
        videoContainer.appendChild(canvas);
    }
    
    const ctx = canvas.getContext('2d');
    
    // Animation state
    let currentSlide = 0;
    let slideTime = 0;
    const slideDuration = 4000; // 4 seconds per slide
    const slides = [
        {
            title: "Welcome!",
            subtitle: "I'm Jordi Fortunat",
            text: "Business Management & Marketing Student at UMD"
        },
        {
            title: "About Me",
            subtitle: "Sophomore at University of Minnesota Duluth",
            text: "19 years old | From Burnsville, Minnesota | Pursuing a career in Sports Marketing & Broadcasting"
        },
        {
            title: "Education",
            subtitle: "Apple Valley High School",
            text: "Graduated with 3.0 GPA | 3-Sport Varsity Athlete | 6-Time Letterman | 4-Year AVID Student"
        },
        {
            title: "Current Studies",
            subtitle: "UMD - Business Management Major, Marketing Minor",
            text: "Expected Graduation: May 2028 | Focus: Sports Marketing & Sports Broadcasting"
        },
        {
            title: "Experience",
            subtitle: "R.A.M. Solutions - Campaign Trainer",
            text: "Learned business management, team leadership, and direct marketing | Summer 2025"
        },
        {
            title: "Skills",
            subtitle: "Strong Leader | Great Communication | Team Player",
            text: "Adaptable | Fast-Learner | Driven | Hardworking | Multilingual (English, Ewe, French)"
        },
        {
            title: "Thank You!",
            subtitle: "Explore my website to learn more",
            text: "Check out my hobbies, resume, career interests, and try the interactive game!"
        }
    ];
    
    // Animation variables
    let animationId;
    let startTime = Date.now();
    
    // Draw functions
    function drawBackground() {
        // Gradient background
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, '#7a0019'); // UMD Maroon
        gradient.addColorStop(1, '#5a0013'); // Darker maroon
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Decorative elements
        ctx.fillStyle = 'rgba(255, 204, 51, 0.1)'; // UMD Gold with transparency
        for (let i = 0; i < 20; i++) {
            ctx.beginPath();
            ctx.arc(
                Math.random() * canvas.width,
                Math.random() * canvas.height,
                Math.random() * 30 + 10,
                0,
                Math.PI * 2
            );
            ctx.fill();
        }
    }
    
    function drawSlide(slide, progress) {
        // Fade in/out effect
        const fadeIn = Math.min(progress / 500, 1);
        const fadeOut = progress > slideDuration - 500 ? Math.max((slideDuration - progress) / 500, 0) : 1;
        const alpha = Math.min(fadeIn, fadeOut);
        
        ctx.save();
        ctx.globalAlpha = alpha;
        
        // Title
        ctx.fillStyle = '#ffcc33'; // UMD Gold
        ctx.font = 'bold 48px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(slide.title, canvas.width / 2, canvas.height / 2 - 80);
        
        // Subtitle
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 28px Arial';
        ctx.fillText(slide.subtitle, canvas.width / 2, canvas.height / 2 - 20);
        
        // Text
        ctx.fillStyle = '#ffffff';
        ctx.font = '20px Arial';
        
        // Wrap text if needed
        const words = slide.text.split(' ');
        const lines = [];
        let currentLine = '';
        
        words.forEach(word => {
            const testLine = currentLine + word + ' ';
            const metrics = ctx.measureText(testLine);
            if (metrics.width > canvas.width - 100 && currentLine !== '') {
                lines.push(currentLine);
                currentLine = word + ' ';
            } else {
                currentLine = testLine;
            }
        });
        lines.push(currentLine);
        
        lines.forEach((line, index) => {
            ctx.fillText(line.trim(), canvas.width / 2, canvas.height / 2 + 40 + (index * 30));
        });
        
        ctx.restore();
    }
    
    function animate() {
        const currentTime = Date.now();
        const elapsed = currentTime - startTime;
        
        // Calculate current slide
        currentSlide = Math.floor(elapsed / slideDuration) % slides.length;
        slideTime = elapsed % slideDuration;
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw
        drawBackground();
        drawSlide(slides[currentSlide], slideTime);
        
        // Continue animation
        animationId = requestAnimationFrame(animate);
    }
    
    // Start animation
    animate();
    
    // Responsive canvas
    function resizeCanvas() {
        const container = videoContainer;
        const maxWidth = Math.min(800, container.clientWidth - 40);
        const aspectRatio = 800 / 450;
        canvas.style.width = maxWidth + 'px';
        canvas.style.height = (maxWidth / aspectRatio) + 'px';
    }
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
});

