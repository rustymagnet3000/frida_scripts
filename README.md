# Tiny Frida Scripts

## Run a script

```shell
# set the bundle ID
  # frida-ps -Uai :   list all bundle IDs for USB connected device
  # grep          :   find app you care about
  # awk           :   extract the bundle ID
export BUNDLE_ID=$(frida-ps -Uai | grep foo | awk '{print $3}')

# frida-server listening on iOS device
# note: you don't pass in a .ts file to Frida
frida -U -l scripts/_health.js -f $BUNDLE_ID
```

## TypeScript or JavaScript

 > ️️ℹ️ With Frida, TypeScript is used for development and code feedback ONLY.

The Frida team recommend using the TypeScript bindings;
compile time errors; faster debugging, code completion.
When ready to run `frida`, the TypeScript files are transpiled to JavaScript files.
The `frida-server` on the iOS / macOS device read the JavaScript file
\[ never the TypeScript file \].  
[More details](https://learnfrida.info/basic_usage/).

## Which Frida tool ?

 A few new Frida tools are in play here:

- **frida-gum**             -> tell Typescript about Frida Types
- **frida-objc-bridge**     -> let Typescript understand the Frida ObjC APIs
- **frida-compile**         -> transform Typescript to Javascript files

## WebStorm Troubleshooting

Frida injects globals at runtime, TS needs typings.
Within the IDE, if you download the `@types/frida-gum` extension
( or use command below ) you could still hit issues:

![webstorm_library](.images/webstorm_setup_frida_autocomplete.png)

```shell

# install to get Frida globals (ObjC, Interceptor, Module, etc.)
npm install --save-dev typescript @types/frida-gum
npm install --save-dev frida-objc-bridge

# tool to convert files to Javascript for running
npm install --save-dev frida-compile

# globals.d.ts includes reference to console function
  # prevents `Cannot find name 'console'`
```

## Writing Frida Scripts

### Objective-C

```shell
# Read ObjectiveC function parameters
- 0 = 'self'
- 1 = The selector string
- 2 = The first argument

# List Objective-C methods
ObjC.classes.NSString.$ownMethods
ObjC.classes.NSURL.$ownMethods

# Persist instance variables between onEnter() and onLeave()
onEnter: function (args) {
  this._needle = new ObjC.Object(args[2]);

onLeave: function (retval) {
if(this._needle != '-') { // some code }

# ObjC.Object Properties
const foobar = new ObjC.Object(retval)
// foobar.$className
// foobar.$moduleName
// foobar.$kind

# API Resolver
const resolver = new ApiResolver('objc');
const matches = resolver.enumerateMatches('-[NSURL initWithString:]');
const firstPtr = matches[0].address;
Interceptor.attach(firstPtr, { // code
// ...
// ..

# Find C function
DebugSymbol.fromAddress(Module.findExportByName(null, 'strstr'))

# Reference Counting
The Frida author wrote "Never interact with Objective-C APIs without an `autorelease-pool`."_
 
# Reading C Strings can throw errors
# Memory.readUtf8String(args[1]);` can `throw`
# i.e. `Error: can't decode byte 0xda in position 2 at /repl19.js:25`.
# to avoid, you can even limit the size of the read with an ( optional ) size value.
Memory.readCString(args[1], 20) 

# or handle the error
try {
  this._needle = Memory.readUtf8String(args[1]);
}
```

### lldb args differ from Frida

For example:

 ```shell
-[NSString containsString:]

 -lldb  ---------------------------------

(lldb) po $arg1
haystack

(lldb) po (char *)$arg2
"containsString:"

(lldb) po $arg3
needle

-frida ---------------------------------
   Interceptor.attach(methodPointer, {
       onEnter: function (args) {
        this._needle = new ObjC.Object(args[2]);
 ```

### Links

[frida-snippets](https://github.com/iddoeldor/frida-snippets)
