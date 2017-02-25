import { AttrType } from './AttrType';


export const enum EventType {
  DOM,
  LIFECYCLE
}


export interface EventHandler<T> {
  (evt: Event): T;
}


export interface EventPredicate<T> {
  (evt: T): boolean;
}


export interface LifecycleHandler<T> {
  (element: HTMLElement): T;
}


export interface EventMessenger<A,B> {
  (evt: A, messages: (val: B) => void): void;
}


export interface DomEventDef<T> {
  type: EventType.DOM;
  name: string;
  bubbles: boolean;
  handler: EventMessenger<Event,T>;
}


export interface LifecycleEventDef<T> {
  type: EventType.LIFECYCLE;
  name: string;
  handler: EventMessenger<HTMLElement,T>;
}


export type EventDef<T> =
  DomEventDef<T> |
  LifecycleEventDef<T>;


export interface EventAttribute<T> {
  type: AttrType.EVENT;
  value: EventDef<T>;
}


function makeEventMessenger<T>(fn: EventHandler<T>): EventMessenger<Event,T> {
  return function(evt: Event, messages: (val: T) => void): void {
    messages(fn(evt));
  };
}


function makeLifecycleMessenger<T>(fn: LifecycleHandler<T>): EventMessenger<HTMLElement,T> {
  return function(element: HTMLElement, messages: (val: T) => void): void {
    messages(fn(element));
  };
}



// DOM EVENTS

export function custom<T>(name: string, bubbles: boolean, handler: EventHandler<T>): EventAttribute<T> {
  return {
    type: AttrType.EVENT,
    value: {
      type: EventType.DOM,
      name: name,
      bubbles: bubbles,
      handler: makeEventMessenger(handler)
    }
  };
}


function debounceEventDef<T>(delay: number, eventDef: EventDef<T>): EventDef<T> {
  let timer: number = null;

  switch (eventDef.type) {
    case EventType.DOM: {
      return {
        type: EventType.DOM,
        name: eventDef.name,
        bubbles: eventDef.bubbles,
        handler: function(evt: Event, messages: (val: T) => void): void {
          if (!timer) {
            timer = setTimeout(() => {
              eventDef.handler(evt, messages);
              timer = null;
            }, delay);
          }
        }
      };
    }

    case EventType.LIFECYCLE: {
      return {
        type: EventType.LIFECYCLE,
        name: eventDef.name,
        handler: function(element: HTMLElement, messages: (val: T) => void): void {
          if (!timer) {
            timer = setTimeout(() => {
              eventDef.handler(element, messages);
              timer = null;
            }, delay);
          }
        }
      };
    }
  }
}


export function debounce<T>(delay: number, event: EventAttribute<T>): EventAttribute<T> {
  return {
    type: AttrType.EVENT,
    value: debounceEventDef(delay, event.value)
  };
}


function filterEventDef<T>(predicate: EventPredicate<T>, eventDef: EventDef<T>): EventDef<T> {
  switch (eventDef.type) {
    case EventType.DOM: {
      return {
        type: EventType.DOM,
        name: eventDef.name,
        bubbles: eventDef.bubbles,
        handler: function(evt: Event, messages: (val: T) => void): void {
          eventDef.handler(evt, function(val: T) {
            if (predicate(val)) {
              messages(val);
            }
          });
        }
      };
    }

    case EventType.LIFECYCLE: {
      return {
        type: EventType.LIFECYCLE,
        name: eventDef.name,
        handler: function(element: HTMLElement, messages: (val: T) => void): void {
          eventDef.handler(element, function(val: T) {
            if (predicate(val)) {
              messages(val);
            }
          });
        }
      };
    }
  }
}


export function filter<T>(predicate: EventPredicate<T>, event: EventAttribute<T>): EventAttribute<T> {
  return {
    type: AttrType.EVENT,
    value: filterEventDef(predicate, event.value)
  };
}


export interface PreviousPredicate<T> {
  (oldVal: T, newVal: T): boolean;
}


function filterPreviousEventDef<T>(predicate: PreviousPredicate<T>, eventDef: EventDef<T>): EventDef<T> {
  let prevVal: T = null;

  switch (eventDef.type) {
    case EventType.DOM: {
      return {
        type: EventType.DOM,
        name: eventDef.name,
        bubbles: eventDef.bubbles,
        handler: function(evt: Event, messages: (val: T) => void): void {
          eventDef.handler(evt, function(val: T) {
            if (predicate(prevVal, val)) {
              messages(val);
            }

            prevVal = val;
          });
        }
      };
    }

    case EventType.LIFECYCLE: {
      return {
        type: EventType.LIFECYCLE,
        name: eventDef.name,
        handler: function(element: HTMLElement, messages: (val: T) => void): void {
          eventDef.handler(element, function(val: T) {
            if (predicate(prevVal, val)) {
              messages(val);
            }

            prevVal = val;
          });
        }
      };
    }
  }
}


export function filterPrevious<T>(predicate: PreviousPredicate<T>, event: EventAttribute<T>): EventAttribute<T> {
  return {
    type: AttrType.EVENT,
    value: filterPreviousEventDef(predicate, event.value)
  };
}


export function dropRepeats<T>(event: EventAttribute<T>): EventAttribute<T> {
  return filterPrevious((oldVal: T, newVal: T): boolean => {
    return oldVal !== newVal;
  }, event);
}


export function onAbort<T>(handler: EventHandler<T>): EventAttribute<T> {
  return custom('abort', true, handler);
}


export function onAnimationEnd<T>(handler: EventHandler<T>): EventAttribute<T> {
  return custom('animationend', true, handler);
}


export function onAnimationIteration<T>(handler: EventHandler<T>): EventAttribute<T> {
  return custom('animationiteration', true, handler);
}


export function onAnimationStart<T>(handler: EventHandler<T>): EventAttribute<T> {
  return custom('animationstart', true, handler);
}


export function onAudioEnd<T>(handler: EventHandler<T>): EventAttribute<T> {
  return custom('audioend', true, handler);
}


export function onAudioStart<T>(handler: EventHandler<T>): EventAttribute<T> {
  return custom('audiostart', true, handler);
}


export function onBlur<T>(handler: EventHandler<T>): EventAttribute<T> {
  return custom('blur', false, handler);
}


export function onCanPlay<T>(handler: EventHandler<T>): EventAttribute<T> {
  return custom('canplay', true, handler);
}


export function onChange<T>(handler: EventHandler<T>): EventAttribute<T> {
  return custom('change', true, handler);
}


export function onClick<T>(handler: EventHandler<T>): EventAttribute<T> {
  return custom('click', true, handler);
}


export function onDrag<T>(handler: EventHandler<T>): EventAttribute<T> {
  return custom('drag', true, handler);
}


export function onDragEnd<T>(handler: EventHandler<T>): EventAttribute<T> {
  return custom('dragend', true, handler);
}


export function onDragEnter<T>(handler: EventHandler<T>): EventAttribute<T> {
  return custom('dragenter', true, handler);
}


export function onDragLeave<T>(handler: EventHandler<T>): EventAttribute<T> {
  return custom('dragleave', true, handler);
}


export function onDragOver<T>(handler: EventHandler<T>): EventAttribute<T> {
  return custom('dragover', true, handler);
}


export function onDragStart<T>(handler: EventHandler<T>): EventAttribute<T> {
  return custom('dragstart', true, handler);
}


export function onDrop<T>(handler: EventHandler<T>): EventAttribute<T> {
  return custom('drop', true, handler);
}


export function onEnded<T>(handler: EventHandler<T>): EventAttribute<T> {
  return custom('ended', true, handler);
}


export function onError<T>(handler: EventHandler<T>): EventAttribute<T> {
  return custom('error', true, handler);
}


export function onFocus<T>(handler: EventHandler<T>): EventAttribute<T> {
  return custom('focus', false, handler);
}


export function onFocusIn<T>(handler: EventHandler<T>): EventAttribute<T> {
  return custom('focusin', true, handler);
}


export function onFocusOut<T>(handler: EventHandler<T>): EventAttribute<T> {
  return custom('focusout', true, handler);
}


export function onInput<T>(handler: EventHandler<T>): EventAttribute<T> {
  return custom('input', true, handler);
}


export function onKeyDown<T>(handler: EventHandler<T>): EventAttribute<T> {
  return custom('keydown', true, handler);
}


export function onKeyPress<T>(handler: EventHandler<T>): EventAttribute<T> {
  return custom('keypress', true, handler);
}


export function onKeyUp<T>(handler: EventHandler<T>): EventAttribute<T> {
  return custom('keyup', true, handler);
}


export function onLoad<T>(handler: EventHandler<T>): EventAttribute<T> {
  return custom('load', true, handler);
}


export function onMouseOver<T>(handler: EventHandler<T>): EventAttribute<T> {
  return custom('mouseover', true, handler);
}


export function onMouseOut<T>(handler: EventHandler<T>): EventAttribute<T> {
  return custom('mouseout', true, handler);
}


export function onMouseEnter<T>(handler: EventHandler<T>): EventAttribute<T> {
  return custom('mouseenter', true, handler);
}


export function onMouseLeave<T>(handler: EventHandler<T>): EventAttribute<T> {
  return custom('mouseleave', true, handler);
}


export function onPause<T>(handler: EventHandler<T>): EventAttribute<T> {
  return custom('pause', true, handler);
}


export function onPlay<T>(handler: EventHandler<T>): EventAttribute<T> {
  return custom('play', true, handler);
}


export function onPlaying<T>(handler: EventHandler<T>): EventAttribute<T> {
  return custom('playing', true, handler);
}


export function onResize<T>(handler: EventHandler<T>): EventAttribute<T> {
  return custom('resize', true, handler);
}


export function onScroll<T>(handler: EventHandler<T>): EventAttribute<T> {
  return custom('scroll', true, handler);
}


export function onSeeked<T>(handler: EventHandler<T>): EventAttribute<T> {
  return custom('seeked', true, handler);
}


export function onSeeking<T>(handler: EventHandler<T>): EventAttribute<T> {
  return custom('seeking', true, handler);
}


export function onSelect<T>(handler: EventHandler<T>): EventAttribute<T> {
  return custom('select', true, handler);
}


export function onStalled<T>(handler: EventHandler<T>): EventAttribute<T> {
  return custom('stalled', true, handler);
}


export function onSubmit<T>(handler: EventHandler<T>): EventAttribute<T> {
  return custom('submit', true, handler);
}


export function onTimeUpdate<T>(handler: EventHandler<T>): EventAttribute<T> {
  return custom('timeupdate', true, handler);
}


export function onTouchCancel<T>(handler: EventHandler<T>): EventAttribute<T> {
  return custom('touchcancel', true, handler);
}


export function onTouchEnd<T>(handler: EventHandler<T>): EventAttribute<T> {
  return custom('touchend', true, handler);
}


export function onTouchLeave<T>(handler: EventHandler<T>): EventAttribute<T> {
  return custom('touchleave', true, handler);
}


export function onTouchMove<T>(handler: EventHandler<T>): EventAttribute<T> {
  return custom('touchmove', true, handler);
}


export function onTouchStart<T>(handler: EventHandler<T>): EventAttribute<T> {
  return custom('touchstart', true, handler);
}


export function onWheel<T>(handler: EventHandler<T>): EventAttribute<T> {
  return custom('wheel', true, handler);
}



// LIFECYCLE EVENTS

export function onRender<T>(handler: LifecycleHandler<T>): EventAttribute<T> {
  return {
    type: AttrType.EVENT,
    value: {
      type: EventType.LIFECYCLE,
      name: 'render',
      handler: makeLifecycleMessenger(handler)
    }
  };
}