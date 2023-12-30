import { AddressCardMessage} from "../schemas/protobufSchemas.js";
import { createDecoder, createEncoder, createLightNode, Protocols, waitForRemotePeer} from "@waku/sdk";
import { myAddressBook, wakuNode, subscription, connectedPeers, identity, progressText, progressState} from "../stores.js";

export const CONTENT_TOPIC = "/dContact/1/message/proto";
const COMMAND_SEND_ADDRESS = 'SEND-ADDRESS';
const COMMAND_DELIVER_ADDRESS = 'DELIVER-ADDRESS';

const decoder = createDecoder(CONTENT_TOPIC);
const encoder = createEncoder({ contentTopic: CONTENT_TOPIC, ephemeral: true });

export async function handleMount() {
    progressText.set("creating light waku node")
    progressState.set(1)
    _wakuNode = await createLightNode({ defaultBootstrap: true })
    wakuNode.set(_wakuNode)
    progressText.set("starting waku node ...")
    progressState.set(2)
    await _wakuNode.start();
    progressText.set("waku started - waiting for remote peers")
    progressState.set(3)
    await waitForRemotePeer(_wakuNode, [Protocols.LightPush]);
    progressText.set("waku libp2p peers connected..")
    progressState.set(4)
    _wakuNode.libp2p.addEventListener('connection:open',  () => {
        connectedPeers.update(n => n + 1);
        if(_connectedPeers>1) progressState.set(5)
    });
    _wakuNode.libp2p.addEventListener('connection:close', () => {
        connectedPeers.update(n => n - 1);
    });
    subscription.set(await _wakuNode.filter.createSubscription());
    await _subscription.subscribe([decoder], handleMessage);
    console.log("subscripted to ...",CONTENT_TOPIC)
}
function handleMessage(wakuMessage) {

    if (!wakuMessage.proto.payload) return;
    const messageObj = AddressCardMessage.decode(wakuMessage.payload);
    console.log("handle message",messageObj)
    console.log("messageObj.command",_identity)
    if (messageObj.recipient !== _identity) return;

    switch (messageObj.command) {
        case COMMAND_SEND_ADDRESS:
            console.log("_myAddressBook",_myAddressBook)
            const contact =  _myAddressBook.find((entry) => entry.own === true)
            console.log("sendMyAddress",contact)
            sendMyAddress(messageObj.sender,contact);
            break;
        case COMMAND_DELIVER_ADDRESS:
            updateAddressBook(messageObj);
            break;
        default:
            console.error(`Unknown command: ${messageObj.command}`);
    }
}
export async function sendMyAddress(recipient, data) {
    console.log("sendMyAddress",data)
    const protoMessage = AddressCardMessage.create({
        timestamp: Date.now(),
        command: COMMAND_DELIVER_ADDRESS,
        sender: _identity,
        recipient: recipient,
        data: JSON.stringify(data)
    });
    // console.log(protoMessage)
    const serialisedMessage = AddressCardMessage.encode(protoMessage).finish();
    await _wakuNode.lightPush.send(encoder, { payload: serialisedMessage });
    console.log("sent my address to",recipient)
}

export const sendAddress = async (identity,scannedAddress) => {
    console.log("request sendAddress",identity)
    const protoMessage = AddressCardMessage.create({
        timestamp: Date.now(),
        command: COMMAND_SEND_ADDRESS,
        sender: identity,
        recipient: scannedAddress,
    });
    const serialisedMessage = AddressCardMessage.encode(protoMessage).finish();
    await _wakuNode.lightPush.send(encoder, { payload: serialisedMessage });
    console.log("message sent")
}

function updateAddressBook(messageObj) {
    const contactData = JSON.parse(messageObj.toJSON().data);
    _myAddressBook.push({
        firstName: contactData.firstName,
        middleName: contactData.middleName,
        lastName: contactData.lastName,
        organization: contactData.organization,
        workPhone: contactData.workPhone,
        birthday: contactData.birthday,
        title: contactData.title,
        url: contactData.url,
        note: contactData.note,
        street: contactData.street,
        city: contactData.city,
        stateProvince: contactData.stateProvince,
        postalCode: contactData.postalCode,
        countryRegion: contactData.countryRegion,
        own: false
    });
    myAddressBook.set(_myAddressBook);
}

let _wakuNode
wakuNode.subscribe((val) => {
    _wakuNode = val
});

let _subscription
subscription.subscribe((val) => {
    _subscription = val
});

let _identity
identity.subscribe((val) => {
    _identity = val
});

let _connectedPeers
connectedPeers.subscribe((val) => {
    _connectedPeers = val
});

let _myAddressBook
myAddressBook.subscribe((val) => {
    _myAddressBook = val
});