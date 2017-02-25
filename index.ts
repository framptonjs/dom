import { div, input, span, text } from './src/html';
import { map } from './src/events/map';
import { filter } from './src/events/filter';
import { ul, li } from './src/keyed';
import { scene } from './src/scene';
import { diff } from './src/diff';
import { VNode, Html } from './src/elements';
import { Keyed } from './src';
import { id } from './src/attributes/attrs';
import { style } from './src/attributes/style';
import { classList, className } from './src/attributes/classes';
import { onClick, onInput, onRender } from './src/attributes/events';
import * as Mine from './src';

console.log('Mine: ', Mine);

console.log('Keyed: ', Keyed);

const messages =
  (evt: any): void => {
    console.log('message: ', evt);
  };

const handleClick =
  (evt: Event): Event => {
    evt.preventDefault();
    evt.stopPropagation();
    console.log('click: ', evt);
    return evt;
  };

const eventMap =
  (evt: Event): string => {
    console.log('map: ', evt);
    return 'hello';
  };

const eventMap2 =
  (evt: Event): string => {
    console.log('map2: ', evt);
    return 'hello there';
  };

const eventMap3 =
  (evt: string): string => {
    console.log('map3: ', evt);
    return evt + ' world';
  };


const eventValue =
  (evt: Event): string => {
    console.log('eventValue: ', evt);
    return (<any>evt.target).value;
  };


const hasLength =
  (val: string): boolean => {
    console.log('hasLength: ', val);
    return (val.length > 6);
  };


const toHello =
  (val: string): string => {
    return 'hi! ' + val;
  };


const handleRender =
  (element: HTMLElement): string => {
    console.log('rendered: ', element);
    return 'rendered input';
  };


const inputNode: Html<string> =
  filter(hasLength, map(toHello, input([ onInput(eventValue), onRender(handleRender) ])));


console.log('inputNode: ', inputNode);


const inputNode2: Html<string> =
  filter(hasLength, map(toHello, input([])));


const node: VNode<string> =
  <VNode<string>>map(eventMap, div([ id('two'), classList({ hi: true, bacon: false }), onClick(handleClick) ], [
    div([], [
      text('monkey see'),
      div([], [
        text('monkey do')
      ])
    ]),
    ul([], [
      li(4, [], [ text('four') ]),
      li(1, [], [ text('one - 1') ]),
      li(6, [], [ text('six') ]),
      li(2, [], [ span([], [
        text('two' )
      ]) ])
    ]),
    text('now')
  ]));


console.log('node: ', node);


const ordered3 =
  map(eventMap2, div([ id('two'), className('work here alone'), onClick(handleClick) ], [
    ul([ className('what-up') ], [
      li(6, [ style({ background: 'rgba(0,0,0,0)' }) ], [ text('six') ]),
      li(9, [], [ text('nine') ]),
      li(8, [], [ text('eight') ]),
      li(3, [], [ text('three') ]),
      li(1, [], [ text('one') ])
    ]),
    text('now how'),
    div([], [
      text('monkey see'),
      div([], [
        text('monkey do')
      ])
    ])
  ]));


console.log('ordered3: ', ordered3);


const ordered =
  map(eventMap3, map(eventMap, div([ id('two'), className('here jackson'), onClick(handleClick) ], [
    div([], [
      text('monkey do')
    ]),
    ul([], [
      li(7, [], [ text('seven') ]),
      li(3, [], [ text('three') ]),
      li(2, [], [ span([], [
        text('two - 2' )
      ]) ]),
      li(1, [], [ text('one') ]),
      li(5, [], [ text('five') ])
    ]),
    text('now how'),
    div([], [
      text('monkey see')
    ])
  ])));


console.log(diff(ordered, ordered3));


const ordered2 =
  div([ id('two'), className('work action alone') ], [
    ul([], [
      li(2, [], [ span([], [
        text('two - 3')
      ]) ]),
      li(6, [], [ text('six') ]),
      li(8, [], [ text('eight') ]),
      li(3, [], [ text('three') ]),
      li(5, [], [ text('five') ]),
      li(1, [], [ text('one') ])
    ]),
    text('now how'),
    div([], [
      text('monkey do')
    ])
  ]);


const scheduler = scene(document.getElementById('test'), inputNode, messages);


setTimeout(() => {
  console.log('udpate');
  scheduler(inputNode2);
}, 5000);


// document.addEventListener('click', function() {
//   const coin = Math.random();
//   console.log('coin: ', coin);
//   if (coin <= 0.25) {
//     scheduler(<VNode<string>>ordered3);
//   } else if (coin <= 0.5) {
//     scheduler(ordered2);
//   } else if (coin <= 0.75) {
//     scheduler(<VNode<string>>ordered);
//   } else {
//     scheduler(node);
//   }
// });