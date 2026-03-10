# Security Hardening

## Amaç
Kritik endpointleri daha güvenli hale getirmek için CSRF koruması ve rate‑limit eklemek, ayrıca input validasyonlarını sıkılaştırmak.

## Benim Geliştirme Akışım

### Backend
1. Login için rate‑limit eklendi (IP + email, 5 deneme/10 dk).
2. CSRF koruması eklendi (header + `_csrf_token` cookie).
3. `login` sonrası CSRF cookie set edildi, `logout` ile temizlendi.
4. FeatureFlag model validasyonları sıkılaştırıldı (name/key uzunluğu, key formatı, description limit).
5. Request spec’ler CSRF header ile güncellendi (logout, feature_flags, rollout_rules).
6. Bad‑case testleri eklendi (invalid key, uzun name, %>100 rollout).
7. Test ortamı için cache store ayarlandı.
8. Full request suite başarılı geçti.

### Frontend
1. CSRF helper eklendi (`_csrf_token` → `X‑CSRF‑Token`).
2. API client write isteklerine CSRF header eklendi.
3. Test + lint + build başarılı geçti.

## Beklenen Akış
1. Kullanıcı login olur → CSRF cookie oluşur.
2. Write isteklerde `X‑CSRF‑Token` header zorunludur.
3. Rate‑limit aşılırsa `429` döner.
4. Validasyon hatalarında `422` döner.

## Güvenlik Notları
- CSRF yalnızca write isteklerde kontrol edilir.
- Rate‑limit brute‑force ve abuse denemelerini engeller.
- Validasyonlar input hijyenini korur.

## Riskler / Edge‑case
- CSRF token eksik/yanlışsa `403`.
- Cache store çalışmazsa rate‑limit etkisiz olur.
- UI validasyonları backend ile uyumlu olmazsa UX düşer.

## Test / Doğrulama
- Backend:
  - Auth/feature_flags/rollout_rules request suite geçti
  - Bad‑case testleri geçti
- Frontend:
  - `npm run test:run` geçti
  - `npm run lint` geçti
  - `npm run build` geçti

## Benim Özetim
Güvenlik katmanı güçlendirildi. Kritik endpointler CSRF ve rate‑limit ile koruma altına alındı.

## Benim Geliştirme Algoritmam
`security -> input hardening -> test -> doğrulama -> push`