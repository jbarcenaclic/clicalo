// utils/isEmbedded.ts
export const isEmbedded = () => {
    return typeof window !== 'undefined' && window.self !== window.top
  }
