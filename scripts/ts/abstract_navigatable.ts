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
 * @fileoverview Abstract class of navigatable menu elements.
 *
 * @author volker.sorge@gmail.com (Volker Sorge)
 */

/// <reference path="navigatable.ts" />
/// <reference path="mouse_navigatable.ts" />

namespace ContextMenu {

  export class AbstractNavigatable implements Navigatable, MouseNavigatable {

    /**
     * @override
     */
    keydown(event: KeyboardEvent): void {
      switch (event.keyCode) {
      case KEY.ESCAPE:
        this.escape(event);
        break;
      case KEY.RIGHT:
        this.right(event);
        break;
      case KEY.LEFT:
        this.left(event);
        break;
      case KEY.UP:
        this.up(event);
        break;
      case KEY.DOWN:
        this.down(event);
        break;
      case KEY.RETURN:
      case KEY.SPACE:
        this.space(event);
        break;
      default:
        return;
      }
      return this.stop(event);
    };

    /**
     * @override
     */
    escape(event: KeyboardEvent): void {};

    /**
     * @override
     */
    space(event: KeyboardEvent): void {};

    /**
     * @override
     */
    left(event: KeyboardEvent): void {};

    /**
     * @override
     */
    right(event: KeyboardEvent): void {};

    /**
     * @override
     */
    up(event: KeyboardEvent): void {};

    /**
     * @override
     */
    down(event: KeyboardEvent): void {};


    /**
     * Stops event propagation and bubbling.
     * @param {Event} event The keyboard event that fired.
     */
    protected stop(event: Event): void {
      if (event) {
        event.stopPropagation();
        event.cancelBubble = true;
      }
    };


    /**
     * @override
     */
    mousedown(event: MouseEvent): void {
      return this.stop(event);
    }

    /**
     * @override
     */
    mouseup(event: MouseEvent): void {
      return this.stop(event);
    }

    /**
     * @override
     */
    mouseover(event: MouseEvent): void {
      return this.stop(event);
    }

    /**
     * @override
     */
    mouseout(event: MouseEvent): void {
      return this.stop(event);
    }

    /**
     * @override
     */
    click(event: MouseEvent): void {
      return this.stop(event);
    }

    public addEvents(element: HTMLElement): void {
      element.addEventListener(MOUSE.DOWN, this.mousedown.bind(this));
      element.addEventListener(MOUSE.UP, this.mouseup.bind(this));
      element.addEventListener(MOUSE.OVER, this.mouseover.bind(this));
      element.addEventListener(MOUSE.OUT, this.mouseout.bind(this));
      element.addEventListener(MOUSE.CLICK, this.click.bind(this));
      element.addEventListener('keydown', this.keydown.bind(this));
    }
  }

}
