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
 * @fileoverview Class of sub menus.
 *
 * @author volker.sorge@gmail.com (Volker Sorge)
 */

/// <reference path="abstract_menu.ts" />


namespace ContextMenu {

  export class SubMenu extends AbstractMenu {

    /**
     * @type {ContextMenu}
     */
    public baseMenu: ContextMenu;

    private anchor: Submenu;

    /**
     * Parses a JSON respresentation of a submenu.
     * @param {JSON} json The JSON object to parse.
     * @param {Submenu} anchor The anchor item the submenu is attached to.
     * @return {SubMenu} The new submenu object.
     */
    public static parse(
      {items: items, id: id}: {items: any[], id: string},
      anchor: Submenu): SubMenu {
        let submenu = new SubMenu(anchor);
        submenu.parseItems(items);
        return submenu;
      }

    /**
     * @constructor
     * @extends {AbstractMenu}
     * @param {Submenu} anchor The item in the parent menu triggering this
     *     submenu.
     */
    constructor(anchor: Submenu) {
      super();
      this.anchor = anchor;
      this.variablePool = this.anchor.getMenu().getPool();
      this.setBaseMenu();
    }

    /**
     * @return {Submenu} The submenu item that anchors this popdown submenu to
     *     its parent.
     */
    public getAnchor(): Submenu {
      return this.anchor;
    }

    /**
     * @override
     */
    public post() {
      if (!this.anchor.getMenu().isPosted()) {
        return;
      }
      //// TODO: These are currently ignored!
      let mobileFlag = false;
      let rtlFlag = false;

      let margin = 5;
      let parent = this.anchor.getHtml();
      let menu = this.getHtml();
      let base = this.baseMenu.getFrame();
      let side = 'left', mw = parent.offsetWidth;
      let x = (mobileFlag ? 30 : mw - 2);
      let y = 0;
      while (parent && parent !== base) {
        x += parent.offsetLeft;
        y += parent.offsetTop;
        parent = <HTMLElement>parent.parentNode;
      }
      if (!mobileFlag) {
        if ((rtlFlag && x - mw - menu.offsetWidth > margin) ||
            (!rtlFlag && x + menu.offsetWidth >
             document.body.offsetWidth - margin)) {
          side = 'right';
          x = Math.max(margin, x - mw - menu.offsetWidth + 6);
        }
      }

      // Is the following useful?
      //
      // // if (!isPC) {
      // //   // in case these ever get implemented
      // //   menu.style["borderRadiusTop"+side] = 0;       // Opera 10.5
      // //   menu.style["WebkitBorderRadiusTop"+side] = 0; // Safari and Chrome
      // //   menu.style["MozBorderRadiusTop"+side] = 0;    // Firefox
      // //   menu.style["KhtmlBorderRadiusTop"+side] = 0;  // Konqueror
      // // }

      super.post(x, y);
    }

    /**
     * @override
     */
    protected display() {
      this.baseMenu.getFrame().appendChild(this.getHtml());
    }

    /**
     * Computes the topmost menu this submenu belongs to.
     */
    private setBaseMenu() {
      //// TODO: Make this type safer!
      let menu: any = this;
      do {
        menu = menu.anchor.getMenu();
      } while (menu instanceof SubMenu);
      this.baseMenu = <ContextMenu>menu;
    }

  }

}
