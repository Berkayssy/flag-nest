export function getCsrfTokenFromCookie(): string {
    if (typeof document === 'undefined') return '';
    
    const match = document.cookie.split('; ').find(row => row.startsWith('_csrf_token='));
    return match ? decodeURIComponent(match.split('=')[1]) : '';
}

export function csrfHeaders(): HeadersInit {
    const token = getCsrfTokenFromCookie();
    return token ? { 'X-CSRF-Token': token } : {};
}