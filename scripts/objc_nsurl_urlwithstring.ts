/// <reference types="frida-gum" />
if (!ObjC.available) {
    console.error("ObjC runtime not available");
    return;
}

const resolver = new ApiResolver("objc");
const matches = resolver.enumerateMatches("+[NSURL URLWithString:]");

Interceptor.attach(matches[0].address, {
    onEnter(args) {
        const nsString = new ObjC.Object(args[2]);
        console.log("URL -> " + nsString.toString());
    }
});


