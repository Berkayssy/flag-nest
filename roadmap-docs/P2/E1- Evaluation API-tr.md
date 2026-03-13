# Evaluation API

## Amaç
Uygulama tarafının bir flag’i kullanıcı bazında değerlendirebilmesi için, minimal bir evaluation endpointi sağlamak.

## Benim Geliştirme Akışım

### Backend
1. `GET /api/v1/flags/:key/evaluate` endpointi eklenir.
2. Query param: `user_id` zorunlu, `tenant_id` opsiyonel olur.
3. Sadece `percentage` rollout kuralını destekler.
4. Response: `{ enabled: true|false, reason: "percentage|off|not_found|invalid" }`

### Frontend
1. Bu adımda UI değişiklik yapılmadı.
2. Entegrasyon E3 adımında yapılacaktır.

### Dokümantasyon
1. Endpoint kontratı yazılır.
2. Örnek curl eklenir.

## Beklenen Akış
1. Uygulama `:key` ile evaluate endpointine gider.
2. Backend flag ve aktif rollout kuralını bulur.
3. `user_id` hashlenir ve yüzdeye göre sonuç döner.
4. Cevap `enabled` alanında döner.

## Güvenlik Notları
- Bu endpoint public değildir, E2 adımında delivery auth eklenecek.
- Yanlış `user_id` veya `key` için güvenli cevap döner.

## Riskler / Edge‑Case
- Flag bulunamazsa `enabled=false` döner.
- `percentage=0` veya `percentage=100` doğru davranış vermeli.

## Test / Doğrulama
- `user_id` eksikse `400`.
- Flag yoksa `enabled=false`.
- `percentage=0` -> `enabled=false`
- `percentage=100` -> `enabled=true`
- Test sonucu: `47 examples, 0 failures`

## Benim Özetim
Bu adımla birlikte Flag Nest yalnızca kontrol paneli olmaktan çıkarak uygulamaya karar veren bir servis haline gelir.

## Benim Geliştirme Algoritmam
`endpoint -> kural -> test -> dokümantasyon`
