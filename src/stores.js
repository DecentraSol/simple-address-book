import { writable } from 'svelte/store'

//orbitdb
export const ipfs = writable()
export const orbitDB = writable()
export const contacts = writable([])

export const showNotification =  writable()
export const notificationMessage = writable()
export const qrCodeOpen = writable(false)
export const qrCodeData = writable()

export const selectedRowIds = writable([])
export const selectedTab = writable(0)
export const selectedAddress = writable( {
    firstname: "",
    lastname: "",
    street: "",
    zipcode: "",
    city: "",
    country: "",
    own: false,
    orbitDbAddress: ""
})