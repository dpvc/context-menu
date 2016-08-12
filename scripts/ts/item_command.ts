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
 * @fileoverview Class of items that execute a command.
 *
 * @author volker.sorge@gmail.com (Volker Sorge)
 */

/// <reference path="abstract_item.ts" />
/// <reference path="menu_util.ts" />

namespace ContextMenu {

  export class Command extends AbstractItem {

    private command: Function = null;

    /**
     * @constructor
     * @extends {AbstractItem}
     * @param {Menu} menu The context menu or sub-menu the item belongs to.
     * @param {string} content The content of the menu item.
     * @param {Function} command The command to be executed on
     *     triggering the menu item.
     * @param {string=} id Optionally the id of the menu item.
     */
    constructor(menu: Menu, content: string, command: Function, id?: string) {
      super(menu, 'command', content, id);
      this.command = command;
    }

    /**
     * @override
     */
    executeAction() {
      try {
        this.command(MenuUtil.getActiveElement(this));
      } catch (e) {
        MenuUtil.error(e, 'Illegal command callback.');
      }
      MenuUtil.close(this);
    }

    /**
     * Parses a JSON respresentation of a command item.
     * @param {JSON} json The JSON object to parse.
     * @param {Menu} menu The menu the item is attached to.
     * @return {Command} The new command object.
     */
    static parse(
      {content: content, action: action, id: id}, menu: Menu): Command {
        return new Command(menu, content, action, id);
      }

  }
  
}
