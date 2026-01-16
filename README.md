# Tiny Frida Scripts

## Run a script

```shell
# set the bundle ID
  # frida-ps -Uai :   list all bundle IDs for USB connected device
  # grep          :   find app you care about
  # awk           :   extract the bundle ID
export BUNDLE_ID=$(frida-ps -Uai | grep foo | awk '{print $3}')

 # set parameters you want to run inside Scripts
 export FRIDA_PARAMS='{"className":"foobar.foo_class","appName":"foo","logArgs":true,"maxLen":128}'
 
 # traditional way to run: still ok 
 frida -U -l $SCRIPT_NAME.js -f $BUNDLE_ID -- $FRIDA_PARAMS"
```

With Frida's TypeScript bindings, you do it differently; inside `package.json`:

```json
{
  "scripts": {
    "build": "frida-compile scripts/$SCRIPT_NAME.ts -o __$SCRIPT_NAME.js -c",
    "agent": "frida -U -l __$SCRIPT_NAME.js -f $BUNDLE_ID -- $FRIDA_PARAMS",
    "start": "npm run build && npm run agent"
  }
}
```

1. `frida-compile` to transpile the TypeScript to JavaScript.
2. Run the dynamically generated JavaScript file on device.
3. The Frida script can now parse the parameters.
4. [More details](https://learnfrida.info/basic_usage/).

## TypeScript or JavaScript

 > ️️ℹ️ TypeScript is used for development and code feedback with Frida.

The Frida team recommend using the TypeScript bindings;
compile time errors; faster debugging, code completion.

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

- [ole-example](https://github.com/oleavr/frida-agent-example/)
- [frida-snippets](https://github.com/iddoeldor/frida-snippets)
