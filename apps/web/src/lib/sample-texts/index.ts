// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
import proverbsRaw from './proverbs.txt?raw';
import manasRaw from './manas.txt?raw';
import anthemRaw from './anthem.txt?raw';
import lullabyRaw from './lullaby.txt?raw';
import ekiKoiRaw from './eki-koidun-erdigi.txt?raw';
import jeerencheRaw from './janybek-han-menen-jeerenche-chechen.txt?raw';
import constitutionRaw from './constitution.txt?raw';

export interface SampleText {
  id: string;
  category: 'lyric' | 'epic' | 'anthem' | 'prose' | 'proverbs' | 'legal';
  title: {
    ky: string;
    ru: string;
    en: string;
    tr: string;
  };
  author?: string;
  content: string;
}

// The proverbs and the two tales are verbatim excerpts from the Kyrgyz Folklore
// Text Corpus v1.0 (Mozilla Data Collective, CC0 1.0). Sources: SOURCES.md.
export const SAMPLE_TEXTS: SampleText[] = [
  {
    id: 'proverbs',
    category: 'proverbs',
    title: {
      ky: 'Макал-лакаптар',
      ru: 'Кыргызские пословицы и поговорки',
      en: 'Kyrgyz Proverbs and Sayings',
      tr: 'Kırgız Atasözleri ve Deyimleri'
    },
    author: 'Элдик',
    content: proverbsRaw.trim()
  },
  {
    id: 'anthem',
    category: 'anthem',
    title: {
      ky: 'Мамлекеттик Гимн',
      ru: 'Государственный Гимн',
      en: 'National Anthem of Kyrgyz Republic',
      tr: 'Kırgız Cumhuriyeti Millî Marşı'
    },
    author: 'Ж. Садыков, Ш. Кулуев',
    content: anthemRaw.trim()
  },
  {
    id: 'manas',
    category: 'epic',
    title: {
      ky: '«Манас» — Манастын сырткы сыпаты',
      ru: '«Манас» — Облик новорождённого Манаса',
      en: '“Manas” — Newborn Manas Portrait',
      tr: '«Manas» — Yenidoğan Manas’ın Portresi'
    },
    author: 'Сагымбай Орозбаков варианты',
    content: manasRaw.trim()
  },
  {
    id: 'lullaby',
    category: 'lyric',
    title: {
      ky: '«Алдей, алдей ак балам» (Бешик ыры)',
      ru: '«Алдей, алдей» (Колыбельная)',
      en: '“Aldei, Aldei” (Cradle Lullaby)',
      tr: '«Aldey, Aldey» (Beşik Ninnisi)'
    },
    author: 'Элдик ыр',
    content: lullabyRaw.trim()
  },
  {
    id: 'eki-koidun-erdigi',
    category: 'prose',
    title: {
      ky: '«Эки койдун эрдиги» (Жомок)',
      ru: '«Храбрость двух овец» (Сказка)',
      en: '“The Bravery of Two Sheep” (Folk Tale)',
      tr: '«İki Koyunun Yiğitliği» (Masal)'
    },
    author: 'Элдик жомок',
    content: ekiKoiRaw.trim()
  },
  {
    id: 'janybek-han-menen-jeerenche-chechen',
    category: 'prose',
    title: {
      ky: '«Жаныбек хан менен Жээренче чечен» (Жомок)',
      ru: '«Жаныбек-хан и Жээренче-чечен» (Сказка)',
      en: '“Janybek Khan and Jeerenche the Wise” (Folk Tale)',
      tr: '«Canıbek Han ile Ceyrençe Şeşen» (Masal)'
    },
    author: 'Элдик жомок',
    content: jeerencheRaw.trim()
  },
  {
    id: 'constitution',
    category: 'legal',
    title: {
      ky: 'Конституциянын Преамбуласы',
      ru: 'Преамбула Конституции КР',
      en: 'Constitution Preamble',
      tr: 'Kırgızistan Anayasası Başlangıç Metni'
    },
    author: 'Кыргыз Республикасы',
    content: constitutionRaw.trim()
  }
];
