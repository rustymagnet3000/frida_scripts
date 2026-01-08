// depending on the iOS coder, a Class method or Instance method could be used to create a URL
// same can be achieved with frida-trace:
//      frida-trace -m "+[NSURL URLWithString:]" -m "-[NSURL initWithString:]" -U -f ${BUNDLE_ID}

import ObjC from "frida-objc-bridge";

if (!ObjC.available) {
    console.error("[!] ObjC runtime not available");
}

const resolver = new ApiResolver("objc");

type MethodHook = {
    selector: string;
    type: "instance" | "class";
};

const methodsToHook: MethodHook[] = [
    { selector: '-[NSURL initWithString:]', type: 'instance' },
    { selector: '+[NSURL URLWithString:]', type: 'class' }
];

methodsToHook.forEach(({ selector }) => {
    const matches: ApiResolverMatch[] = resolver.enumerateMatches(selector);
    if (!matches.length || matches[0].address.isNull()) {
        console.error(`[!] Failed to find pointer for ${selector}`);
        return;
    }

    const target: NativePointer = matches[0].address;

    Interceptor.attach(target, {
        onEnter(args) {
            try {
                const nsString = new ObjC.Object(args[2]);
                console.log(`${selector} : ${nsString.toString()}`);
            } catch (e) {
                console.error(`[!] Error in hook for ${selector}:`, e);
            }
        }
    });
});