
export const getContactsList = async (db) => {
    if (db) {
        const all = await db.all()
        console.log("all in getContactsList",all)
        const contactsArray = Object.values(all).sort((a, b) => a.value.firstname.localeCompare(b.value.firstname));
        return contactsArray;
    }
    return []
};

/**
 * adds a contact to our OrbitDB
 * @param data
 */
export const postContact = async (db,data) => {
    console.log("adding new contact to orbitDB",data)
    // const data = forEach((value, key) => object[key] = value)
    const id = data.id || new Date().toISOString();  // Generate a unique ID if not provided
    const hash = await db.put(id,Object.fromEntries(data));
    console.log("hash",hash)
    const allContacts = await db.all()
    console.log("allContacts",allContacts)
    return { status: "success", id, hash };
};

export const updateContact = async (db,idContact, data) => {

    if (!db.get(idContact)) {
        throw new Error("Contact not found");
    }

    await db.set(idContact, data);


    return { status: "updated", id: idContact };
};

export const deleteContact = async (db,idContact) => {

    if (!db.get(idContact)) {
        throw new Error("Contact not found");
    }

    await db.del(idContact);

    return { status: "deleted", id: idContact };
};
