// Delete all generic + internet passwords for the current app
// used to wipe an app, if it gets in a state of disrepair
// doesn't use Interceptor; rather a NativePointer and function parameters
// errSecItemNotFound (-25300)

import ObjC from "frida-objc-bridge";

if (!ObjC.available) {
    console.error("[!] ObjC runtime not available");
}

const method = "SecItemDelete"
const a = Process.findModuleByName("Security")!
const SecItemDeletePtr  = a.findExportByName(method)!;

const SecItemDelete = new NativeFunction(
    SecItemDeletePtr,
    "int",
    ["pointer"]
);

function deleteClass(secClass: string): void {
    const query = ObjC.classes.NSMutableDictionary.dictionary();

    // kSecClass
    query.setObject_forKey_(secClass, "class");

    // @ts-ignore
    const status = SecItemDelete(query.handle);
    console.log(`[+] Deleted ${secClass} items, status = ${status}`);
}

// Generic passwords (most apps)
deleteClass("genp");

// Internet passwords (some apps)
deleteClass("inet");