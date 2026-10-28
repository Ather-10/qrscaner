# Play Store checklist

## One-time: signing key (PowerShell, needs JDK)
keytool -genkeypair -v -keystore scanpro-upload.jks -alias scanpro -keyalg RSA -keysize 2048 -validity 10000
[Convert]::ToBase64String([IO.File]::ReadAllBytes("scanpro-upload.jks")) | Set-Clipboard

GitHub repo > Settings > Secrets and variables > Actions > New repository secret:
- KEYSTORE_BASE64  (paste clipboard)
- KEYSTORE_PASSWORD
- KEY_ALIAS  (scanpro)
- KEY_PASSWORD
BACK UP scanpro-upload.jks and the passwords. Never commit the .jks file.

## Build
Push to main -> Actions -> Artifacts -> ScanPro-AAB-for-PlayStore (upload this to Play Console).

## Store listing
Title: ScanPro – QR Scanner & Generator
Short (80): Free, private QR & barcode scanner and QR code generator. No ads.
Full: ScanPro is a fast, free QR code and barcode scanner with a built-in QR generator.
- Scan with the camera or from a gallery image, with flashlight support
- Recognizes links, Wi-Fi, contacts, email, phone, SMS, locations and calendar events
- Never opens links automatically: you see the destination first
- Create QR codes for URLs, text, Wi-Fi, contacts, email, phone, SMS, location, social links and events
- Scan history and saved QR codes, with search and filters
- Dark and light themes
- No account, no ads, no tracking. Everything stays on your device.
Category: Tools. Contact email: your email. Privacy policy: https://ather-10.github.io/qrscaner/privacy.html

## Data safety form
Collects data: No. Shares data: No. Data encrypted/deletable: not applicable (nothing collected). Permissions: Camera only.
Ads: No. App access: all features available without login.

## Closed testing
Personal account: add 12+ testers (their Gmail), keep opted in 14 days, then apply for production.
