/// <reference types="frida-gum" />

console.log("Hello from Frida");
console.log(__frida_test);

if (ObjC.available) {
    console.log("ObjC runtime available");
}