# Audio placeholders (custom-ready)

Folder ini berisi **placeholder audio** agar build stabil sambil menunggu aset final.

## File yang dipakai app
- `bgm_loop.wav` → background music loop
- `tap.wav` → tap/click feedback
- `success.wav` → jawaban benar / complete
- `error.wav` → jawaban salah
- `star.wav` → reward/star feedback

## Cara ganti dengan aset custom
1. Siapkan file audio baru dengan format `.wav`.
2. Ganti file existing dengan **nama file yang sama** (drop-in replacement).
3. Jaga durasi pendek untuk SFX (ideal < 1s) dan volume konsisten.
4. Untuk BGM, pakai loop seamless.

Tidak perlu ubah kode jika nama file tetap sama.
