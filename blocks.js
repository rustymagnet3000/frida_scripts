/***********************************************************************************/
// USAGE:  work in progress
/************************************************************************************/
const blockArray = [];

Interceptor.attach(ObjC.classes.YDURLSessionDel['- URLSession:didReceiveChallenge:completionHandler:'].implementation, {
    onEnter(args) {
        console.log("[*] Inside - URLSession:didReceiveChallenge:completionHandler: onEnter");
        const bl = new traceObjC(block.implementation)
        const blockPtr = new ObjC.Block(args[4]);
        console.log("[*] block ptr");
        var origBlock = new ObjC.Block(blockPtr);
        console.log(origBlock);
        blockArray.push(origBlock);
    }
});
