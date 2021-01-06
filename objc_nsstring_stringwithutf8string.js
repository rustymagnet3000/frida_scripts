/*****************************************************************************
+[NSString stringWithUTF8String:]
+ (instancetype)stringWithUTF8String:(const char *)nullTerminatedCString;
Returns a string created by copying the data from a given C array of UTF8-encoded bytes.
TRICK: Remember arg3 is a const char * and NOT an NSString *

(lldb) b "+[NSString stringWithUTF8String:]"
Breakpoint 2: where = Foundation`+[NSString stringWithUTF8String:], address = 0x0000000184b77b00

(lldb) po $arg1
NSString

(lldb) po (char *)$arg2
"stringWithUTF8String:"

(lldb) po (char *)$arg3
needle          <-- where the "frida" string to detect may appear

USAGE:  frida -l objc_nsstring_stringwithutf8string.js -U -f appname --no-pause
******************************************************************************/


var NSAutoreleasePool = ObjC.classes.NSAutoreleasePool;
var methodPointer = ObjC.classes.NSString['+ stringWithUTF8String:'].implementation;

try {
    var pool = NSAutoreleasePool.alloc().init();
    if (!methodPointer) {
        throw new Error('Cannot find method');
    }
}
catch(err){
    console.error(err.message);
}
finally {
    console.log('\"+[NSString stringWithUTF8String:]\" Implementation Pointer:\t' + methodPointer);
    pool.release();
}

Interceptor.attach(methodPointer, {
    onEnter: function (args) {
        console.log(JSON.stringify({
            thread_id: this.threadId,
            needle: Memory.readUtf8String(args[2]),
            needle_addr: args[2]
        }));
    }
});


/* OUTPUT

    "+[NSString stringWithUTF8String:]" Implementation Pointer:	0x184b77b00
    {"thread_id":771,"needle":"frida","needle_addr":"0x10257da60"}
    {"thread_id":771,"needle":"frida-server","needle_addr":"0x10257da6f"}
    {"thread_id":771,"needle":"FRIDA","needle_addr":"0x10257da7e"}
    {"thread_id":771,"needle":"frida-gadget","needle_addr":"0x10257da8d"}
    {"thread_id":771,"needle":"gum-js-loop","needle_addr":"0x10257da9c"}
    {"thread_id":771,"needle":"gdbus","needle_addr":"0x10257daab"}
    {"thread_id":771,"needle":"Connection interrupted","needle_addr":"0x183f17f68"}

*/