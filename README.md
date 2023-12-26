[![GitHub Actions - two browser chat](https://github.com/silkroadnomad/decentralized-address-book/actions/workflows/main.yml/badge.svg)](https://github.com/silkroadnomad/decentralized-address-book/actions/workflows/main.yml)
![Vercel](https://therealsujitk-vercel-badge.vercel.app/?app=decentralized-address-book)

# A decentralized address book with OrbitDB and Svelte

## Workflow
1. Alice: Enter your own address  (and store it locally in your browser storage)
2. Bob scans the QR-Code of Alice (QR-Code contains Alice username)
3. Bob requests a Alice vCard via Waku (Alice subscribed on Waku-Network)
4. Alice sends her vCard
5. Bob stores vCard in localstorage currently deleted

## Usage
Browser A)
- under Settings set your name under identity (e.g. Alice)
- under MyAddress add Alice own address and mark own address

Browser B)
- under Settings set your name under identity (e.g. Alice)
- under MyAddress add Bobs own address and mark own address 

Browser A)
- under Contacts type "Bob" and click on "Scan Address"

Result: Address of Bob should be added on Alice address book

## Todo
- Fix adding full address attributes (vcard standard? which standard?)
- add confirm modal when requesting address from Bob - add checkout "send my own address"
- add confirm notification on Bob when send-address request arrives - optionally add Address of "Alice"
- add confirm notification on Alice when deliver-address message arrives to add address
- If Alice or Bob updates her/his address send an update-address command - test offline behaviour of recipient. 
- Test Waku-Feature "ephemeral: messages"
- Refactor network operations to be used with / create new branch for:
  - Peer-to-peer & Local First
    - LibP2P local first / p2p see p2p-playground
    - Automerge: https://automerge.org/
    - Plain IPFS
  - Peer-to-peer & Non Local First 
  - Nostr: https://nostr.com/

## Resources
- https://docs.waku.org/guides/js-waku/light-send-receive/
- https://github.com/waku-org/js-waku

