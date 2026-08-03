# Setup Guide — AI Generator Apps for Teachers

Sundin ang mga steps na ito para gumana ang login, sign up, at admin approval
gamit ang **Firebase** (libre, walang kailangang credit card).

## 1. Gumawa ng Firebase project

1. Pumunta sa https://console.firebase.google.com
2. Click **Add project** → pangalanan (hal. `ai-teacher-tools`) → sundan ang steps → **Create project**.

## 2. I-register ang Web App

1. Sa loob ng project, click ang **Web icon (`</>`)** sa "Get started by adding Firebase to your app".
2. Pangalanan ang app (hal. `Teacher Dashboard`) → **Register app**.
3. Kokopyahin ka ng code na may `firebaseConfig = { apiKey: ..., authDomain: ..., ... }`.
4. Buksan ang file na **`js/firebase-config.js`** sa project na ito, at palitan ang mga
   placeholder value (`PASTE_YOUR_...`) ng mga tunay na value mula sa Firebase.

## 3. I-enable ang Email/Password Login

1. Sa Firebase console, punta sa **Build → Authentication → Get started**.
2. Sa tab na **Sign-in method**, i-click ang **Email/Password** → i-enable → **Save**.

## 4. Gumawa ng Firestore Database

1. Punta sa **Build → Firestore Database → Create database**.
2. Piliin ang **Start in production mode** → piliin ang region na malapit sa Pilipinas
   (hal. `asia-southeast1`) → **Enable**.
3. Punta sa tab na **Rules**, i-delete ang laman, at i-paste ang buong laman ng
   file na **`firestore.rules`** (kasama sa project na ito) → **Publish**.

## 5. I-set ang Admin Email

1. Buksan ang **`js/firebase-config.js`**, hanapin ang `ADMIN_EMAILS` array,
   at ilagay doon ang email na gagamitin mo bilang admin
   (halimbawa ay naka-set na sa `leopoldo.mago@deped.gov.ph`).
2. Buksan din ang **`firestore.rules`**, hanapin ang function na `isAdmin()`,
   at siguraduhin parehong email ang nakalagay doon (kailangan magkatugma
   ang laman ng dalawang file na ito).
3. Kapag nag-sign up ka gamit ang admin email na iyon, awtomatikong "approved"
   at "admin" agad ang account mo — hindi na kailangan hintayin ang approval.

## 6. I-deploy (para may sarili kang link)

Ang project na ito ay **static site lang** (HTML/CSS/JS, walang backend server),
kaya gagana ito sa kahit saan mo i-host — Firebase Hosting, o GitHub +
Vercel/Netlify. Ang Firebase (Auth + Firestore) ay hiwalay na "backend
service" — gagana pa rin ito kahit saan naka-host ang frontend, basta
sundin lang ang "Authorized Domains" step sa ibaba.

### Option A — Firebase Hosting (pinakasimple, iisang platform lang)

1. I-install ang Firebase CLI sa iyong computer (isang beses lang):
   ```
   npm install -g firebase-tools
   ```
2. Mag-login:
   ```
   firebase login
   ```
3. Sa loob ng folder ng project na ito:
   ```
   firebase init hosting
   ```
   - Piliin ang project na ginawa mo sa Step 1.
   - Public directory: itype ang `.` (kasalukuyang folder)
   - Single-page app: **No**
   - Overwrite index.html: **No**
4. I-deploy:
   ```
   firebase deploy
   ```
5. Bibigyan ka ng link (hal. `https://ai-teacher-tools.web.app`).
   Awtomatiko nang naka-authorize ang domain na ito, walang extra step.

### Option B — GitHub + Vercel o Netlify (gagana rin, at pwede mong gamitin)

Ito rin ay tamang paraan — karaniwan pa nga itong ginagamit dahil may
auto-deploy every time may bagong push sa GitHub.

1. **I-push ang buong folder ng project (lahat ng files dito) sa isang
   GitHub repo** (public o private, pareho lang, walang server-side code
   naman dito).
2. **Sa Vercel:**
   - New Project → Import ang GitHub repo mo.
   - Framework Preset: piliin ang **"Other"** (walang build step / static).
   - Build Command: iwanang blangko.
   - Output Directory: `.` (o iwanan sa default) — dahil nasa root na
     ang `index.html`.
   - Deploy. Bibigyan ka ng link na `https://your-app.vercel.app`.
3. **Sa Netlify (kapalit ng Vercel):**
   - Add new site → Import an existing project → piliin ang GitHub repo.
   - Build command: iwanang blangko.
   - Publish directory: `.`
   - Deploy. Bibigyan ka ng link na `https://your-app.netlify.app`.
4. **MAHALAGA — idagdag ang bagong domain sa Firebase:**
   - Firebase console → **Build → Authentication → Settings** tab →
     scroll sa **Authorized domains** → **Add domain**.
   - Ilagay ang domain na binigay ng Vercel/Netlify (hal.
     `your-app.vercel.app`), tapos **Add**.
   - Kung hindi mo ito gagawin, magkaka-error na
     `auth/unauthorized-domain` pag nag-login/sign-up ang mga teacher.
5. Firebase config (`js/firebase-config.js`) ay pareho lang — hindi ito
   nagbabago kahit saan mo i-deploy ang frontend, dahil ang totoong
   database/authentication ay nasa Firebase pa rin.

> Tip: kung gagamit ka ng Option B, hindi mo na kailangan gawin ang
> `firebase init hosting` — Firebase project mo lang ang kailangan para
> sa Authentication at Firestore, hindi na para sa hosting.

> Alternative kung ayaw pa munang mag-deploy: puwede ring buksan lang ang
> `index.html` gamit ang isang simpleng local server (hal. VS Code
> "Live Server" extension), pero hindi gagana ang mga direktang pag-open
> ng file (`file://...`) dahil kailangan ng Firebase ng `http://` o
> `https://` address.

## 7. Pag-connect ng iyong sariling Lesson Plan / Quiz Generator

Meron ka nang gawang HTML para sa Lesson Plan Generator at Quiz Generator.
Dalawang paraan para i-link ang mga ito:

**Option A — Palitan ang placeholder file (recommended kung parehong static HTML):**
- I-save ang iyong Lesson Plan Generator file bilang
  `tools/lesson-plan-generator.html` (papalitan ang placeholder).
- I-save ang iyong Quiz Generator file bilang
  `tools/quiz-generator.html` (papalitan ang placeholder).
- Awtomatikong gagana ang mga link sa sidebar at sa dashboard cards.

**Option B — I-link papunta sa ibang naka-host na tool:**
- Buksan ang `tools/lesson-plan-generator.html` (o quiz-generator.html)
  at hanapin ang `<div class="card-panel">` placeholder — palitan ito ng:
  ```html
  <iframe src="https://your-tool-url" style="width:100%;height:80vh;border:0;border-radius:12px;"></iframe>
  ```

## 8. Pagbabago ng GCash QR code / bayad sa pending page

Ang `pending.html` (yung "Nakabinbin ang iyong account" na screen pagkatapos
mag-sign up) ay may kasamang GCash QR code at upload button para sa resibo
ng pagbayad, bago ma-approve ng admin ang isang teacher.

- **Palitan ang QR code:** i-save lang ang bago mong GCash/InstaPay QR bilang
  `assets/gcash-qr.jpg` (parehong filename, papalitan ang luma).
- **Palitan ang halaga:** buksan ang `pending.html`, hanapin ang linyang
  `₱100.00 via GCash / InstaPay` sa loob ng `.qr-box`, at palitan ng tamang
  halaga.
- **Paano nakikita ng admin ang resibo:** sa `admin.html`, may bagong column
  na "Resibo" sa Pending Requests table — i-click ang **"🧾 Tingnan"** para
  makita ang na-upload na resibo bago i-Approve o i-Reject.
- Ang resibo ay direktang naka-save sa Firestore kasama ng profile ng bawat
  teacher (naka-compress muna sa browser bago i-upload), kaya walang
  karagdagang Firebase Storage/Blaze plan na kailangan.
- Sa Approved Teachers table, may column na **"Araw mula sa Approval"** —
  nagbibilang ito mula sa huling pagka-approve ng account (nag-a-update ito
  tuwing i-re-approve mo, hal. pagkatapos mag-Revoke). Berde ang pill
  habang 30 araw pababa, at pula na kapag lagpas 30 araw — magandang
  paalala kung monthly ang bayad at oras na para mag-renew.

## Mga Tanong / Common Issues

- **"Hindi pa na-set up ang Firebase config"** — kulang pa o mali ang laman
  ng `js/firebase-config.js`. Ulitin ang Step 2.
- **Naka-stuck sa "Nakabinbin ang iyong account"** — kailangang mag-sign in
  ang admin (Step 5) at i-approve ang account sa Admin Approvals page.
- **Gustong magdagdag ng ibang admin** — idagdag lang ang kanilang email sa
  parehong `ADMIN_EMAILS` (firebase-config.js) at `isAdmin()` (firestore.rules).
- **"Masyadong malaki pa rin ang larawan" pag nag-a-upload ng resibo** —
  awtomatikong nire-resize/compress ang larawan sa browser, pero kung
  sobrang laki/resolution ng orihinal na screenshot, subukan ng mas simpleng
  screenshot (hal. crop lang ang mahalagang parte) at i-upload ulit.
