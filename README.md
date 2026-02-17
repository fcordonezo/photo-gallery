# Photography Portfolio

A professional, responsive photography portfolio web application built with vanilla HTML, CSS, and JavaScript. Perfect for photographers to showcase their work with elegant galleries, advanced filtering, and a beautiful lightbox viewer.

## Features

### 🎨 Design
- **Professional Layout**: Clean, modern design optimized for photography
- **Dark/Light Mode**: Theme toggle with localStorage persistence
- **Fully Responsive**: Works perfectly on desktop, tablet, and mobile devices
- **Smooth Animations**: Elegant transitions and hover effects
- **Accessibility**: WCAG compliant with semantic HTML and ARIA labels

### 📸 Gallery Features
- **Multi-aspect Ratio Support**: Handles images of any aspect ratio gracefully
- **Lazy Loading**: Images load on demand for better performance
- **Lightbox Viewer**: Beautiful image viewer with:
  - Full-size image display
  - Previous/Next navigation (arrow buttons and keyboard)
  - Image metadata display (title, location, tags)
  - ESC key to close
- **Image Optimization**: Thumbnail and full-size versions with responsive srcsets

### 🔍 Filtering & Search
- **Multi-Select Filtering**: Filter by:
  - Categories
  - Locations (country / town / place)
  - Categories
  - Places
- **Smart Search**: Search by image name or location
- **Active Filters Display**: Visual feedback for active filters
- **Clear All Filters**: Quick reset button
 - **Per-filter counts**: Each filter shows the number of images it contains

### ⚡ Performance
- Lazy loading images with Intersection Observer API
- Responsive images with srcset and sizes attributes
- Efficient JSON data structure
- Minimal JavaScript footprint
- No external dependencies (vanilla JS)

### 📱 SEO & Meta Tags
- Semantic HTML5 structure
- Open Graph meta tags for social sharing
- Descriptive meta descriptions
- Proper heading hierarchy
- Image alt text

### 🎯 Additional Features
- **Image Counter**: Live count of filtered images
- **Keyboard Navigation**: 
  - Arrow keys to navigate in lightbox
  - ESC to close lightbox
- **Mobile Filter Toggle**: Compact filter menu for smaller screens
- **Smooth Scrolling**: Native CSS scroll behavior
- **Custom Scrollbar**: Styled scrollbar (Webkit browsers)
 - **Location links**: Each image may include a `location` URL (Google Maps link) — a `Location / Ubicación` button appears in hover preview and lightbox and opens the map in a new tab.
 - **Theme toggle icons**: Improved sun SVG and inverted behavior (moon shown in light mode, sun shown in dark mode).
 - **Scroll-to-top button**: Sticky button at bottom-right that appears when scrolling and smoothly returns to the top.

## Project Structure

```
gallery/
├── index.html           # Main HTML structure
├── styles.css           # All styling (light/dark mode included)
├── script.js            # JavaScript functionality
├── gallery-data.json    # Gallery images data
├── taxonomies.json      # Generated map of categories & tags -> image IDs
└── README.md            # This file
```

## Gallery Data Structure

The `gallery-data.json` file contains image objects with the following fields:

```json
{
  "id": 1,
  "name": "Image Title",
  "location": "Location, Country",
  "category": ["Category1", "Category2"],
  "tags": ["Tag1", "Tag2"],
  "description": "Image description",
  "date": "YYYY-MM-DD",
  "full": "URL to full-size image",
  "thumbnail": "URL to thumbnail image",
  "thumbWidth": 300,
  "thumbHeight": 200
}
```

## How to Use

### 1. Add Your Images

Edit `gallery-data.json` to add your images:

```json
{
  "id": 1,
  "name": "Your Photo Title",
  "location": "City, Country",
  "category": ["Landscapes", "Hobby"],
  "tags": ["Mountain", "Sunset", "Color"],
  "description": "Your photo description",
  "date": "2026-02-12",
  "full": "path/to/full-image.jpg",
  "thumbnail": "path/to/thumbnail.jpg",
  "thumbWidth": 300,
  "thumbHeight": 200
}
```

### 2. Update Header Information

Edit `index.html` to customize:
- Your name and bio
- Subtitle
- Social media links
- Avatar image

### 3. Add Your Images

Host your images and update the URLs in `gallery-data.json`. For best performance:
- Full images: ~800-1200px width
- Thumbnails: ~300px width
- Use optimized formats (WebP with JPEG fallback)

## Deploy to GitHub Pages

### 1. Create a GitHub Repository
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/your-repo.git
git branch -M main
git push -u origin main
```

### 2. Enable GitHub Pages
1. Go to your repository settings
2. Navigate to "Pages" section
3. Select "Deploy from a branch"
4. Choose `main` branch and `/root` folder
5. Save

Your site will be available at: `https://yourusername.github.io/your-repo/`

## Performance Tips

### Image Optimization
- Compress images before uploading (use tools like TinyPNG, ImageOptim)
- Use WebP format with JPEG fallback
- Keep thumbnails under 100KB
- Keep full images under 500KB

### Example Image Sizes
- **Thumbnail**: 300x200px @ 30-50KB
- **Full**: 1200x800px @ 150-300KB

### Recommended Tools
- ImageOptim (macOS)
- FileOptimizer (Windows)
- TinyPNG (online)
- ImageMagick (command line)

## Customization Guide

### Colors & Theme
Edit CSS variables in `styles.css`:

```css
:root {
    --bg-primary: #ffffff;
    --text-primary: #1a1a1a;
    --accent-color: #333333;
    /* ... more variables ... */
}
```

### Fonts
Currently uses Google Fonts:
- Playfair Display (headings)
- Poppins (body)

To change, update the `@import` in the `<head>` of `index.html`.

### Grid Layout
Adjust gallery grid in CSS:

```css
.gallery-grid {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
}
```

Change `280px` to your preferred minimum column width.

## Browser Support

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support
- Mobile browsers: Full support

## Accessibility

- Semantic HTML5 elements
- ARIA labels and roles
- Keyboard navigation support
- High contrast color ratios
- Reduced motion support
- Focus management in modals

## License

Free to use and modify for your portfolio.

## Support & Troubleshooting

### Images not loading?
- Check image URLs in `gallery-data.json`
- Ensure CORS is enabled on image hosting
- Check browser console for errors (F12)

### Filters not working?
- Verify filter values match exactly in `gallery-data.json`
- Check browser console for JavaScript errors
- Clear localStorage: `localStorage.clear()`

### Performance issues?
- Compress images further
- Reduce number of images on initial load
- Use a CDN for image hosting
- Enable gzip compression on server

## Future Enhancements

Consider adding:
- Image descriptions modal
- Photo metadata (camera, settings)
- Download functionality
- Social sharing buttons
- Comments/feedback system
- Admin panel for easy updates

---

Built with ❤️ for photographers. Happy shooting! 📸
