// src/utils/cookies.ts

/**
 * Lee el valor de una cookie del navegador.
 * @param name Nombre de la cookie
 * @returns El valor de la cookie o null si no existe
 */
export function getCookie(name: string): string | null {
    if (typeof document === 'undefined') return null
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'))
    return match ? decodeURIComponent(match[2]) : null
  }
  
  /**
   * Establece una cookie en el navegador.
   * @param name Nombre de la cookie
   * @param value Valor de la cookie
   * @param days Días hasta la expiración (por defecto 365)
   */
  export function setCookie(name: string, value: string, days = 365) {
    if (typeof document === 'undefined') return
    const expires = new Date()
    expires.setDate(expires.getDate() + days)
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires.toUTCString()}; path=/`
  }
  
  /**
   * Borra una cookie existente.
   * @param name Nombre de la cookie
   */
  export function deleteCookie(name: string) {
    if (typeof document === 'undefined') return
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`
  }
  