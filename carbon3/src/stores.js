import { writable, derived } from 'svelte/store'

//orbitdb
export const ipfs = writable()
export const db = writable()

export const contacts = writable([])