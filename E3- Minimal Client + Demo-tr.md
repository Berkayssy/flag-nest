# Minimal Client + Demo

## Amaç
Evaluation endpointini uygulama tarafında kolay kullanılabilir hale getirmek için minimal bir TypeScript client ve demo örneği eklemek.

## Benim Geliştirme Akışım

### Backend
1. Bu adımda backend değişikliği yoktur.

### Frontend
1. `flag-nest-client-api.ts` ile `createFlagNestClient` yazılır.
2. `isEnabled(flagKey, userId)` fonksiyonu eklenir.
3. Minimal test eklenir.

### Dokümantasyon
1. Kullanım örneği eklenir.
2. E3 dokümanı güncellenir.

## Beklenen Akış
1. Uygulama `createFlagNestClient` ile client oluşturur.
2. `isEnabled` çağrısı evaluate endpointine gider.
3. `enabled` sonucu uygulama akışını belirler.

## Güvenlik Notları
- Token client üzerinden gönderilir.
- Token loglara düşmemelidir.

## Riskler / Edge‑Case
- Network hatasında client hata fırlatır.
- Endpoint `401` dönerse client hata verir.

## Test / Doğrulama
- `isEnabled` true olduğunda `true` döndürür.
- 401 durumunda hata fırlatır.

## Benim Özetim
Minimal client ile entegrasyon daha temiz ve tekrar kullanılabilir hale geldi.

## Benim Geliştirme Algoritmam
`client -> test -> dokümantasyon`