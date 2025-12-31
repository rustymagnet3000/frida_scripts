import ObjC from "frida-objc-bridge";


const resolver = new ApiResolver('objc');
const matches = resolver.enumerateMatches('-[NSURL initWithString:]');

if (matches.length === 0) {
    console.error("No matches found");
}

Interceptor.attach(matches[0].address, {
    onLeave(retval) {
        const url = new ObjC.Object(retval);
        console.log("URL -> " + url.absoluteString().toString());
    }
});

if (ObjC.available) {
    console.info("ObjC runtime available");
}
