export type LanguageCode = 'hi' | 'en' | 'gu' | 'mr' | 'ta' | 'te' | 'bn' | 'kn'
export type MultilingualText = Partial<Record<LanguageCode, string>>

export const LANGUAGE_LABELS: Record<LanguageCode, string> = {
  hi: 'हिंदी',
  en: 'English',
  gu: 'ગુજરાતી',
  mr: 'मराठी',
  ta: 'தமிழ்',
  te: 'తెలుగు',
  bn: 'বাংলা',
  kn: 'ಕನ್ನಡ',
}

export const CURRENT_PHASE = 1

export const LANGUAGE_PHASES: Record<LanguageCode, number> = {
  hi: 1, en: 1,
  gu: 2, mr: 2, ta: 2, te: 2,
  bn: 3, kn: 3,
}

export const ACTIVE_LANGUAGES = (Object.keys(LANGUAGE_PHASES) as LanguageCode[]).filter(
  (lang) => LANGUAGE_PHASES[lang] <= CURRENT_PHASE
)

export function getText(text: MultilingualText, lang: LanguageCode): string {
  return text[lang] ?? text.hi ?? text.en ?? Object.values(text)[0] ?? ''
}
