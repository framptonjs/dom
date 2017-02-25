export function addDomEvent(element: HTMLElement, name: string, bubbles: boolean, callback: (evt: Event) => void): void {
  element.addEventListener(name, callback, !bubbles);
}