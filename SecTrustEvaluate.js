const moduleName = 'Security';
const functionName = 'SecTrustEvaluate';
const SecTrustEvaluatePtr = Module.findExportByName(moduleName, functionName);

try {
    if (SecTrustEvaluatePtr == null) {
        throw '[*] %s not found', moduleName, functionName;
    }
    console.log('[*] Script loaded. ' + moduleName + '.' + functionName + '\tpointer: '+ SecTrustEvaluatePtr);

    Interceptor.replace(SecTrustEvaluatePtr,new NativeCallback(function(trust,result) {

        console.log('[*]SecTrustEvaluate called');
        console.log('\tDefault SecTrustResultType: ', Memory.readU32(result));
        Memory.writeU32(result,1);
        console.log('\tnew SecTrustResultType: ', Memory.readU32(result));
        return 0;   // Return errSecSuccess to OSStatus call
    } ,'int',['pointer','pointer']));
}
catch(err){
    console.log('[!] Exception: ' + err.message);
}