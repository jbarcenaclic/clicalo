// src/components/PhoneInputAdvanced.tsx
'use client'

import PhoneInput from 'react-phone-number-input'
import 'react-phone-number-input/style.css'
import { type FC, KeyboardEvent } from 'react'

type Props = {
  value: string | undefined
  onChange: (value: string | undefined) => void
  onEnter?: () => void
  label?: string
}

const PhoneInputAdvanced: FC<Props> = ({ value, onChange, onEnter, label }) => {
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onEnter) {
      e.preventDefault()
      onEnter()
    }
  }

  return (
    <div className="text-left w-full">
      {label && (
        <label className="block text-sm font-medium text-white mb-1">
          {label}
        </label>
      )}
      <PhoneInput
        international
        defaultCountry="MX"
        value={value}
        onChange={(rawValue) => {
          if (!rawValue) return onChange(undefined)
          const cleaned = rawValue.startsWith('+') ? rawValue : `+${rawValue}`
          onChange(cleaned)
        }}
        className="text-black w-full border rounded px-3 py-2"
        onKeyDown={handleKeyDown}
      />
    </div>
  )
}

export default PhoneInputAdvanced
