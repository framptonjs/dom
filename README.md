# Frampton-DOM

A virtual DOM library built on functional-reactive principles.


## Installation

```
> npm install --save @frampton/core
> npm install --save @frampton/style
> npm install --save @frampton/events
> npm install --save @frampton/dom
```

## Test

```
> npm test
```

## Build

```
> npm build
```

## Usage

There are obviously two main actions you'd want to perform, define a DOM and render a DOM.

```
import {
  div,
  text
} from '@frampton/dom';


const myDom =
  div([], [
    text('Hello world')
  ]);
```

Almost every node constructing function takes two arguments: an array of attributes and an array of children. We'll just worry about the array of children for now.

I say most node constructors take two arguments. Dom elements that don't allow children don't accept a second argument (img, br, input...).


### scene

The primary way to render your DOM is to create a scene.

```
import {
  div,
  text,
  scene,
  Scheduler
} from '@frampton/dom';


const myDom =
  div([], [
    text('Hello world')
  ]);


const scheduler: Scheduler =
  scene(
    document.getElementById('root'),
    myDom,
    function handle_events(evt) {
      console.log('event happened: ' + evt);
    }
  );
```

The scene function takes three arguments: a root element to render our virtual DOM into, the initial virtual DOM to render and a function to handle events produced by the DOM. When using the event attributes in Frampton-DOM you are expected to map the raw DOM events into something more meaningful to your application (higher-order events). This function is used to process those events so you can decide how to update your app. If you want to use raw DOM events you can delegate your events or use lifecycle hooks to attach events to the rendered DOM.

The scene function returns a Scheduler that is used to schedule future updates to the DOM. The scheduler runs on requestAnimationFrame. The scheduler function takes one argument, the new DOM to update to.

#### Just render

The underlying render method is publicly exported, but it is not advised to use this method. It takes your virtual DOM and an istance of the Frampton-DOM Runtime. If you want to just render without the event handling, pass a no-op as the final argument to the scene function.


### Attributes and events

Attributes in Frampton-DOM are objects.

```
import {
  div,
  text,
  Attrs
} from '@frampton/dom';


cosnt {
  id,
  className
} = Attrs;


const myDom =
  div([
    id('my-id'),
    className('my-class')
  ], [
    text('Hello world')
  ]);
```

Where having attributes be objects gets interesting is when you start applying transformers to them. This is especcially relevant when considering events.

In below example the value of the input field will be passed to the event handling function we gave to the scene constructor.

```
import {
  input,
  text,
  Events
} from '@frampton/dom';


const myDom =
  input([
    Events.onInput((evt: Event) => evt.target.value)
  ]);
```

What if we wanted to debounce input events?

```
import {
  input,
  text,
  Events
} from '@frampton/dom';


const myDom =
  input([
    Events.debounce(200, Events.onInput((evt: Event) => evt.target.value))
  ]);
```

What if we also only wanted values over 5 characters long?

```
import {
  input,
  text,
  Events
} from '@frampton/dom';


const myDom =
  input([
    Events.filter((val) => val.length >= 5, Events.debounce(200, Events.onInput((evt: Event) => evt.target.value)))
  ]);
```

The other transformer we have is the ability to map events.

```
import {
  div,
  label,
  input,
  text,
  Attrs,
  Events,
  scene
} from '@frampton/dom';


cosnt {
  id,
  for,
  className
} = Attrs;


const initialDom =
  div([], [
    label([
      for('my-input')
    ], [
      text('Enter name:')
    ]),
    input([
      Events.map((name) => `Hello, ${name}`, Events.debounce(200, Events.onInput((evt: Event) => evt.target.value)))
    ])
  ]);


const scheduler: Scheduler =
  scene(
    document.getElementById('root'),
    initialDom,
    function handle_events(evt: string) {
      console.log('Greeting: ' + evt);
    }
  );
```

All three event transformers can be applied at the node level as well, applying to all events contained within a node, children inclusive. The node-level transformers are exported from the top level of frampton-dom, along with the node constructors.

```
import {
  div,
  label,
  input,
  text,
  map,
  Attrs,
  Events,
  scene
} from '@frampton/dom';


cosnt {
  id,
  for,
  className
} = Attrs;


const initialDom =
  map((name) => `Hello, ${name}`, div([], [
    label([
      for('my-input')
    ], [
      text('Enter name:')
    ]),
    input([
      Events.debounce(200, Events.onInput((evt: Event) => evt.target.value))
    ])
  ]));


const scheduler: Scheduler =
  scene(
    document.getElementById('root'),
    initialDom,
    function handle_events(evt: string) {
      console.log('Greeting: ' + evt);
    }
  );
```


### Keyed nodes

Sometimes you will want to reorder nodes. In order to reorder nodes you need to provide frampton-dom with enough information so it can follow along. To aid with this different node constructors are used for nodes that need keys to determine identity during diffing operations.

```
import {
  text,
  Keyed
} from '@frampton/dom';


const {
  parent,
  child,
  ul,
  ol,
  li
} = Keyed;
```

The assumption is that most of the time when reordering nodes you are going to be working with lists.

```
const initialDom =
  Keyed.ul([], [
    Keyed.li(1, [], [
      text('first list item')
    ]),
    Keyed.li(2, [], [
      text('second list item')
    ])
  ]);
```

A keyed parent, such as the ul and ol exported by Keyed, must only contain keyed children. A keyed child takes an additional first argument, a string or number, that is a unique key within that parent.

Later we could apply this new DOM.

```
const updatedDom =
  Keyed.ul([], [
    Keyed.li(2, [], [
      text('second list item')
    ]),
    Keyed.li(1, [], [
      text('first list item')
    ])
  ]);
```

When using keyed nodes, the nodes will just be moved. If using the normal node constructors to create these elements each node would be updated and possibly removed/replaced.

If you want to reorder nodes that aren't list items you can use the generic Keyed.parent and Keyed.child constructors. These constructors just take one additional first argument, the tag name of the node you are creating.

```
import {
  text,
  Keyed
} from '@frampton/dom';


const {
  parent,
  child
} = Keyed;


const initialDom =
  parent('div', [], [
    child('div', 1, [], [
      text('first child div')
    ]),
    child('div', 2, [], [
      text('second child div')
    ])
  ]);
```



### Type safe

Frampton-DOM is written in TypeScript and it is suggested you use it with TypeScript. It defines a type for the virtual DOM. It will look familiar if you've used Elm.

```
Html<Event>
```

The Html type is a container type for its events, just as an Array is the container type for its members.

```
const myArray: Array<number> =
  [1,2,3,4,5];
```

So then when we map nodes we change the type of those nodes.

```
const firstInput: Html<Event> =
  input([
    onInput((evt: Event) => evt)
  ]);


const secondInput: Html<string> =
  map((evt: Event): string => evt.target.value, firstInput);
```