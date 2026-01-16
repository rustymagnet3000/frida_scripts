/************************************************************************************
References
https://github.com/rsenet/FriList/blob/main/01_Observer/DeepLink_UrlScheme/ios-url-scheme-dumper.js
https://developer.apple.com/documentation/uikit/uiapplication/1622961-openurl
open(_:options:completionHandler:) method instead.

To trace everything, including Private API calls:
    frida-trace -m "-[UIApplication *URL*]" -U -f $BUNDLE_ID

I found, that when the user visited a site with a deeplink, it would invoke the App and frida-trace would pick-up:
    180903 ms  -[UIApplication _shouldHandleTestURL:0x280f696c0]
    180903 ms  -[UIApplication _setHandlingURL:0x1 url:0x280f696c0]
    180903 ms  -[UIApplication _applicationOpenURLAction:0x28209cea0 payload:0x283ece480 origin:0x0]
    180911 ms  -[UIApplication _setHandlingURL:0x0 url:0x0

 Testing it:
    1. point iOS device to a proxy
    2. the man-in-the-middle has a web server with a deeplink embedded
    3. any domain - like a test server - is not explicitly trusted
    4. https://< domain of app >/.well-known/apple-app-site-association ( https://www.bbc.co.uk/.well-known/apple-app-site-association )

    // URL scheme
        Apple Music — music:// or musics:// or audio-player-event://
        Calendar — calshow:// or x-apple-calevent://
        Contacts — contacts://

    // validate URL schemes with Frida-cli
        frida -U -f $BUNDLE_ID
        < paste example from https://grepharder.github.io/blog/0x03_learning_about_universal_links_and_fuzzing_url_schemes_on_ios_with_frida.html >
        [iPhone::org.foobar.com ]-> openURL("foo://foobar")
        true
        [iPhone::org.foobar.com  ]-> openURL("flop://foobar")
        false
***********************************************************************************/

import ObjC from "frida-objc-bridge";

if (!ObjC.available) {
    console.error("[!] ObjC runtime not available");
}

const resolver = new ApiResolver("objc");

type MethodHook = {
    selector: string;
    type: "private" | "public";
};

//   Tip ->
//      (`-[UIApplication _applicationOpenURLAction:${args[2]} payload:${args[3]} origin:${args[4]}]`);
const methodsToHook: MethodHook[] = [
    { selector: '-[UIApplication _applicationOpenURLAction:payload:origin:]', type: 'private' },
    { selector: '-[UIApplication openURL:options:completionHandler:]', type: 'public' },
    { selector: '-[UIApplication openURL:]', type: 'public' },
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
                const nsURL = new ObjC.Object(args[2]);
                console.log(`${selector} : ${nsURL.absoluteString().toString()}`);
            } catch (e) {
                console.error(`[!] Error in hook for ${selector}:`, e);
            }
        }
    });
});
