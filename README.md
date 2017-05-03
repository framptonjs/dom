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
import { Html } from '@frampton/dom';


const myDom =
  Html.div([], [
    Html.text('Hello world')
  ]);
```

Almost every node constructing function takes two arguments: an array of attributes and an array of children. We'll just worry about the array of children for now.

I say most node constructors take two arguments. Dom elements that don't allow children don't accept a second argument (img, br, input...).


### scene

The primary way to render your DOM is to create a scene.

```
import {
  Html,
  scene,
  Scheduler
} from '@frampton/dom';


const myDom =
  Html.div([], [
    Html.text('Hello world')
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
  Html,
  Attrs
} from '@frampton/dom';


cosnt {
  id,
  className
} = Attrs;


const myDom =
  Html.div([
    id('my-id'),
    className('my-class')
  ], [
    Html.text('Hello world')
  ]);
```

#### Attributes vs Properties

There are two kinds of Attributes in frampton-dom, an Attribute and a Property. An Attribute is set via the Element.setAttribute method.

```
node.setAttribute('value', 'my value');
```

A Property is set via normal object property syntax.

```
node.value = 'my value';
```

There are a number of built-in methods for creating properties and attributes, there are also generic methods for creating Properties and Attributes with names that haven't been included.

```
import {
  Html,
  Attrs,
  Props
} from '@frampton/dom';


const myDom =
  Html.div([
    Attrs.id('my-id'),
    Attrs.className('my-class'),
    Props.innerHTML('<div>Some unsafe HTML</div>'),
    Attrs.attribute('custom-attribute', 'custom-value'),
    Props.property('custom-property', 'custom-value')
  ]);
```

#### classMap

Most functions for creating Attributes/Properties follow nameing from standard DOM properties. There are a few custom functions to help with stateless renders. One of these is the Attrs.classMap function. It takes a hash of the form className -> boolean.

```
import {
  Html,
  Attrs
} from '@frampton/dom';


const myDom =
  Html.div([
    Attrs.id('my-id'),
    Attrs.classMap({
      'class-one': true,
      'class-two': false,
      'class-three': true
    })
  ]);
```

The class name will be applied if the boolean is true.


#### Events

Where having attributes be objects gets interesting is when you start applying transformers to them. This is especcially relevant when considering events.

In below example the value of the input field will be passed to the event handling function we gave to the scene constructor.

```
import {
  Html,
  Events
} from '@frampton/dom';


const myDom =
  Html.input([
    Events.onInput((evt: Event) => evt.target.value)
  ]);
```

##### Debounce Events

What if we wanted to debounce input events?

```
import {
  Html,
  Events
} from '@frampton/dom';


const myDom =
  Html.input([
    Events.debounce(200, Events.onInput((evt: Event) => evt.target.value))
  ]);
```

##### Filter Events

What if we also only wanted values over 5 characters long?

```
import {
  Html,
  Events
} from '@frampton/dom';


const myDom =
  Html.input([
    Events.filter((val) => val.length >= 5, Events.debounce(200, Events.onInput((evt: Event) => evt.target.value)))
  ]);
```

##### Map Events

The other transformer we have is the ability to map events.

Note: In the following example 'htmlFor' is used for the DOM attribute 'for' because 'for' is a reserved word in JavaScript.

```
import {
  Html,
  Attrs,
  Events,
  scene
} from '@frampton/dom';


cosnt {
  id,
  htmlFor,
  className
} = Attrs;


const initialDom =
  Html.div([], [
    Html.label([
      htmlFor('my-input')
    ], [
      Html.text('Enter name:')
    ]),
    Html.input([
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

##### Transform Nodes

All three event transformers can be applied at the node level as well, applying to all events contained within a node, children inclusive. The node-level transformers are exported with the node constructors in Html.

```
import {
  Html,
  Attrs,
  Events,
  scene
} from '@frampton/dom';


cosnt {
  id,
  htmlFor,
  className
} = Attrs;


const initialDom =
  Html.map((name) => `Hello, ${name}`, Html.div([], [
    label([
      htmlFor('my-input')
    ], [
      Html.text('Enter name:')
    ]),
    Html.input([
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

#### Multiple handlers

Something else we can do is assign multiple handlers for the same event. Suppose we have an input. We perform validation on that input that requires a network request. We want to debounce that. We also display a character counter to the user. We obviously don't want to debounce that.

```
import {
  Html,
  Events,
  Attribute
} from '@frampton/dom';

import {
  eventValue
} from '@frampton/events';


const onInputValue: Attribute<string> =
  Events.onInput(eventValue);


const myDom =
  Html.input([
    Events.map((val: string) => ({ type: 'UpdateCharCount', val: val.length }), onInputValue),
    Events.map((val: string) => ({ type: 'Validate', val: val }), Events.debounce(200, onInputValue))
  ]);
```


### Keyed nodes

Sometimes you will want to reorder nodes. In order to reorder nodes you need to provide frampton-dom with enough information so it can follow along. To aid with this different node constructors are used for nodes that need keys to determine identity during diffing operations.

```
import {
  Html,
  Keyed
} from '@frampton/dom';
```

The assumption is that most of the time when reordering nodes you are going to be working with lists.

```
const initialDom =
  Keyed.ul([], [
    Keyed.li(1, [], [
      Html.text('first list item')
    ]),
    Keyed.li(2, [], [
      Html.text('second list item')
    ])
  ]);
```

A keyed parent, such as the ul and ol exported by Keyed, must only contain keyed children. A keyed child takes an additional first argument, a string or number, that is a unique key within that parent.

Later we could apply this new DOM.

```
const updatedDom =
  Keyed.ul([], [
    Keyed.li(2, [], [
      Html.text('second list item')
    ]),
    Keyed.li(1, [], [
      Html.text('first list item')
    ])
  ]);
```

When using keyed nodes, the nodes will just be moved. If using the normal node constructors to create these elements each node would be updated and possibly removed/replaced.

If you want to reorder nodes that aren't list items you can use the generic Keyed.parent and Keyed.child constructors. These constructors just take one additional first argument, the tag name of the node you are creating.

```
import {
  Html,
  Keyed
} from '@frampton/dom';


const initialDom =
  Keyed.parent('div', [], [
    Keyed.child('div', 1, [], [
      Html.text('first child div')
    ]),
    Keyed.child('div', 2, [], [
      Html.text('second child div')
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
  Html.input([
    onInput((evt: Event) => evt)
  ]);


const secondInput: Html<string> =
  Html.map((evt: Event): string => evt.target.value, firstInput);
```