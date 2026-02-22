# 🧠 KidsBrain — AI Coding Prompt

> Educational Game App for Children Age 3–5 | React Native + Expo

---

You are an expert React Native and Expo developer specializing in children's educational apps.

Build a complete, production-ready Android educational game app for children aged 3–5 years using React Native with Expo (SDK 51+). The app must be visually stunning, highly animated, and deeply engaging for toddlers.

---

## 🎯 App Overview

- **App Name:** KidsBrain (or suggest a better name)
- **Target:** Children aged 3–5 years
- **Platform:** Android (primary), iOS (secondary)
- **Tech Stack:** React Native + Expo, Reanimated 3, Expo AV, Lottie animations, React Navigation, @shopify/react-native-skia, react-native-gesture-handler

---

## 📦 Install Dependencies

```bash
npx create-expo-app KidsBrain --template blank-typescript
cd KidsBrain

npx expo install expo-av
npx expo install expo-font @expo-google-fonts/fredoka-one @expo-google-fonts/nunito
npx expo install lottie-react-native
npx expo install react-native-reanimated
npx expo install react-native-gesture-handler
npx expo install @shopify/react-native-skia
npx expo install @react-navigation/native @react-navigation/stack
npx expo install @react-native-async-storage/async-storage
```

---

## 🎮 Game Modules (Mini-Games)

### 1. 🔤 Letter Land (Belajar Huruf)

- Display large, colorful animated letters (A–Z)
- Each letter has a cute animal or object illustration (A = Apple with googly eyes, B = Bear dancing, etc.)
- Tap the letter → it bounces, makes a sound, and says its name + phonics
- Drag-and-drop letter matching game
- Tracing letters with finger (canvas drawing)

### 2. 🔢 Number Jungle (Belajar Angka)

- Animated numbers 1–20 with corresponding cute characters
- Tap to count: show N fruits/animals, child taps each one, they giggle when tapped
- Simple addition with visual objects (1 apple + 2 apples = ?)
- Number tracing with sparkle effects

### 3. 🔷 Shape Safari (Belajar Bentuk)

- Circle, Square, Triangle, Rectangle, Star, Heart — each as a lovable character
- Drag shape to matching outline
- Find the hidden shape game (shapes appear briefly, then hide)
- Build pictures using shapes (house, car, robot)

### 4. 🧠 Memory Magic (Melatih Memori)

- Flip card matching game with cute animal pairs
- 4×4 grid for easier levels, 6×6 for harder
- Cards flip with 3D animation
- Celebration animation (confetti + stars) when a pair is found

### 5. 🎨 Color World (Belajar Warna)

- Interactive coloring book with pre-drawn cute scenes
- Tap a zone to fill with color (bucket fill animation)
- Color mixing: what happens when red + blue mix?
- Find the odd color out mini-game

### 6. 🔍 What's Missing? (Pola & Logika)

- Show a sequence of objects with one missing (🐶🐱❓🐸)
- Child taps the correct answer from 3 options
- Progressive difficulty

---

## ✏️ Modul 7: Tracing Adventure (Menelusuri Jejak)

### Core Tracing Engine

Buat komponen `TracingCanvas.tsx` dengan logika berikut:

1. Tampilkan SVG path sebagai "jalur panduan" (dashed/dotted line)
2. Rekam posisi jari user sebagai array koordinat [x, y]
3. Hitung akurasi: bandingkan path user dengan path panduan menggunakan algoritma "point-to-path distance" (threshold toleransi ±20px untuk anak)
4. Render "ink trail" berwarna-warni mengikuti jari (rainbow atau glitter effect)
5. Jika akurasi > 70% → trigger sukses. Jika < 70% → tampilkan panduan ulang
6. Tambahkan dotted waypoints (●●●) sepanjang jalur sebagai petunjuk arah jari

**Scoring sistem tracing:**

- ⭐⭐⭐ = akurasi > 85%
- ⭐⭐ = akurasi 70–85%
- ⭐ = akurasi 50–70%
- Di bawah 50% → "Coba lagi!" dengan animasi karakter menggeleng lucu

---

### 🔤 Sub-modul 7a: Letter Tracing (Tracing Huruf A–Z)

**Tampilan:**

- Background: papan tulis bergaris berwarna pastel
- Setiap huruf ditampilkan besar di tengah layar (ukuran 60–80% lebar layar)
- Huruf kapital DAN huruf kecil (2 mode terpisah)
- Panah animasi bergerak sepanjang jalur sebelum anak mulai (demo otomatis 3 detik)
- Titik START berwarna hijau (●) dan titik END berwarna merah (■)
- Numbered waypoints (1, 2, 3...) untuk huruf dengan banyak stroke

**Level progression:**

```
Level 1: Huruf lurus saja (I, L, T, H, E, F)
Level 2: Huruf dengan kurva (C, O, U, S, G)
Level 3: Huruf kombinasi (A, B, D, K, M, N, P, R)
Level 4: Semua huruf + huruf kecil
```

**Feedback saat tracing:**

- Jari menyentuh jalur → trail berubah warna (abu → warna cerah)
- Waypoint tercapai → waypoint "pop" dengan efek bintang kecil ✨
- Selesai → huruf "hidup": animasi karakter keluar dari huruf (A → Apel melompat keluar)
- Suara: "A... Apple! A untuk Apel!" dengan voice narasi

---

### 🔷 Sub-modul 7b: Shape Tracing (Tracing Bentuk)

| Bentuk      | Karakter Maskot     | Sound Effect |
| ----------- | ------------------- | ------------ |
| Lingkaran   | Bola pantul         | "Boing!"     |
| Segitiga    | Gunung berapi kecil | "Whoosh!"    |
| Persegi     | Kotak kado          | "Pop!"       |
| Bintang     | Bintang mengedip    | "Twinkle!"   |
| Hati        | Hati berdenyut      | "Lub-dub!"   |
| Berlian     | Kristal berkilau    | "Bling!"     |
| Bulan sabit | Bulan tersenyum     | "Swoosh!"    |

**Mekanisme khusus Shape Tracing:**

- Setelah berhasil tracing → bentuk "terisi" dengan warna dan gradient/glitter
- Mode "Build a Picture": tracing beberapa bentuk untuk membuat gambar (rumah = persegi + segitiga atap)
- Animasi "transform": persegi → kotak kado terbuka, bintang → bintang bersinar

---

### 🐾 Sub-modul 7c: Character & Animal Tracing

Anak menelusuri outline/siluet karakter hewan untuk "menggambar" hewan tersebut.
Setelah selesai, hewan "hidup" dengan animasi Lottie.

```
BEGINNER (2–3 stroke sederhana):
- 🐟 Ikan    → outline oval + ekor segitiga
- 🌸 Bunga   → lingkaran + kelopak oval
- 🏠 Rumah   → kotak + atap segitiga
- 🌙 Bulan   → kurva sabit

INTERMEDIATE (4–6 stroke):
- 🐱 Kucing  → kepala bulat + telinga + badan
- 🐶 Anjing  → kepala + moncong + telinga floppy
- 🐠 Ikan Nemo → badan + sirip + ekor
- 🦋 Kupu-kupu → 4 sayap simetris

ADVANCED (karakter penuh):
- 🐘 Gajah   → badan besar + belalai + telinga
- 🦒 Jerapah → leher panjang + badan + kaki
- 🦁 Singa   → kepala + surai + badan
- 🐢 Kura-kura → tempurung + kepala + kaki
```

**Reward setelah berhasil:**

- Hewan yang ditrace "hidup": melompat, berputar, mengoceh suaranya 🐾
- Hewan masuk ke "Zoo Book" koleksi pribadi anak
- Di Zoo Book: anak bisa tap hewan koleksi → hewan bermain animasi Lottie
- Total 20 hewan untuk dikumpulkan → motivasi untuk terus bermain

---

### 🧩 TracingCanvas Component Spec

```typescript
// TracingCanvas.tsx
interface TracingCanvasProps {
  mode: "letter" | "shape" | "character";
  target: string; // e.g., "A", "circle", "cat"
  guidePath: SkPath; // Skia path object
  waypoints: { x: number; y: number; order: number }[];
  toleranceRadius: number; // default: 20px
  showGuide: boolean; // show dotted guide line
  onComplete: (accuracy: number) => void;
  onWaypointReached: (index: number) => void;
}

// Visual layers (rendered in order):
// 1. Background (themed per mode)
// 2. Guide path (dotted/dashed, semi-transparent)
// 3. Waypoint dots dengan angka
// 4. User's drawn path (rendered via Skia)
// 5. Particle effects overlay
// 6. Karakter maskot (pojok bawah, memberi pujian)
```

---

### 🎮 Tracing UX Flow

```
[Home]
  → [Pilih Mode Tracing: Huruf / Bentuk / Hewan]
    → [Pilih target: grid kartu besar, tap salah satu]
      → [Demo animasi 3 detik: panah berjalan di jalur]
        → [Layar "Sekarang giliranmu! Ikuti jalurnya ✏️"]
          → [TRACING MODE: anak mulai menggambar]
            → [Real-time feedback: glitter trail mengikuti jari]
              → [Complete! → Kalkulasi akurasi → Animasi reward]
                → [Pilih: Ulangi ↩️ | Lanjut ➡️ | Koleksi 🏆]
```

---

### 🌟 Fitur Ekstra Tracing

1. **Rainbow Mode**: Trail jari meninggalkan efek pelangi
2. **Ghost Guide**: Tangan transparan menunjukkan cara tracing yang benar (mode bantuan)
3. **Slow Motion Demo**: Anak bisa tap tombol 👁️ kapan saja untuk melihat demo ulang
4. **Parent Dashboard**: Rekap akurasi tracing anak per sesi (simpan ke AsyncStorage)
5. **Custom Brush**: Anak bisa pilih "tinta": glitter ✨, api 🔥, air 💧, bintang ⭐

---

## 🎨 Visual Design Requirements

- **Art Style:** Bright, soft pastel colors with bold outlines. Think Bluey or Cocomelon aesthetic
- **Characters:** Each module has a mascot character (friendly animal guide)
- **Animations:** Everything bounces, wiggles, or sparkles — NEVER static
- Use **Lottie animations** for celebrations, loading screens, and transitions
- **Fonts:** Rounded, bubbly fonts (Fredoka One, Nunito via expo-google-fonts)
- **Backgrounds:** Each game has a unique themed background (jungle, space, ocean, chalkboard, etc.)
- Particles/confetti when child completes a task
- Stars/coins reward system shown on screen

---

## 🔊 Audio & Feedback

- Every interaction plays a cheerful sound effect
- Use **Expo AV** for audio
- Background music per game module (soft, looping)
- Voice narration: "Great job!", "Try again!", "You're amazing!"
- Correct answer → big celebration animation + sound
- Wrong answer → gentle "Oops!" with encouraging message, no harsh sounds

---

## 🏆 Reward & Progression System

- Stars collected per game (1–3 stars)
- Sticker book: unlock cute stickers as rewards
- Zoo Book: koleksi hewan dari hasil tracing
- Progress tracker per module (shown as a fun journey map)
- No timers or pressure — child-paced

---

## 🧩 Navigation & UX

- Home screen: colorful grid of game modules, each a big rounded card with animated icon
- Simple one-tap navigation — no complex menus
- Back button always visible (big, friendly)
- All text minimal — use icons and visuals primarily
- Support landscape and portrait mode

---

## 📁 Full Project Structure

```
/src
  /screens
    HomeScreen.tsx
    LetterLandScreen.tsx
    NumberJungleScreen.tsx
    ShapeSafariScreen.tsx
    MemoryMagicScreen.tsx
    ColorWorldScreen.tsx
    PatternGameScreen.tsx
    TracingHomeScreen.tsx
    LetterTracingScreen.tsx
    ShapeTracingScreen.tsx
    AnimalTracingScreen.tsx
  /components
    AnimatedCard.tsx
    StarReward.tsx
    ConfettiOverlay.tsx
    GameHeader.tsx
    MascotGuide.tsx
    TracingCanvas.tsx
    GuidePath.tsx
    WaypointDot.tsx
    GlitterTrail.tsx
    ZooBookOverlay.tsx
    AccuracyMeter.tsx
  /assets
    /animations        ← Lottie JSON files
    /sounds
    /images
  /hooks
    useSound.ts
    useProgress.ts
    useTracingLogic.ts
    useZooCollection.ts
  /context
    GameProgressContext.tsx
  /data
    letterPaths.ts     ← SVG path data untuk A–Z
    shapePaths.ts      ← SVG path data untuk bentuk
    animalPaths.ts     ← SVG path data untuk hewan
```

---

## ⚙️ Technical Requirements

- Use **React Native Reanimated 3** for all animations (spring, bounce, fade)
- Use **@shopify/react-native-skia** for tracing canvas (GPU-accelerated)
- Use **Expo Router** or **React Navigation 6** for navigation
- **AsyncStorage** for saving child's progress locally
- Lottie via `lottie-react-native`
- Support Android API 24+
- No internet required (fully offline)
- Optimized for tablets and phones (responsive layout with Dimensions API)

---

## 🚀 Deliverables

1. Full working Expo project with `app.json` configured
2. All 7 game modules implemented (including full Tracing Adventure)
3. Home screen with animated module cards
4. Reward/progress system (Stars + Zoo Book collection)
5. TracingCanvas component with accuracy calculation
6. Sample assets list (free Lottie URLs from lottiefiles.com)
7. README with setup instructions

Start by building the project structure and HomeScreen first, then implement each module one by one. Use placeholder colored boxes where images/Lottie files would go, clearly commented. Implement TracingCanvas.tsx as a reusable core component before building the three tracing sub-modules.

---

## 📚 Free Asset Resources

| Kebutuhan         | Sumber                                              |
| ----------------- | --------------------------------------------------- |
| Lottie animations | lottiefiles.com (search: celebration, star, animal) |
| SVG hewan outline | svgrepo.com (filter: outline/simple)                |
| Font bubbly       | fonts.google.com → Fredoka One, Nunito              |
| Gambar karakter   | freepik.com (kategori: children cartoon)            |
| Sound effects     | freesound.org, mixkit.co                            |
| SVG path huruf    | opentype.js dari font file                          |
