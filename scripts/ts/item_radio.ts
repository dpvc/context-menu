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
 * @fileoverview Class of radio buttons.
 *
 * @author volker.sorge@gmail.com (Volker Sorge)
 */


/// <reference path="abstract_variable_item.ts" />

namespace ContextMenu {

  export class Radio extends AbstractVariableItem<string> {

    /**
     * @override
     */
    protected role = 'menuitemradio';

    /**
     * Parses a JSON respresentation of a radio item.
     * @param {JSON} json The JSON object to parse.
     * @param {Menu} menu The menu the item is attached to.
     * @return {Radio} The new radio object.
     */
    public static parse(
      {content: content, variable: variable, id: id}:
      {content: string, variable: string, id: string}, menu: Menu): Radio {
        return new Radio(menu, content, variable, id);
      }

    /**
     * @constructor
     * @extends {AbstractVariableItem}
     * @param {Menu} menu The context menu or sub-menu the item belongs to.
     * @param {string} content The content of the menu item.
     * @param {string} variable The variable that is changed.
     * @param {string=} id Optionally the id of the menu item.
     */
    constructor(menu: Menu, content: string, variable: string, id?: string) {
      super(menu, 'radio', content, id);
      this.variable = <Variable<string>>menu.getPool().lookup(variable);
      this.register();
    }

    /**
     * @override
     */
    public executeAction() {
      this.variable.setValue(this.getId());
      MenuUtil.close(this);
    }

   /**
    * @override
    */
    public generateSpan() {
      this.span = document.createElement('span');
      this.span.textContent = '\u2713';
      this.span.classList.add(HtmlClasses['MENURADIOCHECK']);
    }

    /**
     * @override
     * Toggles the aria checked attribute.
     */
    protected updateAria() {
      this.getHtml().setAttribute(
        'aria-checked',
        this.variable.getValue() === this.getId() ? 'true' : 'false'
      );
    }

    /**
     * @override
     * Toggles the checked tick.
     */
    protected updateSpan() {
      this.span.style.display =
        this.variable.getValue() === this.getId() ? '' : 'none';
    }

  }

}
