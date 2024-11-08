
const resolver = new ApiResolver('objc');

const matches = resolver.enumerateMatches('-[NSURL initWithString:]');
const firstPtr = matches[0].address;

Interceptor.attach(firstPtr, {
    onEnter: function(args) {
        const urlObj = new ObjC.Object(args[2]);
        // Convert it to a JS string

        const url = urlObj.toString();
        console.log('URL -> ' + url);
    }
});
