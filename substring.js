/***********************************************************************************
char *strstr(const char *haystack, const char *needle);
FIND EXPORT: DebugSymbol.fromAddress(Module.findExportByName(null, 'strstr'))
USAGE:  frida -l substring.js -U -f appname --no-pause


 [*]Frida running. ObjC API available!
 [*]Pointer to	strstr()	inside: libsystem_c.dylib
 Spawned `funky-chicken.debugger-challenge`. Resuming main thread!
 [*]Needle:-UK
 [*]Needle:-TP
 [*]Needle:-CS
 [*]Needle:-YU
 [*]Needle:-UK
 [*]Needle:-TP
 [*]Needle:-CS
 [*]Needle:-YU
 [*]Needle:-UK
 ...
 ..
 .
/************************************************************************************/

const module_name = "libsystem_c.dylib";
const exp_name = "strstr";

function prettyExportDetail(message) {
    return '[*]' + message + '\t' + exp_name + '()\tinside: ' + module_name;
}

if (ObjC.available) {
    console.log("[*]Frida running. ObjC API available!");
    try {
        const ptrToExport = Module.findExportByName(module_name, exp_name);
        if (!ptrToExport) {
            throw new Error(prettyExportDetail('Cannot find Export:'));
        }
        console.log(prettyExportDetail('Pointer to'));

        Interceptor.attach(ptrToExport, {
            onEnter: function (args) {
                this._needle = Memory.readUtf8String(args[1]);
                console.log('[*]Needle:' + this._needle);
            },

            onLeave: function (retValue) {
                if(retValue != '0x0'){
                    console.log(JSON.stringify({
                        substring_found: this._needle,
                        return_value: retValue,
                        function: exp_name
                    }));
                }
            }
        });
    }
    catch(err){
        console.error(err.message);
    }
}
else {
    console.log("[!]Objective-C Runtime is not available!");
}
