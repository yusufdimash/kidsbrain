type BilingualText = { id: string; en: string };

function t(id: string, en: string): BilingualText {
  return { id, en };
}

export const S = {
  // App
  appName: t('KidsBrain', 'KidsBrain'),
  tagline: t('Belajar sambil bermain!', 'Learn while playing!'),

  // Home Screen
  homeTitle: t('Ayo Belajar!', "Let's Learn!"),
  homeSubtitle: t('Pilih permainan', 'Choose a game'),

  // Module Names
  letterLand: t('Belajar Huruf', 'Learn Letters'),
  numberJungle: t('Dunia Angka', 'Number World'),
  shapeSafari: t('Safari Bentuk', 'Shape Safari'),
  colorWorld: t('Dunia Warna', 'Color World'),
  memoryMagic: t('Memori Ajaib', 'Memory Magic'),
  patternGame: t('Apa yang Hilang?', "What's Missing?"),
  tracingFun: t('Ayo Menggambar!', "Let's Draw!"),

  // Game UI
  stars: t('Bintang', 'Stars'),
  level: t('Level', 'Level'),
  score: t('Skor', 'Score'),
  back: t('Kembali', 'Back'),
  next: t('Lanjut', 'Next'),
  retry: t('Coba Lagi', 'Try Again'),
  home: t('Beranda', 'Home'),
  start: t('Mulai', 'Start'),
  play: t('Main', 'Play'),

  // Feedback
  correct: t('Benar! Hebat!', 'Correct! Great job!'),
  tryAgain: t('Coba lagi ya!', 'Try again!'),
  amazing: t('Luar Biasa!', 'Amazing!'),
  goodJob: t('Bagus!', 'Good job!'),
  perfect: t('Sempurna!', 'Perfect!'),
  keepGoing: t('Terus semangat!', 'Keep going!'),
  wellDone: t('Kerja Bagus!', 'Well Done!'),

  // Memory Game
  memoryTitle: t('Temukan Pasangannya!', 'Find the Pairs!'),
  memoryWin: t('Semua ditemukan!', 'All found!'),
  memoryMoves: t('Langkah', 'Moves'),

  // Pattern Game
  patternTitle: t('Lengkapi Polanya!', 'Complete the Pattern!'),
  patternQuestion: t('Apa yang hilang?', "What's missing?"),

  // Letters
  letterTitle: t('Huruf Apa Ini?', 'What Letter Is This?'),
  letterMatch: t('Cocokkan Hurufnya!', 'Match the Letter!'),
  letterTrace: t('Tulis Hurufnya!', 'Trace the Letter!'),

  // Numbers
  numberTitle: t('Angka Berapa?', 'What Number?'),
  countTitle: t('Ayo Hitung!', "Let's Count!"),
  addTitle: t('Ayo Tambah!', "Let's Add!"),

  // Shapes
  shapeTitle: t('Bentuk Apa?', 'What Shape?'),
  shapeMatch: t('Cocokkan Bentuknya!', 'Match the Shape!'),
  shapeFind: t('Temukan Bentuknya!', 'Find the Shape!'),

  // Colors
  colorTitle: t('Warna Apa?', 'What Color?'),
  colorFill: t('Warnai Gambarnya!', 'Color the Picture!'),
  colorMix: t('Campur Warnanya!', 'Mix the Colors!'),
  colorOdd: t('Yang Mana Berbeda?', 'Which One Is Different?'),

  // Tracing
  tracingTitle: t('Ayo Menulis!', "Let's Trace!"),
  tracingLetters: t('Tulis Huruf', 'Trace Letters'),
  tracingShapes: t('Gambar Bentuk', 'Draw Shapes'),
  tracingAnimals: t('Gambar Hewan', 'Draw Animals'),
  tracingDemo: t('Lihat caranya!', 'Watch how!'),
  tracingStart: t('Sekarang giliranmu!', 'Now your turn!'),

  // Zoo Book
  zooBook: t('Buku Kebun Binatang', 'Zoo Book'),
  zooEmpty: t('Belum ada hewan. Ayo menggambar!', 'No animals yet. Let\'s draw!'),
  zooCollected: t('Terkumpul', 'Collected'),

  // Settings
  settings: t('Pengaturan', 'Settings'),
  soundOn: t('Suara Aktif', 'Sound On'),
  soundOff: t('Suara Mati', 'Sound Off'),
  resetProgress: t('Hapus Kemajuan', 'Reset Progress'),
  resetConfirm: t('Yakin mau hapus semua kemajuan?', 'Are you sure you want to reset all progress?'),

  // Coming soon
  comingSoon: t('Segera Hadir!', 'Coming Soon!'),
};

export type StringKey = keyof typeof S;

export function bilingual(text: BilingualText): string {
  return `${text.id}\n${text.en}`;
}

export function bilingualInline(text: BilingualText): string {
  return `${text.id} / ${text.en}`;
}
