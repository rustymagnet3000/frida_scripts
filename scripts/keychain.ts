// gena → encrypted item key (never decryptable)
// agrp → access group
// pdmn → protection class
// v_Data is the secret
import ObjC from "frida-objc-bridge";

if (!ObjC.available) {
    console.error("[!] ObjC runtime not available");
}

const functions = [
    "SecItemCopyMatching",
];

const a = Process.findModuleByName("Security")

function hook(name: string): void {
    // @ts-ignore
    const addr = a.findExportByName(name);
    if (!addr) {
        console.log(`[!] ${name} not found`);
        return;
    }

    Interceptor.attach(addr, {
        onEnter(args) {
            try {
                const dict = new ObjC.Object(args[0]);

                // Ensure it's actually an NSDictionary
                if (!dict.allKeys) {
                    console.log("[!] Not an NSDictionary");
                    return;
                }

                const keys = dict.allKeys();
                const count = keys.count();

                console.log(`${name}\n{`);
                for (let index = 0; index < count; index++) {
                    const k = keys.objectAtIndex_(index);
                    const v = dict.objectForKey_(k);

                    const keyStr = k ? k.toString() : "<null>";
                    const valStr = v ? v.toString() : "<null>";

                    // Decode password data
                    if (keyStr === "v_Data") {
                        const nsString = ObjC.classes.NSString.alloc();
                        const decodedValue = nsString
                            .initWithData_encoding_(v, 4) // NSUTF8StringEncoding
                            .toString();
                        console.log(`\t${keyStr} : ${decodedValue}`);

                    }
                    else {
                        console.log(`\t${keyStr} : ${valStr}`);
                    }
                }
                console.log(`}`);
            } catch (e) {
                console.log("unable to parse dictionary:", e);
            }
        }
    });
}

functions.forEach(hook);