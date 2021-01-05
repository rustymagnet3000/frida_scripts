/***********************************************************************************/
// USAGE:  for arm64
/************************************************************************************/

var targetFunction = Module.findExportByName("libsystem_kernel.dylib", "access");

Interceptor.attach(targetFunction, {
    onEnter: function (args) {
        const path = Memory.readUtf8String(this.context.x0);
        console.log("[*] " + path)
    }
});
