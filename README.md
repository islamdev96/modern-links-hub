# Islam Glab | Personal Link Hub

بوابة شخصية احترافية للوصول السريع إلى أهم المواقع والأدوات الرقمية مع نظام بحث وتصفية ومفضلة متقدم.

## ✨ المميزات

- 🎨 **تصميم عصري**: واجهة نظيفة وسهلة الاستخدام
- 🌓 **الوضع الداكن**: دعم كامل للوضع المظلم والمضيء
- ⭐ **نظام المفضلة**: حفظ الروابط المفضلة مع مزامنة متعددة التبويبات
- 🔍 **بحث ذكي**: بحث فوري في العناوين والأوصاف
- 🏷️ **تصفية متقدمة**: تصنيف الروابط حسب الفئات
- 📱 **تصميم متجاوب**: يعمل بشكل مثالي على جميع الأجهزة
- ⚡ **أداء عالي**: تحميل سريع مع lazy loading للصور
- 🔒 **آمن**: لا توجد تتبعات أو إعلانات

## 📁 هيكل المشروع

```
modern-links-hub/
├── public/
│   ├── css/                    # ملفات CSS منظمة
│   │   ├── variables.css       # المتغيرات والثيمات
│   │   ├── base.css           # الأنماط الأساسية
│   │   ├── layout.css         # التخطيط والشبكة
│   │   ├── components.css     # مكونات UI
│   │   └── responsive.css     # Media queries
│   │
│   ├── js/                     # JavaScript modules
│   │   ├── config.js          # إعدادات التطبيق
│   │   ├── constants.js       # الثوابت
│   │   ├── main.js            # نقطة الدخول
│   │   └── modules/           # وحدات منفصلة
│   │       ├── cards.js       # إدارة البطاقات
│   │       ├── favorites.js   # نظام المفضلة
│   │       ├── search.js      # البحث والتصفية
│   │       ├── theme.js       # إدارة الثيم
│   │       └── utils.js       # دوال مساعدة
│   │
│   ├── icons/                  # أيقونات محلية
│   ├── index.html             # الصفحة الرئيسية
│   ├── manifest.json          # PWA manifest
│   └── sw.js                  # Service Worker
│
├── server.js                   # خادم Node.js بسيط
├── package.json
└── README.md

```

## 🚀 التشغيل

### المتطلبات

- Node.js 22.x أو أحدث

### التثبيت والتشغيل

```bash
# تشغيل السيرفر
node server.js

# أو باستخدام npm
npm start
```

افتح المتصفح على: `http://localhost:3000`

## 🏗️ البنية المعمارية

### معايير Clean Code المطبقة

✅ **Single Responsibility Principle**

- كل ملف ووحدة لها مسؤولية واحدة فقط

✅ **DRY (Don't Repeat Yourself)**

- صفر تكرار في الكود
- دوال مشتركة في `utils.js`

✅ **Separation of Concerns**

- HTML/CSS/JS منفصلين تماماً
- كل وظيفة في module منفصل

✅ **Modularity**

- ES6 Modules للتنظيم
- سهولة إعادة الاستخدام

✅ **Maintainability**

- كود واضح ومفهوم
- تعليقات مفيدة
- أسماء متغيرات واضحة

✅ **Scalability**

- سهل إضافة ميزات جديدة
- بنية قابلة للتوسع

## 🎯 الوحدات (Modules)

### config.js

إعدادات التطبيق المركزية:

- مفاتيح التخزين
- القيم الافتراضية
- إعدادات الحركات
- Feature flags

### constants.js

الثوابت المستخدمة في التطبيق:

- أنواع Toast
- قيم الثيمات
- الفئات
- Selectors

### modules/cards.js

إدارة البطاقات:

- تهيئة البطاقات
- Event delegation
- التصفية والبحث
- الحركات

### modules/favorites.js

نظام المفضلة:

- إضافة/إزالة المفضلة
- حفظ في localStorage
- مزامنة متعددة التبويبات
- عرض المفضلة

### modules/search.js

البحث والتصفية:

- بحث فوري مع debounce
- تصفية حسب الفئات
- تحديث العدادات

### modules/theme.js

إدارة الثيم:

- تبديل الوضع الداكن/المضيء
- حفظ التفضيلات
- اكتشاف ثيم النظام

### modules/utils.js

دوال مساعدة مشتركة:

- فتح الروابط بأمان
- Toast notifications
- localStorage آمن
- Debounce
- وظائف أخرى

## 🎨 التخصيص

### إضافة رابط جديد

أضف البطاقة في `index.html`:

```html
<div
  class="card"
  data-category="tools"
  data-url="https://example.com"
  data-title="اسم الموقع"
  data-description="وصف الموقع"
>
  <button class="favorite-btn" title="إضافة للمفضلة">
    <i class="fas fa-star"></i>
  </button>
  <a href="https://example.com" target="_blank">
    <img
      src="icon-url.png"
      alt="اسم الموقع"
      class="icon-image"
      loading="lazy"
    />
    <span class="title">اسم الموقع</span>
    <span class="description">وصف الموقع</span>
  </a>
</div>
```

### تعديل الألوان

عدّل المتغيرات في `css/variables.css`:

```css
:root {
  --primary-color: #4a90e2;
  --hover-color: #357abd;
  /* ... */
}
```

## 📊 الأداء

- ⚡ First Contentful Paint: < 1s
- 🎯 Time to Interactive: < 2s
- 📦 Total Bundle Size: < 100KB
- 🖼️ Lazy Loading للصور
- 💾 Service Worker للتخزين المؤقت

## 🔒 الأمان

- ✅ Content Security Policy
- ✅ XSS Protection
- ✅ HTTPS Only
- ✅ No external tracking
- ✅ Secure localStorage handling

## 📱 PWA Support

التطبيق يدعم Progressive Web App:

- تثبيت على الشاشة الرئيسية
- العمل بدون إنترنت (Service Worker)
- تحديثات تلقائية

## 🌐 المتصفحات المدعومة

- ✅ Chrome 61+
- ✅ Firefox 60+
- ✅ Safari 11+
- ✅ Edge 16+

## 📝 الترخيص

MIT License - مفتوح المصدر

## 👨‍💻 المطور

**Islam Glab**

---

**ملاحظة**: هذا المشروع يتبع أفضل ممارسات Clean Code والمعايير الدولية لكتابة الكود.
