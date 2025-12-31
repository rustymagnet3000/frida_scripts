import ObjC from "frida-objc-bridge";

if (ObjC.available) {
    ObjC.schedule(ObjC.mainQueue, () => {});
}
