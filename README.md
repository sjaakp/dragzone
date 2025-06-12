# Dragzone 1.0 #



**Dragzone 1.0** is a JavaScript widget that transforms a `<div>`, or another HTML element, into a 'dragzone'.
Such a 'dragzone' can host one or more 'draggables', other HTML elements which can
be dragged within the zone. It was developed to be used for an online survey ('place point
A to your favourite part of the city'), but may have other uses as well.

**Dragzone 1.0** should work in any modern browser. It is small code,
slightly under 3kB in size.

You can see **Dragzone 1.0** in action [here](http://www.sjaakpriester.nl/software/dragzone).

Here is **Dragzone 1.0**'s  [GitHub page](https://github.com/sjaakp/dragzone).

## Install ##

Install **Dragzone 1.0** with [npm](https://www.npmjs.com//):

	npm i @sjaakp/dragzone

You can also manually install **Dragzone 1.0** by
[downloading the source in ZIP-format](https://github.com/sjaakp/dragzone/archive/master.zip).

## Dependencies ##

**Dragzone 1.0** has no dependencies.

## Usage ##

#### Load resources ####

Copy `dragzone.js` from the `dist` directory to a reachable subdirectory of your
website. At the end of the `body` part of the HTML page,
load the **Dragzone 1.0** code like this:

    <script src="/<your subdirectory>/dragzone.js"></script>
    
#### Load from CDN ####

You may also load the **Dragzone 1.0** file from a content distribution
network (CDN), like so:

    <script src="https://unpkg.com/@sjaakp/knob/dist/dragzone.js"></script>

 
### Set-up ###

Mark the dragzone with the attribute `data-dragzone`, and its draggable
children with `data-draggable`, like this:

    <div data-dragzone>
        <div data-draggable="draggable A">A</div>
        <div data-draggable="draggable B">B</div>
    </div>

`data-dragzone` doesn't have a value (though it can, read on). The value
of `data-draggable` is the name of the draggable. `<div>` is the obvious type
of both dragzone and draggable, but many other types will work as well.

No further initializing is needed. An HTML page can have more than one,
independent, dragzones.

### Positions ###

The positions of the contained draggables are described in JSON format,
for example:

    {
    "draggable A": {
        "x": "0.330",
        "y": "0.186"
        },
    "draggable B": {
        "x": "0.274",
        "y": "0.816"
        }
    }

The positions are indexed by the name of the draggable. The co-ordinates
`x` and `y` are fractions of the dragzone's width and height, respectively.
Therefore, they are floats between and including `0` and `1`. They refer
to the center point of the draggable.

**Dragzone 1.0** reports the draggable positions by firing two events:
`"dragzone.changing"` at the start of a dragging operation, and `dragzone.changed`
at the end of it. In both cases, the JSON string describing the draggable
positions is in the `detail` property of the
[event](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent "MDN").

### API ###

The JavaScript widget is stored as the `dragzone` property of the HTML element.
It means that methods can be called like this:

    document.getElementById("zone1").dragzone.disable(); // disable zone1

**Dragzone 1.0** has four functions:

 - **getPositions()** get the draggable positions as JSON string;
 - **setPositions(json)** set the draggable positions from a JSON string;
 - **enable()** enable dragging operations (default);
 - **disable()** disable them.

### Attributes ###

**Dragzone 1.0**'s main attribute `data-dragzone` accepts a JSON string
describing the draggable positions as value.

Add the attribute `data-disable` to take off with a disabled dragzone.

Attribute `data-precision` sets the precision of the position co-ordinates;
default is `3`.
