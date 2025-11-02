# Changelog

All notable changes to this project will be documented in this file.

## [2.0.0] - 2025-11-01

### ✨ Added

- **Keyboard Shortcuts**:

  - `Ctrl+K` - فتح البحث السريع
  - `Ctrl+D` - تبديل الوضع المظلم
  - `Ctrl+H` - العودة للرئيسية
  - `Ctrl+/` - عرض الاختصارات
  - `Escape` - إغلاق النوافذ

- **Recent Links System**: تتبع آخر 10 روابط تم فتحها
- **Export/Import Favorites**:

  - تصدير المفضلة كـ JSON
  - تصدير المفضلة كـ CSV
  - استيراد المفضلة من ملف JSON

- **Empty States**: رسائل واضحة عند عدم وجود نتائج بحث
- **Service Worker**: دعم PWA كامل مع Offline Mode
- **SEO Enhancements**:
  - Structured Data (Schema.org)
  - Enhanced Meta Tags
  - Sitemap.xml
  - Robots.txt

### 🔒 Security

- Content Security Policy (CSP) Headers
- Enhanced XSS Protection
- Permissions Policy
- Secure CORS Headers

### 🎨 UI/UX

- Keyboard shortcuts hint
- Loading skeletons
- Better animations
- Improved tooltips
- Quick actions panel

### 📦 Infrastructure

- Netlify configuration optimized
- Enhanced caching strategy
- Better error handling
- Improved logging

### 🐛 Bug Fixes

- Fixed router icon URL (changed to http)
- Fixed missing local icons
- Improved card data handling

---

## [1.0.0] - 2024-10-29

### Initial Release

- Clean Architecture with ES6 Modules
- Dark/Light theme support
- Favorites system with multi-tab sync
- Smart search and filtering
- Responsive design
- PWA support
- 28 curated links across 5 categories
