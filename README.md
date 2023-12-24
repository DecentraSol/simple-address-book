[![GitHub Actions - two browser chat](https://github.com/silkroadnomad/decentralized-address-book/actions/workflows/main.yml/badge.svg)](https://github.com/silkroadnomad/decentralized-address-book/actions/workflows/main.yml)
![Vercel](https://therealsujitk-vercel-badge.vercel.app/?app=decentralized-address-book)
# A decentralized address book with OrbitDB and Svelte

Workflow

1. Alice: Enter your own address  (and store it locally in your browser storage)
2. Bob scans the QR-Code of Alice (QR-Code contains Alice username)
3. Bob requests a Alice vCard via Waku (Alice subscribed on Waku-Network)
4. Alice sends her vCard
5. Bob stores vCard locally

