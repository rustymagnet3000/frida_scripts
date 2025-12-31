import ObjC from "frida-objc-bridge";

const resolver = new ApiResolver("objc");
const matches = resolver.enumerateMatches("+[NSURL URLWithString:]");

Interceptor.attach(matches[0].address, {
    onEnter(args) {
        const nsString = new ObjC.Object(args[2]);
        console.log("URL -> " + nsString.toString());
    }
});

if (!ObjC.available) {
    console.error("ObjC runtime not available");
}

