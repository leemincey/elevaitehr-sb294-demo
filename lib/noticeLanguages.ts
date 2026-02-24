'use client';

export type NoticeLanguage = {
  code: string;
  label: string;
  nativeLabel: string;
  filename: string;
};

export const NOTICE_LANGUAGES: NoticeLanguage[] = [
  { code: 'en',      label: 'English',               nativeLabel: 'English',       filename: 'know-your-rights-english.pdf' },
  { code: 'es',      label: 'Spanish',               nativeLabel: 'Español',       filename: 'know-your-rights-spanish.pdf' },
  { code: 'vi',      label: 'Vietnamese',            nativeLabel: 'Tiếng Việt',    filename: 'know-your-rights-vietnamese.pdf' },
  { code: 'tl',      label: 'Tagalog',               nativeLabel: 'Tagalog',       filename: 'know-your-rights-tagalog.pdf' },
  { code: 'ur',      label: 'Urdu',                  nativeLabel: 'اردو',           filename: 'know-your-rights-urdu.pdf' },
  { code: 'pa',      label: 'Punjabi',               nativeLabel: 'ਪੰਜਾਬੀ',        filename: 'know-your-rights-punjabi.pdf' },
  { code: 'zh-hans', label: 'Chinese (Simplified)',  nativeLabel: '中文（简体）',   filename: 'know-your-rights-chinese-simplified.pdf' },
  { code: 'zh-hant', label: 'Chinese (Traditional)', nativeLabel: '中文（繁體）',   filename: 'know-your-rights-chinese-traditional.pdf' },
  { code: 'hi',      label: 'Hindi',                 nativeLabel: 'हिन्दी',         filename: 'know-your-rights-hindi.pdf' },
  { code: 'ko',      label: 'Korean',                nativeLabel: '한국어',          filename: 'know-your-rights-korean.pdf' },
];

export function getNoticePath(languageCode: string): string {
  const lang = NOTICE_LANGUAGES.find((l) => l.code === languageCode);
  return lang ? `/notices/${lang.filename}` : `/notices/know-your-rights-english.pdf`;
}

export function downloadNotice(languageCode: string): void {
  const path = getNoticePath(languageCode);
  const a = document.createElement('a');
  a.href = path;
  a.download = '';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
