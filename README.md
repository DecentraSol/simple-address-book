# A decentralized address book with OrbitDB and Svelte

Enter your own address and store it locally in your browser storage.

Publish your contact data via qr-code without an app server or cloud.
Scan and subscribe to other's contact data. (TODO)

Data arent't processed on our or other's servers and directly transmitted between browser or mobile peers.
P2P-Connection is established via the IFPS-network.

## TODO
- [ ] improve jsdoc
- [ ] write cypress test
- [x] main db should be only writable by identity of ipfs / orbitdb node
- [ ] shared db's should also be only writable ipfs id
- [ ] add another textinput connect to a DAL (Decentralized Address Link) and
  - [ ] import its contents
- [ ] when owner changes address - change should appear immediately on replication
- [ ] qr-code must be scanable by standard mobile camera app
  - [ ] use a link to an IPFS(?) published version of the app 
  - [ ] with a query parameter with Alice's DAL
- [x] make address book db accessible via entering another address books address
  - [x] add a text input 
  - [x] when changing then verify address 
  - [x] and load db 

- when sharing an address display its contents in modal.
- pinning service / backup service 