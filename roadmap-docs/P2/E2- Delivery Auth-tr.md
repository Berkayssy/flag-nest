# Delivery Auth

## Amaç
Evaluation endpointinin sadece servis token ile çağrılabilmesini sağlamak.

## Benim Geliştirme Akışım

### Backend
1. `DELIVERY_API_KEY` env değişkeni tanımlanır.
2. Evaluation controller içine `require_delivery_token!` guard eklenir.
3. `Authorization: Bearer <token>` header ile doğrulama yapılır.

### Frontend
1. Bu adımda UI değişikliği yoktur.
2. Entegrasyon E3 adımında yapılır.

### Dokümantasyon
1. Token formatı ve örnek curl eklenir.
2. Yanlış token davranışı yazılır.

## Beklenen Akış
1. Uygulama evaluate endpointine token ile gider.
2. Token doğrulanırsa istek devam eder.
3. Token yoksa veya yanlışsa `401` döner.

## Güvenlik Notları
- Token yoksa endpoint çalışmaz.
- Token header: `Authorization: Bearer <token>`
- Token server tarafında ENV üzerinden okunur.
- Token expiry süresi eklenerek güvenlik arttırılmalıdır.

## Riskler / Edge‑Case
- `DELIVERY_API_KEY` boş ise tüm istekler `401` alır.
- Token loglara düşmemeli.

## Test / Doğrulama
- Token yoksa `401`.
- Token yanlışsa `401`.
- Token doğruysa `200`.
- Backend test suite -> `50 examples, 0 failures`

## Benim Özetim
Delivery auth eklendi ve evaluation endpoint artık servis bazlı korunuyor.

## Benim Geliştirme Algoritmam
`token -> guard -> test -> dokümantasyon`
