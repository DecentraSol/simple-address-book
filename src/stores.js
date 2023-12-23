import { writable } from 'svelte/store'

export const dbUrl = writable('decab')
//orbitdb
export const ipfs = writable()
export const remotePinner = writable()

export const myAddressBook = writable([])
export const dbMyDal = writable()
// export const contacts = writable([])

export const showNotification =  writable()
export const notificationMessage = writable()
export const qrCodeOpen = writable(false)
export const qrCodeData = writable()

export const selectedRowIds = writable([])
export const selectedTab = writable(0)
const contact = {
    id:"",
    firstName: "",
    lastName: "",
    street: "",
    postalCode: "",
    city: "",
    stateProvince: "",
    countryRegion:"",
    own: false,
    ipns: ""
}
export const selectedAddr = writable( contact)
// export const selectedAddress = writable( )