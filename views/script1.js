
const result = await response.json(); 

function setupSearch() {
    // const searchInput = document.querySelector('.search-bar input');
    const searchInput = result
    const searchIcon = document.querySelector('.search-bar i');

    function handleSearch() {
        // const searchTerm = searchInput.value.toLowerCase().trim();
        const searchTerm = searchInput.toLowerCase().trim();
        const matchedCrop = Object.values(cropsDatabase).find(crop => 
            crop.name.toLowerCase().includes(searchTerm) ||
            crop.type.toLowerCase().includes(searchTerm) ||
            crop.season.toLowerCase().includes(searchTerm)
        );

        if (matchedCrop) {
            updateCropDisplay(matchedCrop);
            searchInput.value = '';
        } else {
            showNotification('Crop not found. Try another search.');
        }
    }

    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });

    searchIcon.addEventListener('click', handleSearch);
}

// Image hover effects
function setupImageEffects() {
    const cropImage = document.querySelector('#cropImage');
    
    cropImage.addEventListener('mousemove', (e) => {
        const { left, top, width, height } = e.target.getBoundingClientRect();
        const x = (e.clientX - left) / width;
        const y = (e.clientY - top) / height;
        
        gsap.to(cropImage, {
            duration: 0.5,
            transform: `scale(1.05) translate(${(x - 0.5) * 10}px, ${(y - 0.5) * 10}px)`,
            ease: 'power2.out'
        });
    });

    cropImage.addEventListener('mouseleave', () => {
        gsap.to(cropImage, {
            duration: 0.5,
            transform: 'scale(1) translate(0, 0)',
            ease: 'power2.out'
        });
    });
}

// Card hover effects
function setupCardEffects() {
    document.querySelectorAll('.info-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            gsap.to(card.querySelector('.progress-bar'), {
                width: '100%',
                duration: 0.5,
                ease: 'power2.out'
            });
        });

        card.addEventListener('mouseleave', () => {
            gsap.to(card.querySelector('.progress-bar'), {
                width: '0%',
                duration: 0.5,
                ease: 'power2.out'
            });
        });
    });
}

// Initial page load animations
function initPageAnimations() {
    // Remove loading overlay
    setTimeout(() => {
        gsap.to('.loading-overlay', {
            opacity: 0,
            duration: 0.5,
            onComplete: () => {
                document.querySelector('.loading-overlay').style.display = 'none';
            }
        });

        // Animate content
        gsap.timeline()
            .to('.header', {
                opacity: 1,
                duration: 1,
                ease: 'power2.out'
            })
            .to('.container', {
                opacity: 1,
                y: 0,
                duration: 1,
                ease: 'power2.out'
            }, '-=0.5')
            .to('.search-bar-container', {
                opacity: 1,
                y: 0,
                duration: 1,
                ease: 'power2.out'
            }, '-=0.5');
    }, 1500);
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize with default crop (Tomato)
    updateCropDisplay(cropsDatabase.tomato);
    
    // Setup all interactive features
    setupSearch();
    setupImageEffects();
    setupCardEffects();
    initPageAnimations();

    // Add keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === '/' || (e.key === 'k' && (e.metaKey || e.ctrlKey))) {
            e.preventDefault();
            document.querySelector('.search-bar input').focus();
        }
    });
});

// Error handling for images
document.querySelector('#cropImage').addEventListener('error', function() {
    this.src = 'https://via.placeholder.com/400?text=Crop+Image+Not+Found';
});