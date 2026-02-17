// Gallery data will be loaded from JSON
let galleryData = [];
let countriesData = {};
let filteredData = [];
let currentLightboxIndex = 0;
const activeFilters = {
    categories: new Set(),
    countries: new Set(),
    towns: new Set(),
    places: new Set(),
    search: ''
};

// DOM Elements
const gallery = document.getElementById('gallery');
const filterDialog = document.getElementById('filterDialog');
const filterDialogClose = document.getElementById('filterDialogClose');
const filterToggle = document.getElementById('filterToggle');
const themeToggle = document.getElementById('themeToggle');
const scrollTopBtn = document.getElementById('scrollTop');
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightboxImage');
const lightboxTitle = document.getElementById('lightboxTitle');
const lightboxLocation = document.getElementById('lightboxLocation');
const lightboxTags = document.getElementById('lightboxTags');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxPrev = document.getElementById('lightboxPrev');
const lightboxNext = document.getElementById('lightboxNext');
const clearFiltersBtn = document.getElementById('clearFilters');
const searchInput = document.getElementById('searchInput');
const imageCount = document.getElementById('imageCount');
const loadingMessage = document.getElementById('loadingMessage');
const noResults = document.getElementById('noResults');

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', async () => {
    await loadI18n();
    initializeTheme();
    loadGalleryData();
    setupEventListeners();
});

// ==================== i18n (Internationalization) ====================
let i18nData = {};
let currentLang = 'en';

async function loadI18n() {
    try {
        const res = await fetch('i18n.json');
        if (!res.ok) throw new Error('Failed to load translations');
        i18nData = await res.json();
        currentLang = detectPreferredLanguage();
        applyTranslations(i18nData[currentLang] || i18nData['en'] || {});
    } catch (err) {
        console.warn('i18n load failed, falling back to defaults', err);
    }
}

function detectPreferredLanguage() {
    const saved = localStorage.getItem('lang');
    if (saved && i18nData[saved]) return saved;

    const nav = navigator.language || (navigator.languages && navigator.languages[0]) || 'en';
    // Prefer exact country-based Spanish for Colombia, otherwise any 'es' uses Spanish
    const lower = nav.toLowerCase();
    if (lower.includes('es')) return 'es';
    if (lower.includes('en')) return 'en';
    // fallback: check navigator.languages
    if (navigator.languages) {
        for (const l of navigator.languages) {
            if (l.toLowerCase().includes('es')) return 'es';
            if (l.toLowerCase().includes('en')) return 'en';
        }
    }
    return 'en';
}

function applyTranslations(map) {
    if (!map) return;
    // Set document language
    try { document.documentElement.lang = currentLang; } catch (e) {}

    // Replace simple text nodes
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        const val = map[key];
        if (val !== undefined) {
            el.textContent = replaceTokens(val);
        }
    });

    // Placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        const val = map[key];
        if (val !== undefined) el.setAttribute('placeholder', replaceTokens(val));
    });

    // aria-label attributes
    document.querySelectorAll('[data-i18n-aria]').forEach(el => {
        const key = el.getAttribute('data-i18n-aria');
        const val = map[key];
        if (val !== undefined) el.setAttribute('aria-label', replaceTokens(val));
    });

    // title attributes
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
        const key = el.getAttribute('data-i18n-title');
        const val = map[key];
        if (val !== undefined) el.setAttribute('title', replaceTokens(val));
    });

    // meta tags (content)
    document.querySelectorAll('meta[data-i18n]').forEach(meta => {
        const key = meta.getAttribute('data-i18n');
        const val = map[key];
        if (val !== undefined) meta.setAttribute('content', replaceTokens(val));
    });

    // page title (element with id pageTitle)
    const pageTitleEl = document.getElementById('pageTitle');
    if (pageTitleEl) {
        const key = pageTitleEl.getAttribute('data-i18n') || 'page.title';
        const val = map[key];
        if (val !== undefined) pageTitleEl.textContent = replaceTokens(val);
        // ensure document.title is in sync
        document.title = pageTitleEl.textContent || document.title;
    }
}

function replaceTokens(s) {
    if (typeof s !== 'string') return s;
    const year = new Date().getFullYear();
    return s.replace('{year}', year);
}

function setLanguage(lang) {
    if (!i18nData[lang]) return;
    currentLang = lang;
    localStorage.setItem('lang', lang);
    applyTranslations(i18nData[lang]);
}

// ==================== Theme Management ====================
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        setTheme(savedTheme);
        return;
    }
    // Default to system preference when user hasn't chosen a theme
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme(prefersDark ? 'dark' : 'light');
    // Listen for system preference changes only when user hasn't set a preference
    if (window.matchMedia) {
        const mq = window.matchMedia('(prefers-color-scheme: dark)');
        const handler = (e) => {
            if (!localStorage.getItem('theme')) {
                setTheme(e.matches ? 'dark' : 'light');
            }
        };
        if (mq.addEventListener) mq.addEventListener('change', handler);
        else if (mq.addListener) mq.addListener(handler);
    }
}

function setTheme(theme) {
    const html = document.documentElement;
    if (theme === 'dark') {
        html.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
    } else {
        html.removeAttribute('data-theme');
        localStorage.setItem('theme', 'light');
    }
}

function toggleTheme() {
    const html = document.documentElement;
    const isDark = html.getAttribute('data-theme') === 'dark';
    setTheme(isDark ? 'light' : 'dark');
}

// ==================== Load Gallery Data ====================
async function loadGalleryData() {
    try {
        showLoadingMessage(true);
        const galleryResponse = await fetch('gallery-data.json');
        if (!galleryResponse.ok) throw new Error('Failed to load gallery data');
        galleryData = await galleryResponse.json();
        
        const countriesResponse = await fetch('countries.json');
        if (!countriesResponse.ok) throw new Error('Failed to load countries data');
        const countriesList = await countriesResponse.json();
        countriesList.forEach(entry => {
            countriesData[entry.country] = entry.icon;
        });
        
        // Order by id (highest first) so latest-captured images appear first
        galleryData.sort((a, b) => (Number(b.id) || 0) - (Number(a.id) || 0));
        
        initializeFilters();
        displayGallery();
    } catch (error) {
        console.error('Error loading gallery:', error);
        showLoadingMessage(false);
        noResults.hidden = false;
    }
}

// ==================== Filter Initialization ====================
function initializeFilters() {
    const categories = new Set();
    const countries = new Set();
    const towns = new Set();
    const places = new Set();

    galleryData.forEach(image => {
        image.category?.forEach(cat => categories.add(cat));
        if (image.country) countries.add(image.country);
        if (image.town) towns.add(image.town);
        if (image.place) places.add(image.place);
    });

    renderFilterGroup('categoryFilter', Array.from(categories), 'categories');
    renderFilterGroup('countryFilter', Array.from(countries), 'countries');
    renderFilterGroup('townFilter', Array.from(towns), 'towns');
    renderFilterGroup('placeFilter', Array.from(places), 'places');
}

function countryCodeToFlag(countryCode) {
    if (!countryCode || countryCode.length !== 2) return '';
    const codePoints = [...countryCode.toUpperCase()].map(c => 127397 + c.charCodeAt());
    return String.fromCodePoint(...codePoints);
}

function getCountrySvgIcon(countryCode) {
    const icon = countriesData[countryCode];
    return icon || countriesData['NONE'] || '';
}

function formatLocationDisplay(image, includeFlag = true) {
    const parts = [];
    if (image.place) parts.push(image.place);
    if (image.town) parts.push(image.town);
    if (image.country) parts.push(image.country);
    const text = parts.join(', ');
    const flag = includeFlag ? countryCodeToFlag(image.country) : '';
    return flag ? `${flag} ${text}` : text;
}

function renderFilterGroup(elementId, items, filterType) {
    const container = document.getElementById(elementId);
    // compute counts for each filter item
    const counts = {};
    items.forEach(item => {
        let count = 0;
        if (filterType === 'categories') {
            count = galleryData.filter(img => img.category && img.category.includes(item)).length;
        } else if (filterType === 'countries') {
            count = galleryData.filter(img => img.country === item).length;
        } else if (filterType === 'towns') {
            count = galleryData.filter(img => img.town === item).length;
        } else if (filterType === 'places') {
            count = galleryData.filter(img => img.place === item).length;
        }
        counts[item] = count;
    });

    container.innerHTML = items
        .sort()
        .map(item => {
            const count = counts[item] || 0;
            if (filterType === 'countries') {
                const svgIcon = getCountrySvgIcon(item);
                return `
                    <button class="filter-tag" data-filter="${filterType}" data-value="${item}">
                        <span class="country-icon">${svgIcon}</span>
                        <span class="filter-label">${item}</span>
                        <span class="filter-count">${count}</span>
                    </button>
                `;
            }
            return `
                <button class="filter-tag" data-filter="${filterType}" data-value="${item}">
                    <span class="filter-label">${item}</span>
                    <span class="filter-count">${count}</span>
                </button>
            `;
        })
        .join('');

    container.querySelectorAll('.filter-tag').forEach(tag => {
        tag.addEventListener('click', () => toggleFilter(tag, filterType));
    });
}

function toggleFilter(element, filterType) {
    const value = element.dataset.value;
    const setRef = activeFilters[filterType];
    if (!setRef) return;
    if (setRef.has(value)) {
        setRef.delete(value);
        element.classList.remove('active');
    } else {
        setRef.add(value);
        element.classList.add('active');
    }
    displayGallery();
}

// ==================== Gallery Display ====================
function filterGallery() {
    filteredData = galleryData.filter(image => {
        // Check category filter (OR logic within categories)
        if (activeFilters.categories.size > 0) {
            if (!image.category || !image.category.some(cat => activeFilters.categories.has(cat))) {
                return false;
            }
        }

        // Check country/town/place filters (OR logic within each)
        if (activeFilters.countries.size > 0) {
            if (!image.country || !activeFilters.countries.has(image.country)) return false;
        }
        if (activeFilters.towns.size > 0) {
            if (!image.town || !activeFilters.towns.has(image.town)) return false;
        }
        if (activeFilters.places.size > 0) {
            if (!image.place || !activeFilters.places.has(image.place)) return false;
        }

        // Tags filter removed

        // Check search filter
        if (activeFilters.search) {
            const searchLower = activeFilters.search.toLowerCase();
            const matchesName = image.name.toLowerCase().includes(searchLower);
            const matchesLocation = image.location?.toLowerCase().includes(searchLower) ||
                image.town?.toLowerCase().includes(searchLower) ||
                image.place?.toLowerCase().includes(searchLower) ||
                (image.country && image.country.toLowerCase().includes(searchLower));
            if (!matchesName && !matchesLocation) {
                return false;
            }
        }

        return true;
    });
}

function displayGallery() {
    filterGallery();
    showLoadingMessage(false);

    if (filteredData.length === 0) {
        gallery.innerHTML = '';
        noResults.hidden = false;
        imageCount.textContent = '0';
        return;
    }

    noResults.hidden = true;
    imageCount.textContent = filteredData.length;

    gallery.innerHTML = filteredData
        .map((image, index) => {
            const countryIcon = getCountrySvgIcon(image.country);
            const locationParts = [];
            if (image.place) locationParts.push(image.place);
            if (image.town) locationParts.push(image.town);
            if (image.country) locationParts.push(image.country);
            const locationText = locationParts.join(', ');
            const locationLabel = (i18nData[currentLang] && i18nData[currentLang]['location.button']) || (currentLang === 'es' ? 'Ubicación' : 'Location');
            const locationButtonHtml = image.location ? `\n                        <a href="${image.location}" class="location-button" target="_blank" rel="noopener noreferrer" aria-label="${locationLabel}" title="${locationLabel}">\n                            <svg viewBox=\"0 0 24 24\" width=\"16\" height=\"16\" class=\"icon-location\">\n                                <path d=\"M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1112 6a2.5 2.5 0 010 5.5z\" fill=\"currentColor\"/>\n                            </svg>\n                            <span class=\"location-label\">${locationLabel}</span>\n                        </a>` : '';
            return `
            <div class="gallery-item" data-index="${index}" role="gridcell">
                <img 
                    src="${image.thumbnail}" 
                    alt="${image.name}" 
                    class="gallery-item-image"
                    loading="lazy"
                    width="${image.thumbWidth}"
                    height="${image.thumbHeight}"
                    srcset="${image.thumbnail} 300w, ${image.full} 800w"
                    sizes="(max-width: 480px) 150px, (max-width: 768px) 200px, 280px"
                >
                <div class="gallery-item-overlay">
                    <h3 class="gallery-item-title">${image.name}</h3>
                    <p class="gallery-item-location">
                        <span class="country-icon-small">${countryIcon}</span>
                        <span>${locationText}</span>
                        ${locationButtonHtml}
                    </p>
                    <div class="gallery-item-tags">
                        ${image.tags?.map(tag => `<span class="gallery-item-tag">${tag}</span>`).join('') || ''}
                    </div>
                </div>
            </div>
        `;
        })
        .join('');

    // Prevent location button clicks from bubbling and opening the lightbox
    gallery.querySelectorAll('.gallery-item .location-button').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            // allow anchor default navigation to occur (open in new tab)
        });
    });

    // Add click listeners to gallery items
    gallery.querySelectorAll('.gallery-item').forEach(item => {
        item.addEventListener('click', () => {
            currentLightboxIndex = parseInt(item.dataset.index);
            openLightbox();
        });
    });
}

// ==================== Lightbox ====================
function openLightbox() {
    const image = filteredData[currentLightboxIndex];
    lightboxImage.src = image.full;
    lightboxImage.alt = image.name;
    lightboxTitle.textContent = image.name;
    const countryIcon = getCountrySvgIcon(image.country);
    const locationParts = [];
    if (image.place) locationParts.push(image.place);
    if (image.town) locationParts.push(image.town);
    if (image.country) locationParts.push(image.country);
    const locationText = locationParts.join(', ');
    const locationLabel = (i18nData[currentLang] && i18nData[currentLang]['location.button']) || (currentLang === 'es' ? 'Ubicación' : 'Location');
    const lightboxLocationButton = image.location ? ` <a href="${image.location}" class="lightbox-location-button" target="_blank" rel="noopener noreferrer" aria-label="${locationLabel}" title="${locationLabel}"><svg viewBox=\"0 0 24 24\" width=\"16\" height=\"16\" class=\"icon-location\"><path d=\"M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1112 6a2.5 2.5 0 010 5.5z\" fill=\"currentColor\"/></svg> ${locationLabel}</a>` : '';
    lightboxLocation.innerHTML = `<span class="country-icon-small">${countryIcon}</span><span>${locationText}</span>${lightboxLocationButton}`;
    lightboxTags.innerHTML = image.tags
        ?.map(tag => `<span class="lightbox-tag">${tag}</span>`)
        .join('') || '';

    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    lightbox.hidden = true;
    document.body.style.overflow = '';
}

function nextImage() {
    currentLightboxIndex = (currentLightboxIndex + 1) % filteredData.length;
    openLightbox();
}

function prevImage() {
    currentLightboxIndex = (currentLightboxIndex - 1 + filteredData.length) % filteredData.length;
    openLightbox();
}

// ==================== Event Listeners ====================
function setupEventListeners() {
    // Theme toggle
    themeToggle.addEventListener('click', toggleTheme);

    // Filter dialog toggle
    filterToggle.addEventListener('click', openFilterDialog);
    filterDialogClose.addEventListener('click', closeFilterDialog);
    filterDialog.addEventListener('click', (e) => {
        if (e.target === filterDialog || e.target.classList.contains('filter-dialog-backdrop')) {
            closeFilterDialog();
        }
    });

    // Clear filters
    clearFiltersBtn.addEventListener('click', () => {
        activeFilters.categories.clear();
        activeFilters.countries.clear();
        activeFilters.towns.clear();
        activeFilters.places.clear();
        activeFilters.search = '';
        searchInput.value = '';

        document.querySelectorAll('.filter-tag').forEach(tag => {
            tag.classList.remove('active');
        });

        displayGallery();
    });

    // Search
    searchInput.addEventListener('input', (e) => {
        activeFilters.search = e.target.value;
        displayGallery();
    });

    // Lightbox events
    lightboxClose.addEventListener('click', closeLightbox);
    lightboxPrev.addEventListener('click', prevImage);
    lightboxNext.addEventListener('click', nextImage);

    // Close lightbox when clicking backdrop
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox || e.target.classList.contains('lightbox-backdrop')) {
            closeLightbox();
        }
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox.hidden) {
            if (e.key === 'ArrowLeft') prevImage();
            if (e.key === 'ArrowRight') nextImage();
            if (e.key === 'Escape') closeLightbox();
        }
        if (!filterDialog.hidden) {
            if (e.key === 'Escape') closeFilterDialog();
        }
    });

    // Handle filter section visibility on resize
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            closeFilterDialog();
        }
    });

    // Scroll-to-top button visibility + click
    if (scrollTopBtn) {
        const checkVisible = () => {
            if (window.scrollY > (window.innerHeight || 600) * 0.5) {
                scrollTopBtn.classList.add('visible');
            } else {
                scrollTopBtn.classList.remove('visible');
            }
        };
        window.addEventListener('scroll', checkVisible, { passive: true });
        scrollTopBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
        // initial state
        checkVisible();
    }
}

// ==================== Filter Dialog ====================
function openFilterDialog() {
    filterDialog.hidden = false;
    document.body.style.overflow = 'hidden';
}

function closeFilterDialog() {
    filterDialog.hidden = true;
    document.body.style.overflow = '';
}

// ==================== Utility Functions ====================
function showLoadingMessage(show) {
    loadingMessage.hidden = !show;
}

// ==================== Performance: Preload images ====================
function preloadImage(src) {
    const img = new Image();
    img.src = src;
}

// Preload next/prev images in lightbox
const observerOptions = {
    root: null,
    rootMargin: '50px',
    threshold: 0.1
};

const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
                img.src = img.dataset.src;
                delete img.dataset.src;
                imageObserver.unobserve(img);
            }
        }
    });
}, observerOptions);

// ==================== Accessibility ====================
// Add keyboard navigation hints
document.addEventListener('keydown', (e) => {
    if (e.key === '?') {
        console.log('Keyboard shortcuts: ArrowLeft/Right - Navigate images, Escape - Close lightbox');
    }
});
