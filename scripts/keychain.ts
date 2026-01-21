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
                console.log(`\n[${name}]`);
                console.log(dict.toString());
            } catch (e) {
                console.log(`[${name}] unable to parse dictionary:`, e);
            }
        }
    });
}

functions.forEach(hook);