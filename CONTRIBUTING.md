# دليل المساهمة | Contributing Guide

شكراً لاهتمامك بالمساهمة في المشروع! 🎉

## 📋 معايير الكود

### 1. JavaScript

#### استخدم ES6+ Modules

```javascript
// ✅ صحيح
import { functionName } from "./module.js";
export function myFunction() {}

// ❌ خطأ
const module = require("./module");
module.exports = {};
```

#### استخدم const/let بدلاً من var

```javascript
// ✅ صحيح
const API_KEY = "xxx";
let counter = 0;

// ❌ خطأ
var API_KEY = "xxx";
```

#### استخدم Arrow Functions

```javascript
// ✅ صحيح
const double = (x) => x * 2;
array.map((item) => item.id);

// ❌ خطأ (إلا للضرورة)
function double(x) {
  return x * 2;
}
```

#### استخدم Template Literals

```javascript
// ✅ صحيح
const message = `Hello ${name}!`;

// ❌ خطأ
const message = "Hello " + name + "!";
```

### 2. التسمية

#### Variables & Functions: camelCase

```javascript
const userName = "Islam";
function getUserData() {}
```

#### Constants: UPPER_SNAKE_CASE

```javascript
const API_URL = "https://api.example.com";
const MAX_RETRIES = 3;
```

#### Classes: PascalCase

```javascript
class UserManager {}
```

### 3. التعليقات

#### استخدم JSDoc للدوال

```javascript
/**
 * Calculate sum of two numbers
 * @param {number} a - First number
 * @param {number} b - Second number
 * @returns {number} - Sum result
 */
function sum(a, b) {
  return a + b;
}
```

#### تعليقات واضحة بالعربية والإنجليزية

```javascript
// Initialize theme system
// تهيئة نظام الثيم
function initializeTheme() {}
```

### 4. هيكل الملفات

#### كل module في ملف منفصل

```
js/
├── config.js          # Configuration
├── constants.js       # Constants
├── main.js           # Entry point
└── modules/
    ├── cards.js      # Cards logic
    ├── favorites.js  # Favorites logic
    └── utils.js      # Utilities
```

#### استورد من الثوابت

```javascript
// ✅ صحيح
import { SELECTORS } from "../constants.js";
const btn = document.querySelector(SELECTORS.THEME_TOGGLE);

// ❌ خطأ
const btn = document.getElementById("themeToggle");
```

### 5. Error Handling

#### استخدم try-catch

```javascript
// ✅ صحيح
try {
  const data = JSON.parse(stored);
  return data;
} catch (error) {
  return defaultValue;
}

// ❌ خطأ
const data = JSON.parse(stored); // قد يفشل
```

#### تحقق من null/undefined

```javascript
// ✅ صحيح
if (!element) return;
const value = element?.getAttribute("data-id");

// ❌ خطأ
element.getAttribute("data-id"); // قد يكون null
```

### 6. Performance

#### استخدم Event Delegation

```javascript
// ✅ صحيح
container.addEventListener("click", (e) => {
  if (e.target.matches(".card")) {
    handleCardClick(e.target);
  }
});

// ❌ خطأ
cards.forEach((card) => {
  card.addEventListener("click", handleCardClick);
});
```

#### استخدم Debounce للبحث

```javascript
// ✅ صحيح
searchInput.addEventListener("input", debounce(handleSearch, 300));

// ❌ خطأ
searchInput.addEventListener("input", handleSearch);
```

## 🔄 عملية المساهمة

### 1. Fork المشروع

```bash
git clone https://github.com/your-username/modern-links-hub.git
cd modern-links-hub
```

### 2. إنشاء branch جديد

```bash
git checkout -b feature/amazing-feature
```

### 3. التعديلات

- اتبع معايير الكود أعلاه
- اختبر التعديلات محلياً
- تأكد من عدم وجود أخطاء في Console

### 4. Commit

```bash
git add .
git commit -m "Add: amazing feature"
```

استخدم prefixes واضحة:

- `Add:` - ميزة جديدة
- `Fix:` - إصلاح bug
- `Update:` - تحديث موجود
- `Remove:` - حذف
- `Refactor:` - إعادة هيكلة

### 5. Push & Pull Request

```bash
git push origin feature/amazing-feature
```

ثم افتح Pull Request على GitHub

## ✅ Checklist قبل PR

- [ ] الكود يتبع معايير المشروع
- [ ] لا توجد أخطاء في Console
- [ ] تم اختبار الميزة على Chrome, Firefox, Safari
- [ ] تم اختبار على Mobile
- [ ] الكود مُعلّق بشكل واضح
- [ ] لا يوجد console.log غير ضروري
- [ ] تم تحديث README إذا لزم الأمر

## 🐛 الإبلاغ عن Bugs

عند الإبلاغ عن bug، يرجى تضمين:

1. **الوصف**: ماذا حدث؟
2. **الخطوات**: كيف نعيد إنتاج المشكلة؟
3. **المتوقع**: ماذا كان يجب أن يحدث؟
4. **البيئة**: المتصفح، نظام التشغيل
5. **Screenshots**: إن أمكن

## 💡 اقتراح ميزات

نرحب بالأفكار الجديدة! افتح Issue واشرح:

1. **المشكلة**: ما المشكلة التي تحلها؟
2. **الحل المقترح**: كيف تريد حلها؟
3. **البدائل**: هل فكرت في حلول أخرى؟

## 📞 التواصل

إذا كان لديك أسئلة، لا تتردد في فتح Issue!

---

شكراً لمساهمتك! 🙏
