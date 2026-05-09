'use client'

import { useState } from 'react'
import type { LanguageCode, MultilingualText } from '@/lib/supabase/types'

// Phase rollout — controls which tabs are shown and which are active
const LANGUAGE_PHASES: { code: LanguageCode; label: string; phase: 1 | 2 | 3 }[] = [
  { code: 'hi', label: 'Hindi',    phase: 1 },
  { code: 'en', label: 'English',  phase: 1 },
  { code: 'gu', label: 'Gujarati', phase: 2 },
  { code: 'mr', label: 'Marathi',  phase: 2 },
  { code: 'ta', label: 'Tamil',    phase: 2 },
  { code: 'te', label: 'Telugu',   phase: 2 },
  { code: 'bn', label: 'Bengali',  phase: 3 },
  { code: 'kn', label: 'Kannada',  phase: 3 },
]

const CURRENT_PHASE = 1 // Bump to 2 or 3 as phases launch

interface Props {
  label: string
  value: MultilingualText
  onChange: (value: MultilingualText) => void
  multiline?: boolean
  // For translators: restrict to only their assigned languages
  restrictToLangs?: LanguageCode[]
}

export default function MultilingualEditor({ label, value, onChange, multiline = false, restrictToLangs }: Props) {
  const availableLangs = LANGUAGE_PHASES.filter((l) =>
    restrictToLangs ? restrictToLangs.includes(l.code) : true,
  )

  const [activeTab, setActiveTab] = useState<LanguageCode>(
    availableLangs[0]?.code ?? 'hi',
  )

  function handleChange(lang: LanguageCode, text: string) {
    onChange({ ...value, [lang]: text })
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>

      {/* Language tabs */}
      <div className="flex gap-1 mb-2 flex-wrap">
        {LANGUAGE_PHASES.map(({ code, label: langLabel, phase }) => {
          const restricted = restrictToLangs && !restrictToLangs.includes(code)
          const inactive = phase > CURRENT_PHASE
          const disabled = restricted || inactive
          const filled = Boolean(value[code])

          return (
            <button
              key={code}
              type="button"
              disabled={disabled}
              onClick={() => !disabled && setActiveTab(code)}
              className={`text-xs px-2.5 py-1 rounded-md border transition-colors relative ${
                disabled
                  ? 'border-gray-100 text-gray-300 cursor-not-allowed'
                  : activeTab === code
                  ? 'border-orange-400 bg-orange-50 text-orange-700 font-medium'
                  : 'border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
              title={inactive ? `Phase ${phase} — not yet active` : undefined}
            >
              {langLabel}
              {/* Completion dot */}
              {!disabled && (
                <span
                  className={`absolute -top-1 -right-1 w-2 h-2 rounded-full border border-white ${
                    filled ? 'bg-green-400' : 'bg-gray-300'
                  }`}
                />
              )}
            </button>
          )
        })}
      </div>

      {/* Text input for active language */}
      {multiline ? (
        <textarea
          rows={4}
          value={value[activeTab] ?? ''}
          onChange={(e) => handleChange(activeTab, e.target.value)}
          placeholder={`Enter ${availableLangs.find((l) => l.code === activeTab)?.label ?? activeTab} text…`}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
          dir={activeTab === 'hi' || activeTab === 'mr' ? 'ltr' : 'ltr'}
        />
      ) : (
        <input
          type="text"
          value={value[activeTab] ?? ''}
          onChange={(e) => handleChange(activeTab, e.target.value)}
          placeholder={`Enter ${availableLangs.find((l) => l.code === activeTab)?.label ?? activeTab} text…`}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
      )}

      {/* Completion summary */}
      <p className="text-xs text-gray-400 mt-1">
        {Object.values(value).filter(Boolean).length} /{' '}
        {availableLangs.filter((l) => l.phase <= CURRENT_PHASE).length} languages filled
      </p>
    </div>
  )
}
