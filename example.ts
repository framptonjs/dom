import { Html, Attributes, scene, Events, RootNode } from './index';
import { eventValue } from '@frampton/events';


const root: Element =
  document.getElementById('root');


const clickHandler =
  (evt: Event) => evt;


const click2Handler =
  (evt: Event): string => 'click 2';


const mapping =
  (evt: Event): string => 'click 1';


const initialView =
  Html.div(
    [],
    [ Html.input(
        [ Events.onInput(eventValue)
        ]
      ),
      Html.button(
        [ Events.map(mapping, Events.onClick(clickHandler)),
          Events.onClick(click2Handler)
        ],
        [ Html.text('Click me')
        ]
      )
    ]);


const scheduler =
  scene(root, initialView, function(evt: string) {
    console.log('evt: ', evt);
  });


function showOne() {
  const nextView =
    Html.div(
    [],
    [ Html.input(
        [ Events.onInput((evt: Event): string => 'word')
        , Events.debounce(1000, Events.onInput((evt: Event): string => `Hello: ${evt.target.value}`))
        ]
      )
    , Html.button(
        [ Events.map(mapping, Events.onClick(clickHandler)),
          Events.onClick(click2Handler)
        ],
        [ Html.text('Click me')
        ]
      )
    , Html.div(
        [],
        [ Html.text('Some text')
        ]
      )
    ]);

  scheduler(nextView);

  setTimeout(showTwo, 4000);
}

function showTwo() {
  const nextView =
    Html.div(
    [],
    [ Html.input(
        [ Events.debounce(1000, Events.onInput((evt: Event): string => `Hello: ${evt.target.value}`))
        ]
      ),
      Html.button(
        [ Events.map(mapping, Events.onClick(clickHandler)),
          Events.onClick(click2Handler)
        ],
        [ Html.text('Click me')
        ]
      )
    ]);

  scheduler(nextView);

  setTimeout(showOne, 4000);
}


setTimeout(showOne, 2000);