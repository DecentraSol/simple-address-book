# A decentralized address book with OrbitDB and Svelte

Enter your own address and store it locally in your browser storage
share your contact data via qr-code without an app server or cloud.
Scan and subscribe to other's contact data. (TODO)

Data arent't processed on our or other's servers and directly transmitted between browser or mobile peers.
P2P-Connection is established via the IFPS-network.

## TODO
- qr-code must be scanable by standard mobile cameras 
  - publish a link to an IPFS published version of the app 
  - with a query parameter with Alice's DAL
- make address book db accessible via entering another orbitdb's address - add a text input when changing, then verifyaddress and load db 
- add another textinput connect to a DAL (Decentralized Address Link) and import its contents, when owner changes address - change should appear immediately on replication 
- when sharing an address display its contents in modal.
- pinning service / backup service 