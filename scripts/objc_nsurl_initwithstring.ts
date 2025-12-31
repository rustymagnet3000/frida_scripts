/// <reference types="frida-gum" />

if (!ObjC.available) {
    console.error("ObjC runtime not available");
    return;
}

const resolver = new ApiResolver('objc');
const matches = resolver.enumerateMatches('-[NSURL initWithString:]');

if (matches.length === 0) {
    console.error("No matches found");
    return;
}

Interceptor.attach(matches[0].address, {
    onLeave(retval) {
        const url = new ObjC.Object(retval);
        console.log("URL -> " + url.absoluteString().toString());
    }
});