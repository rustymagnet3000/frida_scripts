// frida -U -l __swift-find-class.js -f $BUNDLE_ID -- '{"className":"bar.foo_class"}'
/* Spawning `org.app.foobar {"className":"bar.foo_class"}`...  */

interface Params {
    className: string;
}

const params = (globalThis as any).parameters as Params;
console.log(JSON.stringify(params, null, 2));