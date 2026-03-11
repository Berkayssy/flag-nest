# Performance & Release Checklist

## Amaç
Performans gözden geçirmesi yapmak ve release öncesi net bir kontrol listesi oluşturmak.

## Benim Geliştirme Akışım

### Backend
1. Kritik index endpointlerinde select ile sadece gerekli alanlar çekildi.
2. Audit log listesi limitlendi ve includes ile N+1 engellendi.
3. Response payloadları sade tutuldu.

### Frontend
1. Audit fetch koşulu düzeltildi (sadece manager/admin).
2. Rollout flag seçimi inputu validasyonlu hale getirildi.
3. API istekleri CSRF uyumlu kaldı.

## Release Checklist
- Backend request spec’ler geçti
- Frontend test + lint + build geçti
- Login/Logout + RBAC kontrolleri manuel doğrulandı
- Audit log listesi ve rollout kuralları manuel kontrol edildi

## Riskler / Edge‑case
- Aşırı log birikiminde limit yetersiz kalabilir (pagination gerekebilir).
- UI validasyonları backend ile senkron değilse UX düşebilir.

## Test / Doğrulama
- `bundle exec rspec ...` geçti
- `npm run test:run` geçti
- `npm run lint` geçti
- `npm run build` geçti

## Benim Özetim
Performans gözden geçirmesi yapıldı ve release için kontrol listesi hazırlandı.

## Benim Geliştirme Algoritmam
`performans -> kontrol listesi -> test -> doğrulama -> release`