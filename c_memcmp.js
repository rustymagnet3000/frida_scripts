/***********************************************************************************
 int memcmp(const void *s1, const void *s2, size_t n);
 FIND EXPORT: DebugSymbol.fromAddress(Module.findExportByName(null, 'memcmp'))
 USAGE:  frida -l c_memcmp.js -U -f appname --no-pause
 /************************************************************************************/

const module_name = "libsystem_platform.dylib";
const exp_name = "_platform_memcmp";

function prettyExportDetail(message) {
    return '[*]' + message + '\t' + exp_name + '()\tinside: ' + module_name;
}

if (ObjC.available) {
    console.log("[*]Frida running. ObjC API available!");

    var nonDecoableChars = 0;

    try {
        const ptrToExport = Module.findExportByName(module_name, exp_name);
        if (!ptrToExport) {
            throw new Error(prettyExportDetail('Cannot find Export:'));
        }
        console.log(prettyExportDetail('Pointer to'));

        Interceptor.attach(ptrToExport, {
            onEnter: function (args) {
                try {
                    this._needle = Memory.readUtf8String(args[1]);
                }
                catch(err){
                    nonDecoableChars++;
                    this._needle = 'failed'
                }
                finally {

                }
            },

            onLeave: function (retValue) {

                if(retValue == '0x0' && this._needle != '' && this._needle != 'failed'){
                    console.log(JSON.stringify({
                        found_in_memory: this._needle,
                        non_decodable_strs: nonDecoableChars,
                        needle_type:    this._needle
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
