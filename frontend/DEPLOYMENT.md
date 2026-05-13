# 🚀 راهنمای دیپلوی پروژه راوی

این راهنما مراحل دیپلوی پروژه راوی را بر روی پلتفرم‌های مختلف توضیح می‌دهد.

## 📋 فهرست مطالب

1. [Vercel (توصیه می‌شود)](#vercel)
2. [GitHub Pages](#github-pages)
3. [Netlify](#netlify)
4. [سرور شخصی](#custom-server)

---

## 1️⃣ Vercel (توصیه می‌شود)

Vercel بهترین گزینه برای دیپلوی پروژه‌های Next.js است.

### مراحل:

1. **اتصال به Git**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/raavi-platform.git
   git push -u origin main
   ```

2. **دیپلوی در Vercel**
   - به [vercel.com](https://vercel.com) بروید
   - روی "Import Project" کلیک کنید
   - مخزن GitHub خود را انتخاب کنید
   - Vercel به صورت خودکار تنظیمات را تشخیص می‌دهد
   - روی "Deploy" کلیک کنید

3. **تنظیمات محیط (اختیاری)**
   اگر متغیرهای محیطی دارید، در بخش Environment Variables اضافه کنید.

### با استفاده از CLI:

\`\`\`bash
npm i -g vercel
vercel login
vercel
\`\`\`

---

## 2️⃣ GitHub Pages

برای دیپلوی استاتیک روی GitHub Pages:

### مراحل:

1. **فعال‌سازی Export Mode**
   
   در فایل `next.config.js`:
   \`\`\`javascript
   /** @type {import('next').NextConfig} */
   const nextConfig = {
     output: 'export',
     basePath: '/raavi-platform', // نام مخزن خود را بگذارید
     images: {
       unoptimized: true,
     },
   }

   module.exports = nextConfig
   \`\`\`

2. **بیلد گرفتن**
   \`\`\`bash
   npm run build
   \`\`\`

3. **دیپلوی**
   
   دو روش:

   **روش الف: استفاده از gh-pages**
   \`\`\`bash
   npm install --save-dev gh-pages
   \`\`\`

   در `package.json` اضافه کنید:
   \`\`\`json
   "scripts": {
     "deploy": "next build && touch out/.nojekyll && gh-pages -d out -t true"
   }
   \`\`\`

   سپس:
   \`\`\`bash
   npm run deploy
   \`\`\`

   **روش ب: GitHub Actions**
   
   فایل `.github/workflows/deploy.yml` بسازید:
   \`\`\`yaml
   name: Deploy to GitHub Pages

   on:
     push:
       branches: [ main ]

   jobs:
     build-and-deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v3
         
         - name: Setup Node.js
           uses: actions/setup-node@v3
           with:
             node-version: '18'
             
         - name: Install dependencies
           run: npm ci
           
         - name: Build
           run: npm run build
           
         - name: Deploy
           uses: JamesIves/github-pages-deploy-action@v4
           with:
             folder: out
             branch: gh-pages
   \`\`\`

4. **فعال‌سازی GitHub Pages**
   - به Settings > Pages بروید
   - Source را روی `gh-pages` branch تنظیم کنید

سایت شما در `https://YOUR_USERNAME.github.io/raavi-platform` در دسترس خواهد بود.

---

## 3️⃣ Netlify

### مراحل:

1. **Push کردن به Git**
   \`\`\`bash
   git push origin main
   \`\`\`

2. **اتصال در Netlify**
   - به [netlify.com](https://netlify.com) بروید
   - "New site from Git" را انتخاب کنید
   - مخزن خود را انتخاب کنید

3. **تنظیمات Build**
   - Build command: `npm run build`
   - Publish directory: `.next`

4. **دیپلوی**
   روی "Deploy site" کلیک کنید

### با استفاده از CLI:

\`\`\`bash
npm install -g netlify-cli
netlify login
netlify init
netlify deploy --prod
\`\`\`

---

## 4️⃣ سرور شخصی

برای دیپلوی روی سرور VPS:

### پیش‌نیازها:
- Node.js 18+
- PM2 (برای مدیریت پروسس)
- Nginx (برای Reverse Proxy)

### مراحل:

1. **نصب PM2**
   \`\`\`bash
   npm install -g pm2
   \`\`\`

2. **آپلود کدها**
   \`\`\`bash
   # در سرور
   git clone https://github.com/YOUR_USERNAME/raavi-platform.git
   cd raavi-platform
   npm install
   npm run build
   \`\`\`

3. **اجرا با PM2**
   \`\`\`bash
   pm2 start npm --name "raavi" -- start
   pm2 save
   pm2 startup
   \`\`\`

4. **تنظیم Nginx**
   
   فایل `/etc/nginx/sites-available/raavi`:
   \`\`\`nginx
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   \`\`\`

   فعال‌سازی:
   \`\`\`bash
   sudo ln -s /etc/nginx/sites-available/raavi /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl reload nginx
   \`\`\`

5. **SSL با Let's Encrypt**
   \`\`\`bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d your-domain.com
   \`\`\`

---

## 🔧 نکات مهم

### 1. متغیرهای محیطی

اگر از متغیرهای محیطی استفاده می‌کنید، حتماً آن‌ها را در پلتفرم دیپلوی خود تنظیم کنید.

### 2. حفظ State

از آنجایی که از `localStorage` استفاده می‌کنیم، اطلاعات کاربر در مرورگر ذخیره می‌شود و نیازی به دیتابیس ندارد.

### 3. تصاویر

تمام تصاویر از Unsplash لود می‌شوند. اگر می‌خواهید تصاویر محلی استفاده کنید، آن‌ها را در پوشه `public` قرار دهید.

### 4. فونت فارسی

فونت Vazirmatn از CDN لود می‌شود. اگر می‌خواهید آن را به صورت محلی استفاده کنید:

\`\`\`bash
# دانلود فونت
wget https://github.com/rastikerdar/vazirmatn/releases/download/v33.003/Vazirmatn-font-v33.003.zip
unzip Vazirmatn-font-v33.003.zip -d public/fonts/vazirmatn
\`\`\`

سپس در `globals.css` مسیر را تغییر دهید.

---

## 📊 مانیتورینگ

### Vercel Analytics
اگر روی Vercel دیپلوی کرده‌اید، می‌توانید Analytics را فعال کنید:

\`\`\`bash
npm install @vercel/analytics
\`\`\`

در `app/layout.tsx`:
\`\`\`typescript
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout() {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
\`\`\`

---

## 🐛 رفع مشکلات رایج

### مشکل: صفحه 404 در رفرش

**راه‌حل برای GitHub Pages:**
یک فایل `404.html` در `public` بسازید که به `index.html` ریدایرکت کند.

**راه‌حل برای Nginx:**
در تنظیمات nginx اضافه کنید:
\`\`\`nginx
try_files $uri $uri/ /index.html;
\`\`\`

### مشکل: تصاویر لود نمی‌شوند

در `next.config.js` دامنه‌های مورد نیاز را اضافه کنید:
\`\`\`javascript
images: {
  domains: ['images.unsplash.com', 'media.wired.com'],
}
\`\`\`

### مشکل: فونت فارسی نمایش داده نمی‌شود

مطمئن شوید که در `globals.css` فونت Vazirmatn به درستی import شده است.

---

## 📞 پشتیبانی

اگر مشکلی در دیپلوی داشتید:
- Issue در GitHub باز کنید
- به docs.raavi.ir مراجعه کنید
- با تیم پشتیبانی تماس بگیرید: support@raavi.ir

---

موفق باشید! 🚀
\`\`\`
