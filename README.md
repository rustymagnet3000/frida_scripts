# Tiny Frida Scripts

## Run a script

```shell
# set the bundle ID
  # frida-ps -Uai :   list all bundle IDs for USB connected device
  # grep          :   find app you care about
  # awk           :   extract the bundle ID
export BUNDLE_ID=$(frida-ps -Uai | grep foo | awk '{print $3}')

# frida-server listening on iOS device
frida -U -l scripts/health.ts -f $BUNDLE_ID

#######################
# using Node scripts  #
#######################

# Runs TypeScript type checking only.
# Verifies Frida run-time APIs don't cause Typescript errors 
# i.e. error TS2304: Cannot find name 'ObjC'.
npm run typecheck

# Spawns the target app and prints a console message.
# Verifies Frida up and running with USB-connected iOS device.
npm run frida-health
```

## TypeScript

> we highly recommend using our TypeScript bindings.

A `typescript` file vs a `javascript` file is a no-brainer:

- Compile time errors; speeds up debugging.
- Code completion.
- [Other benefits](https://learnfrida.info/basic_usage/#javascript-vs-typescript).


## WebStorm Troubleshooting

Frida injects globals at runtime, TS needs typings.  Within the IDE, if you download the `@types/frida-gum` extension ( or use command below ) you could still hit issues:

![](.images/webstorm_setup_frida_autocomplete.png)

```shell

# install to get Frida globals (ObjC, Interceptor, Module, etc.) are not standard JS.
npm install --save-dev typescript @types/frida-gum

# tsconfig.json
  # Without this, Frida's ObjC will never resolve.
  # Explicitly include Frida types
"moduleResolution": "node"
"types": ["frida-gum"],

# optional at top of each Typescript file
/// <reference types="frida-gum" />

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
Memory.readCString(args[1], 20) # to avoid this.  You can even limit the size of the read with an ( optional ) size value.

# or handle the error
try {
  this._needle = Memory.readUtf8String(args[1]);
}
```


##### `lldb` convenience arguments differ to `frida`
For example:
 
 ```
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
           

##### Cheat sheets
https://github.com/iddoeldor/frida-snippets