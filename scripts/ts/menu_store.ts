/*************************************************************
 *
 *  Copyright (c) 2015-2016 The MathJax Consortium
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */


/**
 * @fileoverview A store that
 *
 * @author v.sorge@mathjax.org (Volker Sorge)
 */

/// <reference path="context_menu.ts" />


namespace ContextMenu {

  export class MenuStore {

    private store: HTMLElement[] = [];
    private active: HTMLElement;
    private menu: ContextMenu;

    /**
     * @constructor
     * @param {ContextMenu} menu The context menu the store belongs to.
     */
    constructor(menu: ContextMenu) {
      this.menu = menu;
    }

    /**
     * Sets the new active store element if it exists in the store.
     * @param {HTMLElement} element Element to be activated.
     */
    setActive(element: HTMLElement): void {
      if (this.store.indexOf(element) !== -1) {
        this.active = element;
      }
    }

    /**
     * @return {HTMLElement} The currently active store element, if one exists.
     */
    getActive(): HTMLElement {
      return this.active;
    }

    /**
     * Returns next active element.
     * If store is empty returns null and also unsets active element.
     * If active is not set returns the first element of the store.
     * @return {HTMLElement} The next element if it exists.
     */
    next(): HTMLElement {
      let length = this.store.length;
      if (length === 0) {
        this.active = null;
        return null;
      }
      let index = this.store.indexOf(this.active);
      index = index === -1 ? 0 : (index < length - 1 ? index + 1 : 0);
      this.active = this.store[index];
      return this.active;
    }

    /**
     * Returns next active element.
     * If store is empty returns null and also unsets active element.
     * If active is not set returns the first element of the store.
     * @return {HTMLElement} The next element if it exists.
     */
    previous(): HTMLElement {
      let length = this.store.length;
      if (length === 0) {
        this.active = null;
        return null;
      }
      let last = length - 1;
      let index = this.store.indexOf(this.active);
      index = index === -1 ? last : (index === 0 ? last : index - 1);
      this.active = this.store[index];
      return this.active;
    }

    //// TODO: Implement with Promises?
    replace(oldElement: HTMLElement, newElement: HTMLElement): void {
      let index = this.store.indexOf(oldElement);
      index === -1 ? this.store.push(newElement) :
        this.store.splice(index, 1, newElement);
    }

    insert(element: HTMLElement) {
      this.insertAt(element, this.store.length);
    }

    insertAll(elements: HTMLElement[]) {
      this.removeAll();
      for (let i = elements.length - 1, element: HTMLElement;
           element = elements[i]; i--) {
        this.insertAt(element, 0);
      }
    }

    insertBefore(oldElement: HTMLElement, newElement: HTMLElement) {
      let index = this.store.indexOf(oldElement);
      index === -1 ? this.insertAt(newElement, 0) :
        this.insertAt(newElement, index);
      }

    insertAt(element: HTMLElement, position: number) {
      // Twice?
      this.addEvents(element);
      this.store.splice(position, 0, element);
    }

    remove(element: HTMLElement) {
      this.removeAt(this.store.indexOf(element));
    }

    removeAll() {
      while (this.store.length > 0) {
        this.removeAt(0);
      }
    }

    //// TODO: We somehow should put those in by taborder.  Maybe add a special
    // class name and do a document.  Would make it also easier to see if an
    // element has already events attached.
    //
    removeBefore(oldElement: HTMLElement) {
      this.removeAt(this.store.indexOf(oldElement) - 1);
    }

    // That's the actual removal function!
    removeAt(position: number) {
      if (position >= 0) {
        let old = this.store.splice(position, 1);
        if (old.length === 1) {
         this.removeEvents(old[0]);
        }
      }
    }

    insertTaborder() {
      this.store.forEach(x => x.setAttribute('tabindex', '0'));
    }

    removeTaborder() {
      this.store.forEach(x => x.setAttribute('tabindex', '-1'));
    }

    map: {[name: string]: EventListener} = {};
    counter: number = 0;

    //// TODO: Need to add touch event.
    //// TODO: Use prefixed attribute names with enum.
    private addEvents(element: HTMLElement) {
      if (element.hasAttribute('tabindex')) {
        element.setAttribute('oldtabindex', element.getAttribute('tabindex'));
      }
      element.setAttribute('tabindex', '0');

      if (element.hasAttribute('counter')) {
        return;
      }
      let menuFunc = this.menu.post.bind(this.menu);
      this.map['menuFunc' + this.counter] = menuFunc;
      element.addEventListener('contextmenu', menuFunc);

      let keydownFunc = this.keydown.bind(this);
      this.map['keydownFunc' + this.counter] = keydownFunc;
      element.addEventListener('keydown', keydownFunc);

      element.setAttribute('counter', this.counter.toString());
      this.counter++;
    }

    private removeEvents(element: HTMLElement) {
      if (element.hasAttribute('oldtabindex')) {
        element.setAttribute('tabindex', element.getAttribute('oldtabindex'));
        element.removeAttribute('oldtabindex');
      } else {
        element.removeAttribute('tabindex');
      }
      if (!element.hasAttribute('counter')) {
        return;
      }
      let counter = element.getAttribute('counter');
      let menuFunc = this.map['menuFunc' + counter];
      element.removeEventListener('contextmenu', menuFunc);
      let keydownFunc = this.map['keydownFunc' + counter];
      element.removeEventListener('keydown', keydownFunc);
      element.removeAttribute('counter');
    }

    private keydown(event: KeyboardEvent) {
      if (event.keyCode === KEY.SPACE) {
        this.menu.post(event);
      }
    }

  }

}
