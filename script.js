// Global variables
let selectedFile = null;
let currentCaption = '';

// DOM elements
const uploadArea = document.getElementById('uploadArea');
const imageInput = document.getElementById('imageInput');
const previewImage = document.getElementById('previewImage');
const uploadSection = document.getElementById('uploadSection');
const previewSection = document.getElementById('previewSection');
const resultSection = document.getElementById('resultSection');
const loadingOverlay = document.getElementById('loadingOverlay');
const generateBtn = document.getElementById('generateBtn');
const generatedCaption = document.getElementById('generatedCaption');
const toastContainer = document.getElementById('toastContainer');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    addParticleEffect();
});

// Initialize all event listeners
function initializeEventListeners() {
    // File input change
    imageInput.addEventListener('change', handleFileSelect);
    
    // Drag and drop events
    uploadArea.addEventListener('dragover', handleDragOver);
    uploadArea.addEventListener('dragleave', handleDragLeave);
    uploadArea.addEventListener('drop', handleDrop);
    
    // Click to upload
    uploadArea.addEventListener('click', () => imageInput.click());
}

// Handle file selection
function handleFileSelect(event) {
    const file = event.target.files[0];
    if (file && isValidImageFile(file)) {
        processSelectedFile(file);
    } else {
        showToast('Please select a valid image file (JPEG, PNG, GIF)', 'error');
    }
}

// Handle drag over
function handleDragOver(event) {
    event.preventDefault();
    uploadArea.classList.add('dragover');
}

// Handle drag leave
function handleDragLeave(event) {
    event.preventDefault();
    uploadArea.classList.remove('dragover');
}

// Handle drop
function handleDrop(event) {
    event.preventDefault();
    uploadArea.classList.remove('dragover');
    
    const files = event.dataTransfer.files;
    if (files.length > 0) {
        const file = files[0];
        if (isValidImageFile(file)) {
            processSelectedFile(file);
        } else {
            showToast('Please drop a valid image file (JPEG, PNG, GIF)', 'error');
        }
    }
}

// Validate image file
function isValidImageFile(file) {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    return validTypes.includes(file.type);
}

// Process selected file
function processSelectedFile(file) {
    selectedFile = file;
    
    // Create preview
    const reader = new FileReader();
    reader.onload = function(e) {
        previewImage.src = e.target.result;
        showPreviewSection();
    };
    reader.readAsDataURL(file);
    
    showToast('Image uploaded successfully!', 'success');
}

// Show preview section
function showPreviewSection() {
    uploadSection.style.display = 'none';
    previewSection.style.display = 'block';
    resultSection.style.display = 'none';
    
    // Add animation
    previewSection.style.animation = 'fadeInUp 0.8s ease-out';
}

// Reset upload
function resetUpload() {
    selectedFile = null;
    currentCaption = '';
    imageInput.value = '';
    
    uploadSection.style.display = 'block';
    previewSection.style.display = 'none';
    resultSection.style.display = 'none';
    
    // Reset animations
    uploadSection.style.animation = 'fadeInUp 1s ease-out 0.3s both';
    previewSection.style.animation = '';
    resultSection.style.animation = '';
}

// Generate caption
async function generateCaption() {
    if (!selectedFile) {
        showToast('Please select an image first', 'error');
        return;
    }
    
    // Show loading state
    showLoading(true);
    setGenerateButtonLoading(true);
    
    try {
        // Create FormData for file upload
        const formData = new FormData();
        formData.append('image', selectedFile);
        
        // Make API call to backend
        const response = await fetch('http://localhost:3000/api/posts/generate-caption', {
            method: 'POST',
            body: formData,
        });
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Display the result
        currentCaption = data.caption;
        displayResult(currentCaption);
        
        showToast('Caption generated successfully!', 'success');
        
    } catch (error) {
        console.error('Error generating caption:', error);
        showToast(error.message || 'Failed to generate caption. Please try again.', 'error');
    } finally {
        showLoading(false);
        setGenerateButtonLoading(false);
    }
}

// Display result
function displayResult(caption) {
    generatedCaption.textContent = caption;
    
    previewSection.style.display = 'none';
    resultSection.style.display = 'block';
    resultSection.style.animation = 'fadeInUp 0.8s ease-out';
}

// Show/hide loading overlay
function showLoading(show) {
    loadingOverlay.style.display = show ? 'flex' : 'none';
}

// Set generate button loading state
function setGenerateButtonLoading(loading) {
    const btnText = generateBtn.querySelector('.btn-text');
    const btnLoading = generateBtn.querySelector('.btn-loading');
    
    if (loading) {
        btnText.style.display = 'none';
        btnLoading.style.display = 'inline';
        generateBtn.disabled = true;
    } else {
        btnText.style.display = 'inline';
        btnLoading.style.display = 'none';
        generateBtn.disabled = false;
    }
}

// Copy caption to clipboard
async function copyCaption() {
    try {
        await navigator.clipboard.writeText(currentCaption);
        showToast('Caption copied to clipboard!', 'success');
    } catch (error) {
        console.error('Failed to copy:', error);
        showToast('Failed to copy caption', 'error');
    }
}

// Share caption
function shareCaption() {
    if (navigator.share) {
        navigator.share({
            title: 'AI Generated Caption',
            text: currentCaption,
            url: window.location.href
        }).catch(error => {
            console.error('Error sharing:', error);
            showToast('Failed to share caption', 'error');
        });
    } else {
        // Fallback: copy to clipboard
        copyCaption();
    }
}

// Show toast notification
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    
    toastContainer.appendChild(toast);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        toast.style.animation = 'slideInRight 0.3s ease-out reverse';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }, 3000);
}

// Add particle effect to background
function addParticleEffect() {
    const container = document.querySelector('.container');
    
    // Create particles
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            position: fixed;
            width: ${Math.random() * 4 + 1}px;
            height: ${Math.random() * 4 + 1}px;
            background: rgba(255, 255, 255, ${Math.random() * 0.3 + 0.1});
            border-radius: 50%;
            left: ${Math.random() * 100}vw;
            top: ${Math.random() * 100}vh;
            pointer-events: none;
            z-index: -1;
            animation: float-particle ${Math.random() * 10 + 10}s linear infinite;
        `;
        document.body.appendChild(particle);
    }
}

// Add CSS for particle animation
const style = document.createElement('style');
style.textContent = `
    @keyframes float-particle {
        0% {
            transform: translateY(0px) rotate(0deg);
            opacity: 0;
        }
        10% {
            opacity: 1;
        }
        90% {
            opacity: 1;
        }
        100% {
            transform: translateY(-100vh) rotate(360deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Add keyboard shortcuts
document.addEventListener('keydown', function(event) {
    // Ctrl/Cmd + Enter to generate caption
    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
        if (previewSection.style.display !== 'none') {
            generateCaption();
        }
    }
    
    // Escape to reset
    if (event.key === 'Escape') {
        resetUpload();
    }
});

// Add touch support for mobile
if ('ontouchstart' in window) {
    uploadArea.addEventListener('touchstart', function() {
        this.style.transform = 'scale(0.98)';
    });
    
    uploadArea.addEventListener('touchend', function() {
        this.style.transform = '';
    });
}

// Add smooth scrolling for better UX
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add intersection observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.upload-section, .preview-section, .result-section').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Add error handling for network issues
window.addEventListener('online', function() {
    showToast('Connection restored!', 'success');
});

window.addEventListener('offline', function() {
    showToast('No internet connection. Please check your network.', 'error');
});

// Add service worker for PWA capabilities (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('SW registered: ', registration);
            })
            .catch(function(registrationError) {
                console.log('SW registration failed: ', registrationError);
            });
    });
} 