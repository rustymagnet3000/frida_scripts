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
    var nonDecoableChars = 0;
    try {
        const ptrToExport = Module.findExportByName(module_name, exp_name);
        if (!ptrToExport) {
            throw new Error(prettyExportDetail('Cannot find Export:'));
        }
    }
    catch(err){
        console.error(err.message);
    }
    finally {
        console.log(prettyExportDetail('Frida script running. Pointer: '));
    }
}
else {
    console.warn("[!Frida not running!");
}

Interceptor.attach(ptrToExport, {
    onEnter: function (args) {
        try {
            this._needle = Memory.readUtf8String(args[1]);
        }
        catch(err){
            nonDecoableChars++;
        }
    },

    onLeave: function (retValue) {

        if(retValue == '0x0' && this._needle !== '' && this._needle !== undefined){
            console.log(JSON.stringify({
                found_in_memory: this._needle,
                non_decoded_strs: nonDecoableChars
            }));
        }
    }
});


/*
[*]Frida script running. Pointer: 	_platform_memcmp()	inside: libsystem_platform.dylib

    {"found_in_memory":".applecoloremojiui","non_decoded_strs":56}
    {"found_in_memory":"NSColor","non_decoded_strs":56}
    {"found_in_memory":"NSColor","non_decoded_strs":56}
    {"found_in_memory":"NSColor","non_decoded_strs":56}
    {"found_in_memory":"NSCTFontTraitsAttribute","non_decoded_strs":56}
    {"found_in_memory":"NSCTFontSymbolicTrait","non_decoded_strs":56}
    {"found_in_memory":"NSCTFontTraitsAttribute","non_decoded_strs":62}
    {"found_in_memory":"NSCTFontSymbolicTrait","non_decoded_strs":62}
    {"found_in_memory":"NSCTFontTraitsAttribute","non_decoded_strs":66}
    {"found_in_memory":"NSCTFontSymbolicTrait","non_decoded_strs":66}
    {"found_in_memory":"NSCTFontTraitsAttribute","non_decoded_strs":66}
    {"found_in_memory":"NSCTFontSymbolicTrait","non_decoded_strs":66}
    {"found_in_memory":"NSCTFontTraitsAttribute","non_decoded_strs":66}
    {"found_in_memory":"NSCTFontSymbolicTrait","non_decoded_strs":66}
    {"found_in_memory":"NSCTFontTraitsAttribute","non_decoded_strs":66}
    {"found_in_memory":"NSCTFontSymbolicTrait","non_decoded_strs":66}
    {"found_in_memory":"{0, 0, 0, 0}","non_decoded_strs":89}
 */