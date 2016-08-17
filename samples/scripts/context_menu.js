var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ContextMenu;
(function (ContextMenu) {
    var Variable = (function () {
        function Variable(name, value, callback) {
            this.name = '';
            this.items = [];
            this.name = name;
            this.value = value;
            this.callback = callback;
        }
        Variable.prototype.getName = function () {
            return this.name;
        };
        ;
        Variable.prototype.getValue = function () {
            return this.value;
        };
        ;
        Variable.prototype.setValue = function (value) {
            if (value === this.value) {
                return;
            }
            this.value = value;
            try {
                this.callback(value);
            }
            catch (e) {
                ContextMenu.MenuUtil.error(e, 'Command of variable ' + this.name + ' failed.');
            }
            this.update();
        };
        Variable.prototype.register = function (item) {
            if (this.items.indexOf(item) === -1) {
                this.items.push(item);
            }
        };
        Variable.prototype.unregister = function (item) {
            var index = this.items.indexOf(item);
            if (index !== -1) {
                this.items.splice(index, 1);
            }
        };
        Variable.prototype.update = function () {
            this.items.forEach(function (x) { return x.update(); });
        };
        Variable.prototype.registerCallback = function (func) {
            this.items.forEach(function (x) { return x.registerCallback(func); });
        };
        Variable.prototype.unregisterCallback = function (func) {
            this.items.forEach(function (x) { return x.unregisterCallback(func); });
        };
        return Variable;
    }());
    ContextMenu.Variable = Variable;
})(ContextMenu || (ContextMenu = {}));
var ContextMenu;
(function (ContextMenu) {
    var VariablePool = (function () {
        function VariablePool() {
            this.pool = {};
        }
        VariablePool.prototype.insert = function (variable) {
            this.pool[variable.getName()] = variable;
        };
        VariablePool.prototype.lookup = function (name) {
            return this.pool[name];
        };
        VariablePool.prototype.remove = function (name) {
            delete this.pool[name];
        };
        return VariablePool;
    }());
    ContextMenu.VariablePool = VariablePool;
})(ContextMenu || (ContextMenu = {}));
var ContextMenu;
(function (ContextMenu) {
    (function (KEY) {
        KEY[KEY["RETURN"] = 13] = "RETURN";
        KEY[KEY["ESCAPE"] = 27] = "ESCAPE";
        KEY[KEY["SPACE"] = 32] = "SPACE";
        KEY[KEY["LEFT"] = 37] = "LEFT";
        KEY[KEY["UP"] = 38] = "UP";
        KEY[KEY["RIGHT"] = 39] = "RIGHT";
        KEY[KEY["DOWN"] = 40] = "DOWN";
    })(ContextMenu.KEY || (ContextMenu.KEY = {}));
    var KEY = ContextMenu.KEY;
    ;
})(ContextMenu || (ContextMenu = {}));
var ContextMenu;
(function (ContextMenu) {
    ContextMenu.MOUSE = {
        CLICK: 'click',
        DBLCLICK: 'dblclick',
        DOWN: 'mousedown',
        UP: 'mouseup',
        OVER: 'mouseover',
        OUT: 'mouseout',
        MOVE: 'mousemove',
        SELECTSTART: 'selectstart',
        SELECTEND: 'selectend',
    };
})(ContextMenu || (ContextMenu = {}));
var ContextMenu;
(function (ContextMenu) {
    var AbstractNavigatable = (function () {
        function AbstractNavigatable() {
            this.bubble = false;
        }
        AbstractNavigatable.prototype.bubbleKey = function () {
            this.bubble = true;
        };
        AbstractNavigatable.prototype.keydown = function (event) {
            switch (event.keyCode) {
                case ContextMenu.KEY.ESCAPE:
                    this.escape(event);
                    break;
                case ContextMenu.KEY.RIGHT:
                    this.right(event);
                    break;
                case ContextMenu.KEY.LEFT:
                    this.left(event);
                    break;
                case ContextMenu.KEY.UP:
                    this.up(event);
                    break;
                case ContextMenu.KEY.DOWN:
                    this.down(event);
                    break;
                case ContextMenu.KEY.RETURN:
                case ContextMenu.KEY.SPACE:
                    this.space(event);
                    break;
                default:
                    return;
            }
            this.bubble ? this.bubble = false : this.stop(event);
        };
        ;
        AbstractNavigatable.prototype.escape = function (event) { };
        ;
        AbstractNavigatable.prototype.space = function (event) { };
        ;
        AbstractNavigatable.prototype.left = function (event) { };
        ;
        AbstractNavigatable.prototype.right = function (event) { };
        ;
        AbstractNavigatable.prototype.up = function (event) { };
        ;
        AbstractNavigatable.prototype.down = function (event) { };
        ;
        AbstractNavigatable.prototype.stop = function (event) {
            if (event) {
                event.stopPropagation();
                event.preventDefault();
                event.cancelBubble = true;
            }
        };
        ;
        AbstractNavigatable.prototype.mousedown = function (event) {
            return this.stop(event);
        };
        AbstractNavigatable.prototype.mouseup = function (event) {
            return this.stop(event);
        };
        AbstractNavigatable.prototype.mouseover = function (event) {
            return this.stop(event);
        };
        AbstractNavigatable.prototype.mouseout = function (event) {
            return this.stop(event);
        };
        AbstractNavigatable.prototype.click = function (event) {
            return this.stop(event);
        };
        AbstractNavigatable.prototype.addEvents = function (element) {
            element.addEventListener(ContextMenu.MOUSE.DOWN, this.mousedown.bind(this));
            element.addEventListener(ContextMenu.MOUSE.UP, this.mouseup.bind(this));
            element.addEventListener(ContextMenu.MOUSE.OVER, this.mouseover.bind(this));
            element.addEventListener(ContextMenu.MOUSE.OUT, this.mouseout.bind(this));
            element.addEventListener(ContextMenu.MOUSE.CLICK, this.click.bind(this));
            element.addEventListener('keydown', this.keydown.bind(this));
            element.addEventListener('dragstart', this.stop.bind(this));
            element.addEventListener('selectstart', this.stop.bind(this));
            element.addEventListener('contextmenu', this.stop.bind(this));
            element.addEventListener('dblclick', this.stop.bind(this));
        };
        return AbstractNavigatable;
    }());
    ContextMenu.AbstractNavigatable = AbstractNavigatable;
})(ContextMenu || (ContextMenu = {}));
var ContextMenu;
(function (ContextMenu) {
    var PREFIX = 'CtxtMenu';
    function prefix_(name) {
        return (PREFIX + '_' + name);
    }
    ;
    function prefixClass_(name) {
        return prefix_(name);
    }
    ;
    function prefixAttr_(name) {
        return prefix_(name);
    }
    ;
    ContextMenu.HtmlClasses = {
        ATTACHED: prefixClass_('Attached'),
        CONTEXTMENU: prefixClass_('ContextMenu'),
        MENU: prefixClass_('Menu'),
        MENUARROW: prefixClass_('MenuArrow'),
        MENUACTIVE: prefixClass_('MenuActive'),
        MENUCHECK: prefixClass_('MenuCheck'),
        MENUCLOSE: prefixClass_('MenuClose'),
        MENUDISABLED: prefixClass_('MenuDisabled'),
        MENUFRAME: prefixClass_('MenuFrame'),
        MENUITEM: prefixClass_('MenuItem'),
        MENULABEL: prefixClass_('MenuLabel'),
        MENURADIOCHECK: prefixClass_('MenuRadioCheck'),
        MENURULE: prefixClass_('MenuRule'),
        MOUSEPOST: prefixClass_('MousePost'),
        RTL: prefixClass_('RTL'),
        INFO: prefixClass_('Info'),
        INFOCLOSE: prefixClass_('InfoClose'),
        INFOCONTENT: prefixClass_('InfoContent'),
        INFOSIGNATURE: prefixClass_('InfoSignature'),
        INFOTITLE: prefixClass_('InfoTitle')
    };
    ContextMenu.HtmlAttrs = {
        COUNTER: prefixAttr_('Counter'),
        KEYDOWNFUNC: prefixAttr_('keydownFunc'),
        CONTEXTMENUFUNC: prefixAttr_('contextmenuFunc'),
        OLDTAB: prefixAttr_('Oldtabindex'),
        TOUCHFUNC: prefixAttr_('TouchFunc'),
    };
})(ContextMenu || (ContextMenu = {}));
var ContextMenu;
(function (ContextMenu) {
    var MenuElement = (function (_super) {
        __extends(MenuElement, _super);
        function MenuElement() {
            _super.apply(this, arguments);
        }
        MenuElement.prototype.addAttributes = function (attributes) {
            for (var attr in attributes) {
                this.html.setAttribute(attr, attributes[attr]);
            }
        };
        MenuElement.prototype.getHtml = function () {
            if (!this.html) {
                this.generateHtml();
            }
            return this.html;
        };
        MenuElement.prototype.setHtml = function (html) {
            this.html = html;
            this.addEvents(html);
        };
        MenuElement.prototype.generateHtml = function () {
            var html = document.createElement('div');
            html.classList.add(this.className);
            html.setAttribute('role', this.role);
            this.setHtml(html);
        };
        MenuElement.prototype.focus = function () {
            var html = this.getHtml();
            html.setAttribute('tabindex', '0');
            html.focus();
        };
        MenuElement.prototype.unfocus = function () {
            var html = this.getHtml();
            if (html.hasAttribute('tabindex')) {
                html.setAttribute('tabindex', '-1');
            }
            html.blur();
        };
        return MenuElement;
    }(ContextMenu.AbstractNavigatable));
    ContextMenu.MenuElement = MenuElement;
})(ContextMenu || (ContextMenu = {}));
var ContextMenu;
(function (ContextMenu) {
    var AbstractEntry = (function (_super) {
        __extends(AbstractEntry, _super);
        function AbstractEntry(menu, type) {
            _super.call(this);
            this.className = ContextMenu.HtmlClasses['MENUITEM'];
            this.role = 'menuitem';
            this.type = 'entry';
            this.hidden = false;
            this.menu = menu;
            this.type = type;
        }
        AbstractEntry.prototype.getMenu = function () {
            return this.menu;
        };
        AbstractEntry.prototype.setMenu = function (menu) {
            this.menu = menu;
        };
        AbstractEntry.prototype.getType = function () {
            return this.type;
        };
        AbstractEntry.prototype.hide = function () {
            this.hidden = true;
            this.menu.generateMenu();
        };
        AbstractEntry.prototype.show = function () {
            this.hidden = false;
            this.menu.generateMenu();
        };
        AbstractEntry.prototype.isHidden = function () {
            return this.hidden;
        };
        return AbstractEntry;
    }(ContextMenu.MenuElement));
    ContextMenu.AbstractEntry = AbstractEntry;
})(ContextMenu || (ContextMenu = {}));
var ContextMenu;
(function (ContextMenu) {
    var AbstractPostable = (function (_super) {
        __extends(AbstractPostable, _super);
        function AbstractPostable() {
            _super.apply(this, arguments);
            this.posted = false;
        }
        AbstractPostable.prototype.isPosted = function () {
            return this.posted;
        };
        AbstractPostable.prototype.post = function (x, y) {
            if (this.posted) {
                return;
            }
            if (typeof (x) !== 'undefined' && typeof (y) !== 'undefined') {
                this.getHtml().setAttribute('style', 'left: ' + x + 'px; top: ' + y + 'px;');
            }
            this.display();
            this.posted = true;
        };
        AbstractPostable.prototype.unpost = function () {
            if (!this.posted) {
                return;
            }
            var html = this.getHtml();
            if (html.parentNode) {
                html.parentNode.removeChild(html);
            }
            this.posted = false;
        };
        return AbstractPostable;
    }(ContextMenu.MenuElement));
    ContextMenu.AbstractPostable = AbstractPostable;
})(ContextMenu || (ContextMenu = {}));
var ContextMenu;
(function (ContextMenu) {
    var AbstractMenu = (function (_super) {
        __extends(AbstractMenu, _super);
        function AbstractMenu() {
            _super.apply(this, arguments);
            this.className = ContextMenu.HtmlClasses['CONTEXTMENU'];
            this.role = 'menu';
            this.items = [];
        }
        AbstractMenu.prototype.getItems = function () {
            return this.items;
        };
        ;
        AbstractMenu.prototype.getPool = function () {
            return this.variablePool;
        };
        ;
        AbstractMenu.prototype.getFocused = function () {
            return this.focused;
        };
        AbstractMenu.prototype.setFocused = function (item) {
            if (this.focused === item) {
                return;
            }
            if (!this.focused) {
                this.unfocus();
            }
            var old = this.focused;
            this.focused = item;
            if (old) {
                old.unfocus();
            }
        };
        AbstractMenu.prototype.up = function (event) {
            var items = this.getItems().filter(function (x) { return (x instanceof ContextMenu.AbstractItem) && (!x.isHidden()); });
            if (items.length === 0) {
                return;
            }
            if (!this.focused) {
                items[items.length - 1].focus();
                return;
            }
            var index = items.indexOf(this.focused);
            if (index === -1) {
                return;
            }
            index = index ? --index : items.length - 1;
            items[index].focus();
        };
        AbstractMenu.prototype.down = function (event) {
            var items = this.getItems().filter(function (x) { return (x instanceof ContextMenu.AbstractItem) && (!x.isHidden()); });
            if (items.length === 0) {
                return;
            }
            if (!this.focused) {
                items[0].focus();
                return;
            }
            var index = items.indexOf(this.focused);
            if (index === -1) {
                return;
            }
            index++;
            index = (index === items.length) ? 0 : index;
            items[index].focus();
        };
        AbstractMenu.prototype.generateHtml = function () {
            _super.prototype.generateHtml.call(this);
            this.generateMenu();
        };
        AbstractMenu.prototype.generateMenu = function () {
            var html = this.getHtml();
            html.classList.add(ContextMenu.HtmlClasses['MENU']);
            for (var i = 0, item = void 0; item = this.items[i]; i++) {
                if (!item.isHidden()) {
                    html.appendChild(item.getHtml());
                    continue;
                }
                var itemHtml = item.getHtml();
                if (itemHtml.parentNode) {
                    itemHtml.parentNode.removeChild(itemHtml);
                }
            }
        };
        AbstractMenu.prototype.unpostSubmenus = function () {
            var submenus = this.items.filter(function (x) { return x instanceof ContextMenu.Submenu; });
            for (var i = 0, submenu = void 0; submenu = submenus[i]; i++) {
                submenu.getSubmenu().unpost();
                if (submenu !== this.getFocused()) {
                    submenu.unfocus();
                }
            }
        };
        AbstractMenu.prototype.unpost = function () {
            _super.prototype.unpost.call(this);
            this.unpostSubmenus();
            this.setFocused(null);
        };
        AbstractMenu.prototype.find = function (id) {
            for (var _i = 0, _a = this.getItems(); _i < _a.length; _i++) {
                var item = _a[_i];
                if (item.getType() === 'rule') {
                    continue;
                }
                if (item.getId() === id) {
                    return item;
                }
                if (item.getType() === 'submenu') {
                    var result = item.getSubmenu().find(id);
                    if (result) {
                        return result;
                    }
                }
            }
            return null;
        };
        AbstractMenu.prototype.parseItems = function (items) {
            var _this = this;
            var hidden = items.map(function (x) { return [_this.parseItem.bind(_this)(x), x.hidden]; });
            hidden.forEach(function (x) { return x[1] && x[0].hide(); });
        };
        AbstractMenu.prototype.parseItem = function (item) {
            var parseMapping_ = {
                'checkbox': ContextMenu.Checkbox.parse,
                'command': ContextMenu.Command.parse,
                'label': ContextMenu.Label.parse,
                'radio': ContextMenu.Radio.parse,
                'rule': ContextMenu.Rule.parse,
                'submenu': ContextMenu.Submenu.parse
            };
            var func = parseMapping_[item['type']];
            if (func) {
                var menuItem = func(item, this);
                this.getItems().push(menuItem);
                if (item['disabled']) {
                    menuItem.disable();
                }
                return menuItem;
            }
        };
        return AbstractMenu;
    }(ContextMenu.AbstractPostable));
    ContextMenu.AbstractMenu = AbstractMenu;
})(ContextMenu || (ContextMenu = {}));
var ContextMenu;
(function (ContextMenu) {
    var MenuStore = (function () {
        function MenuStore(menu) {
            this.store = [];
            this.active = null;
            this.counter = 0;
            this.attachedClass = ContextMenu.HtmlClasses['ATTACHED'] + '_' +
                ContextMenu.MenuUtil.counter();
            this.taborder = true;
            this.attrMap = {};
            this.menu = menu;
        }
        MenuStore.prototype.setActive = function (element) {
            do {
                if (this.store.indexOf(element) !== -1) {
                    this.active = element;
                    break;
                }
                element = element.parentNode;
            } while (element);
        };
        MenuStore.prototype.getActive = function () {
            return this.active;
        };
        MenuStore.prototype.next = function () {
            var length = this.store.length;
            if (length === 0) {
                this.active = null;
                return null;
            }
            var index = this.store.indexOf(this.active);
            index = index === -1 ? 0 : (index < length - 1 ? index + 1 : 0);
            this.active = this.store[index];
            return this.active;
        };
        MenuStore.prototype.previous = function () {
            var length = this.store.length;
            if (length === 0) {
                this.active = null;
                return null;
            }
            var last = length - 1;
            var index = this.store.indexOf(this.active);
            index = index === -1 ? last : (index === 0 ? last : index - 1);
            this.active = this.store[index];
            return this.active;
        };
        MenuStore.prototype.clear = function () {
            this.remove(this.store);
        };
        MenuStore.prototype.insert = function (elementOrList) {
            var elements = elementOrList instanceof HTMLElement ?
                [elementOrList] : elementOrList;
            for (var i = 0, element = void 0; element = elements[i]; i++) {
                this.insertElement(element);
            }
            this.sort();
        };
        MenuStore.prototype.remove = function (elementOrList) {
            var elements = elementOrList instanceof HTMLElement ?
                [elementOrList] : elementOrList;
            for (var i = 0, element = void 0; element = elements[i]; i++) {
                this.removeElement(element);
            }
            this.sort();
        };
        MenuStore.prototype.inTaborder = function (flag) {
            if (this.taborder && !flag) {
                this.removeTaborder();
            }
            if (!this.taborder && flag) {
                this.insertTaborder();
            }
            this.taborder = flag;
        };
        MenuStore.prototype.insertTaborder = function () {
            if (this.taborder) {
                this.insertTaborder_();
            }
        };
        MenuStore.prototype.removeTaborder = function () {
            if (this.taborder) {
                this.removeTaborder_();
            }
        };
        MenuStore.prototype.insertElement = function (element) {
            if (element.classList.contains(this.attachedClass)) {
                return;
            }
            element.classList.add(this.attachedClass);
            if (this.taborder) {
                this.addTabindex(element);
            }
            this.addEvents(element);
        };
        MenuStore.prototype.removeElement = function (element) {
            if (!element.classList.contains(this.attachedClass)) {
                return;
            }
            element.classList.remove(this.attachedClass);
            if (this.taborder) {
                this.removeTabindex(element);
            }
            this.removeEvents(element);
        };
        MenuStore.prototype.sort = function () {
            var nodes = document.getElementsByClassName(this.attachedClass);
            this.store = [].slice.call(nodes);
        };
        MenuStore.prototype.insertTaborder_ = function () {
            this.store.forEach(function (x) { return x.setAttribute('tabindex', '0'); });
        };
        MenuStore.prototype.removeTaborder_ = function () {
            this.store.forEach(function (x) { return x.setAttribute('tabindex', '-1'); });
        };
        MenuStore.prototype.addTabindex = function (element) {
            if (element.hasAttribute('tabindex')) {
                element.setAttribute(ContextMenu.HtmlAttrs['OLDTAB'], element.getAttribute('tabindex'));
            }
            element.setAttribute('tabindex', '0');
        };
        MenuStore.prototype.removeTabindex = function (element) {
            if (element.hasAttribute(ContextMenu.HtmlAttrs['OLDTAB'])) {
                element.setAttribute('tabindex', element.getAttribute(ContextMenu.HtmlAttrs['OLDTAB']));
                element.removeAttribute(ContextMenu.HtmlAttrs['OLDTAB']);
            }
            else {
                element.removeAttribute('tabindex');
            }
        };
        MenuStore.prototype.addEvents = function (element) {
            if (element.hasAttribute(ContextMenu.HtmlAttrs['COUNTER'])) {
                return;
            }
            this.addEvent(element, 'contextmenu', this.menu.post.bind(this.menu));
            this.addEvent(element, 'keydown', this.keydown.bind(this));
            element.setAttribute(ContextMenu.HtmlAttrs['COUNTER'], this.counter.toString());
            this.counter++;
        };
        MenuStore.prototype.addEvent = function (element, name, func) {
            var attrName = ContextMenu.HtmlAttrs[name.toUpperCase() + 'FUNC'];
            this.attrMap[attrName + this.counter] = func;
            element.addEventListener(name, func);
        };
        MenuStore.prototype.removeEvents = function (element) {
            if (!element.hasAttribute(ContextMenu.HtmlAttrs['COUNTER'])) {
                return;
            }
            var counter = element.getAttribute(ContextMenu.HtmlAttrs['COUNTER']);
            this.removeEvent(element, 'contextmenu', counter);
            this.removeEvent(element, 'keydown', counter);
            element.removeAttribute(ContextMenu.HtmlAttrs['COUNTER']);
        };
        MenuStore.prototype.removeEvent = function (element, name, counter) {
            var attrName = ContextMenu.HtmlAttrs[name.toUpperCase() + 'FUNC'];
            var menuFunc = this.attrMap[attrName + counter];
            element.removeEventListener(name, menuFunc);
        };
        MenuStore.prototype.keydown = function (event) {
            if (event.keyCode === ContextMenu.KEY.SPACE) {
                this.menu.post(event);
            }
        };
        return MenuStore;
    }());
    ContextMenu.MenuStore = MenuStore;
})(ContextMenu || (ContextMenu = {}));
var ContextMenu;
(function (ContextMenu_1) {
    var ContextMenu = (function (_super) {
        __extends(ContextMenu, _super);
        function ContextMenu() {
            _super.call(this);
            this.moving = false;
            this.store_ = new ContextMenu_1.MenuStore(this);
            this.widgets = [];
            this.variablePool = new ContextMenu_1.VariablePool();
        }
        ContextMenu.parse = function (_a) {
            var menu = _a.menu;
            if (!menu) {
                ContextMenu_1.MenuUtil.error(null, 'Wrong JSON format for menu.');
                return;
            }
            var pool = menu.pool, items = menu.items, id = menu.id;
            var ctxtMenu = new ContextMenu();
            pool.forEach(ctxtMenu.parseVariable.bind(ctxtMenu));
            ctxtMenu.parseItems(items);
            return ctxtMenu;
        };
        ContextMenu.prototype.generateHtml = function () {
            _super.prototype.generateHtml.call(this);
            this.frame = document.createElement('div');
            this.frame.classList.add(ContextMenu_1.HtmlClasses['MENUFRAME']);
            var styleString = 'left: 0px; top: 0px; z-index: 200; width: 100%; ' +
                'height: 100%; border: 0px; padding: 0px; margin: 0px;';
            this.frame.setAttribute('style', 'position: absolute; ' + styleString);
            var innerDiv = document.createElement('div');
            innerDiv.setAttribute('style', 'position: fixed; ' + styleString);
            this.frame.appendChild(innerDiv);
            innerDiv.addEventListener('mousedown', function (event) {
                this.unpost();
                this.unpostWidgets();
                this.stop(event);
            }.bind(this));
        };
        ContextMenu.prototype.display = function () {
            document.body.appendChild(this.frame);
            this.frame.appendChild(this.getHtml());
            this.focus();
        };
        ContextMenu.prototype.escape = function (event) {
            this.unpost();
            this.unpostWidgets();
        };
        ContextMenu.prototype.unpost = function () {
            _super.prototype.unpost.call(this);
            if (this.widgets.length > 0) {
                return;
            }
            this.frame.parentNode.removeChild(this.frame);
            var store = this.getStore();
            if (!this.moving) {
                store.insertTaborder();
            }
            store.getActive().focus();
        };
        ContextMenu.prototype.left = function (event) {
            this.move_(this.store_.previous());
        };
        ContextMenu.prototype.right = function (event) {
            this.move_(this.store_.next());
        };
        ContextMenu.prototype.getFrame = function () {
            return this.frame;
        };
        ContextMenu.prototype.getStore = function () {
            return this.store_;
        };
        ContextMenu.prototype.post = function (numberOrEvent, isY) {
            if (typeof (isY) !== 'undefined') {
                if (!this.moving) {
                    this.getStore().removeTaborder();
                }
                _super.prototype.post.call(this, numberOrEvent, isY);
                return;
            }
            var node;
            var x;
            var y;
            var keydown = false;
            if (numberOrEvent instanceof Event) {
                var event_1 = numberOrEvent;
                x = event_1['pageX'], y = event_1['pageY'];
                if (!x && !y && event_1['clientX']) {
                    x = event_1.clientX + document.body.scrollLeft +
                        document.documentElement.scrollLeft;
                    y = event_1.clientY + document.body.scrollTop +
                        document.documentElement.scrollTop;
                }
                node = event_1.target;
                keydown = event_1.type === 'keydown';
                this.stop(event_1);
            }
            else {
                node = numberOrEvent;
            }
            this.getStore().setActive(node);
            this.anchor = this.getStore().getActive();
            if ((keydown || (!x && !y)) && node) {
                var offsetX = window.pageXOffset || document.documentElement.scrollLeft;
                var offsetY = window.pageYOffset || document.documentElement.scrollTop;
                var rect_1 = node.getBoundingClientRect();
                x = (rect_1.right + rect_1.left) / 2 + offsetX;
                y = (rect_1.bottom + rect_1.top) / 2 + offsetY;
            }
            var rect = node.getBoundingClientRect();
            var menu = this.getHtml();
            var margin = 5;
            if (x + menu.offsetWidth > document.body.offsetWidth - margin) {
                x = document.body.offsetWidth - menu.offsetWidth - margin;
            }
            this.post(x, y);
        };
        ContextMenu.prototype.registerWidget = function (widget) {
            this.widgets.push(widget);
        };
        ContextMenu.prototype.unregisterWidget = function (widget) {
            var index = this.widgets.indexOf(widget);
            if (index > -1) {
                this.widgets.splice(index, 1);
            }
            if (this.widgets.length === 0) {
                this.unpost();
            }
        };
        ContextMenu.prototype.unpostWidgets = function () {
            this.widgets.forEach(function (x) { return x.unpost(); });
        };
        ContextMenu.prototype.move_ = function (next) {
            if (this.anchor && next !== this.anchor) {
                this.moving = true;
                this.unpost();
                this.post(next);
                this.moving = false;
            }
        };
        ContextMenu.prototype.parseVariable = function (_a) {
            var name = _a.name, value = _a.value, action = _a.action;
            this.getPool().insert(new ContextMenu_1.Variable(name, value, action));
        };
        return ContextMenu;
    }(ContextMenu_1.AbstractMenu));
    ContextMenu_1.ContextMenu = ContextMenu;
})(ContextMenu || (ContextMenu = {}));
var ContextMenu;
(function (ContextMenu) {
    var SubMenu = (function (_super) {
        __extends(SubMenu, _super);
        function SubMenu(anchor) {
            _super.call(this);
            this.anchor = anchor;
            this.variablePool = this.anchor.getMenu().getPool();
            this.setBaseMenu();
        }
        SubMenu.parse = function (_a, anchor) {
            var items = _a.items, id = _a.id;
            var submenu = new SubMenu(anchor);
            submenu.parseItems(items);
            return submenu;
        };
        SubMenu.prototype.getAnchor = function () {
            return this.anchor;
        };
        SubMenu.prototype.post = function () {
            if (!this.anchor.getMenu().isPosted()) {
                return;
            }
            var mobileFlag = false;
            var rtlFlag = false;
            var margin = 5;
            var parent = this.anchor.getHtml();
            var menu = this.getHtml();
            var base = this.baseMenu.getFrame();
            var side = 'left', mw = parent.offsetWidth;
            var x = (mobileFlag ? 30 : mw - 2);
            var y = 0;
            while (parent && parent !== base) {
                x += parent.offsetLeft;
                y += parent.offsetTop;
                parent = parent.parentNode;
            }
            if (!mobileFlag) {
                if ((rtlFlag && x - mw - menu.offsetWidth > margin) ||
                    (!rtlFlag && x + menu.offsetWidth >
                        document.body.offsetWidth - margin)) {
                    side = 'right';
                    x = Math.max(margin, x - mw - menu.offsetWidth + 6);
                }
            }
            _super.prototype.post.call(this, x, y);
        };
        SubMenu.prototype.display = function () {
            this.baseMenu.getFrame().appendChild(this.getHtml());
        };
        SubMenu.prototype.setBaseMenu = function () {
            var menu = this;
            do {
                menu = menu.anchor.getMenu();
            } while (menu instanceof SubMenu);
            this.baseMenu = menu;
        };
        return SubMenu;
    }(ContextMenu.AbstractMenu));
    ContextMenu.SubMenu = SubMenu;
})(ContextMenu || (ContextMenu = {}));
var ContextMenu;
(function (ContextMenu) {
    var MenuUtil;
    (function (MenuUtil) {
        function close(item) {
            var menu = item.getMenu();
            if (menu instanceof ContextMenu.SubMenu) {
                menu.baseMenu.unpost();
            }
            else {
                menu.unpost();
            }
        }
        MenuUtil.close = close;
        function getActiveElement(item) {
            var menu = item.getMenu();
            var baseMenu = menu instanceof ContextMenu.SubMenu ?
                menu.baseMenu : menu;
            return baseMenu.getStore().getActive();
        }
        MenuUtil.getActiveElement = getActiveElement;
        function error(error, msg) {
            console.log('ContextMenu Error: ' + msg);
        }
        MenuUtil.error = error;
        function counter() {
            return count++;
        }
        MenuUtil.counter = counter;
        var count = 0;
    })(MenuUtil = ContextMenu.MenuUtil || (ContextMenu.MenuUtil = {}));
})(ContextMenu || (ContextMenu = {}));
var ContextMenu;
(function (ContextMenu) {
    var AbstractItem = (function (_super) {
        __extends(AbstractItem, _super);
        function AbstractItem(menu, type, content, id) {
            _super.call(this, menu, type);
            this.disabled = false;
            this.callbacks = [];
            this.content = content;
            this.id = id ? id : content;
        }
        AbstractItem.prototype.getContent = function () {
            return this.content;
        };
        AbstractItem.prototype.getId = function () {
            return this.id;
        };
        AbstractItem.prototype.press = function () {
            if (!this.disabled) {
                this.executeAction();
                this.executeCallbacks_();
            }
        };
        AbstractItem.prototype.executeAction = function () { };
        AbstractItem.prototype.registerCallback = function (func) {
            if (this.callbacks.indexOf(func) === -1) {
                this.callbacks.push(func);
            }
        };
        AbstractItem.prototype.unregisterCallback = function (func) {
            var index = this.callbacks.indexOf(func);
            if (index !== -1) {
                this.callbacks.splice(index, 1);
            }
        };
        AbstractItem.prototype.mousedown = function (event) {
            this.press();
            this.stop(event);
        };
        AbstractItem.prototype.mouseover = function (event) {
            this.focus();
            this.stop(event);
        };
        AbstractItem.prototype.mouseout = function (event) {
            this.deactivate();
            this.stop(event);
        };
        AbstractItem.prototype.generateHtml = function () {
            _super.prototype.generateHtml.call(this);
            var html = this.getHtml();
            html.setAttribute('aria-disabled', 'false');
            html.textContent = this.content;
        };
        AbstractItem.prototype.activate = function () {
            if (!this.disabled) {
                this.getHtml().classList.add(ContextMenu.HtmlClasses['MENUACTIVE']);
            }
        };
        AbstractItem.prototype.deactivate = function () {
            this.getHtml().classList.remove(ContextMenu.HtmlClasses['MENUACTIVE']);
        };
        AbstractItem.prototype.focus = function () {
            this.getMenu().setFocused(this);
            _super.prototype.focus.call(this);
            this.activate();
        };
        AbstractItem.prototype.unfocus = function () {
            this.deactivate();
            _super.prototype.unfocus.call(this);
        };
        AbstractItem.prototype.escape = function (event) {
            ContextMenu.MenuUtil.close(this);
        };
        AbstractItem.prototype.up = function (event) {
            this.getMenu().up(event);
        };
        AbstractItem.prototype.down = function (event) {
            this.getMenu().down(event);
        };
        AbstractItem.prototype.left = function (event) {
            if (this.getMenu() instanceof ContextMenu.ContextMenu) {
                this.getMenu().left(event);
                return;
            }
            var menu = this.getMenu();
            menu.setFocused(null);
            menu.getAnchor().focus();
        };
        AbstractItem.prototype.right = function (event) {
            this.getMenu().right(event);
        };
        AbstractItem.prototype.space = function (event) {
            this.press();
        };
        AbstractItem.prototype.disable = function () {
            this.disabled = true;
            var html = this.getHtml();
            html.classList.add(ContextMenu.HtmlClasses['MENUDISABLED']);
            html.setAttribute('aria-disabled', 'true');
        };
        AbstractItem.prototype.enable = function () {
            this.disabled = false;
            var html = this.getHtml();
            html.classList.remove(ContextMenu.HtmlClasses['MENUDISABLED']);
            html.removeAttribute('aria-disabled');
        };
        AbstractItem.prototype.executeCallbacks_ = function () {
            var active = ContextMenu.MenuUtil.getActiveElement(this);
            for (var _i = 0, _a = this.callbacks; _i < _a.length; _i++) {
                var func = _a[_i];
                try {
                    func(event);
                }
                catch (e) {
                    ContextMenu.MenuUtil.error(e, 'Callback for menu entry ' + this.getId() +
                        ' failed.');
                }
            }
        };
        return AbstractItem;
    }(ContextMenu.AbstractEntry));
    ContextMenu.AbstractItem = AbstractItem;
})(ContextMenu || (ContextMenu = {}));
var ContextMenu;
(function (ContextMenu) {
    var CssStyles;
    (function (CssStyles) {
        function makeClass_(name) {
            return '.' + (ContextMenu.HtmlClasses[name] || name);
        }
        var INFO_STYLES = {};
        INFO_STYLES[makeClass_('INFOCLOSE')] = '{' +
            '  top:.2em; right:.2em;' +
            '}',
            INFO_STYLES[makeClass_('INFOCONTENT')] = '{' +
                '  overflow:auto; text-align:left; font-size:80%;' +
                '  padding:.4em .6em; border:1px inset; margin:1em 0px;' +
                '  max-height:20em; max-width:30em; background-color:#EEEEEE;' +
                '  white-space:normal;' +
                '}',
            INFO_STYLES[makeClass_('INFO') + makeClass_('MOUSEPOST')] = '{' +
                'outline:none;' +
                '}',
            INFO_STYLES[makeClass_('INFO')] = '{' +
                '  position:fixed; left:50%; width:auto; text-align:center;' +
                '  border:3px outset; padding:1em 2em; background-color:#DDDDDD;' +
                '  color:black;' +
                '  cursor:default; font-family:message-box; font-size:120%;' +
                '  font-style:normal; text-indent:0; text-transform:none;' +
                '  line-height:normal; letter-spacing:normal; word-spacing:normal;' +
                '  word-wrap:normal; white-space:nowrap; float:none; z-index:201;' +
                '  border-radius: 15px;                     /* Opera 10.5 and IE9 */' +
                '  -webkit-border-radius:15px;               /* Safari and Chrome */' +
                '  -moz-border-radius:15px;                  /* Firefox */' +
                '  -khtml-border-radius:15px;                /* Konqueror */' +
                '  box-shadow:0px 10px 20px #808080;         /* Opera 10.5 and IE9 */' +
                '  -webkit-box-shadow:0px 10px 20px #808080; /* Safari 3 & Chrome */' +
                '  -moz-box-shadow:0px 10px 20px #808080;    /* Forefox 3.5 */' +
                '  -khtml-box-shadow:0px 10px 20px #808080;  /* Konqueror */' +
                '  filter:progid:DXImageTransform.Microsoft.dropshadow(OffX=2,' +
                ' OffY=2, Color="gray", Positive="true"); /* IE */' +
                '}';
        var MENU_STYLES = {};
        MENU_STYLES[makeClass_('MENU')] = '{' +
            '  position:absolute;' +
            '  background-color:white;' +
            '  color:black;' +
            '  width:auto; padding:5px 0px;' +
            '  border:1px solid #CCCCCC; margin:0; cursor:default;' +
            '  font: menu; text-align:left; text-indent:0; text-transform:none;' +
            '  line-height:normal; letter-spacing:normal; word-spacing:normal;' +
            '  word-wrap:normal; white-space:nowrap; float:none; z-index:201;' +
            '  border-radius: 5px;                     /* Opera 10.5 and IE9 */' +
            '  -webkit-border-radius: 5px;             /* Safari and Chrome */' +
            '  -moz-border-radius: 5px;                /* Firefox */' +
            '  -khtml-border-radius: 5px;              /* Konqueror */' +
            '  box-shadow:0px 10px 20px #808080;         /* Opera 10.5 and IE9 */' +
            '  -webkit-box-shadow:0px 10px 20px #808080; /* Safari 3 & Chrome */' +
            '  -moz-box-shadow:0px 10px 20px #808080;    /* Forefox 3.5 */' +
            '  -khtml-box-shadow:0px 10px 20px #808080;  /* Konqueror */' +
            '}',
            MENU_STYLES[makeClass_('MENUITEM')] = '{' +
                '  padding: 1px 2em;' +
                '  background:transparent;' +
                '}',
            MENU_STYLES[makeClass_('MENUARROW')] = '{' +
                '  position:absolute; right:.5em; padding-top:.25em; color:#666666;' +
                '  font-family: null; font-size: .75em' +
                '}',
            MENU_STYLES[makeClass_('MENUACTIVE') + ' ' + makeClass_('MENUARROW')] =
                '{color:white}',
            MENU_STYLES[makeClass_('MENUARROW') + makeClass_('RTL')] =
                '{left:.5em; right:auto}',
            MENU_STYLES[makeClass_('MENUCHECK')] = '{' +
                '  position:absolute; left:.7em;' +
                '  font-family: null' +
                '}',
            MENU_STYLES[makeClass_('MENUCHECK') + makeClass_('RTL')] =
                '{ right:.7em; left:auto }',
            MENU_STYLES[makeClass_('MENURADIOCHECK')] = '{' +
                '  position:absolute; left: .7em;' +
                '}',
            MENU_STYLES[makeClass_('MENURADIOCHECK') + makeClass_('RTL')] = '{' +
                '  right: .7em; left:auto' +
                '}',
            MENU_STYLES[makeClass_('MENULABEL')] = '{' +
                '  padding: 1px 2em 3px 1.33em;' +
                '  font-style:italic' +
                '}',
            MENU_STYLES[makeClass_('MENURULE')] = '{' +
                '  border-top: 1px solid #DDDDDD;' +
                '  margin: 4px 3px;' +
                '}',
            MENU_STYLES[makeClass_('MENUDISABLED')] = '{' +
                '  color:GrayText' +
                '}',
            MENU_STYLES[makeClass_('MENUACTIVE')] = '{' +
                '  background-color: #606872;' +
                '  color: white;' +
                '}',
            MENU_STYLES[makeClass_('MENUDISABLED') + ':focus'] = '{' +
                '  background-color: #E8E8E8' +
                '}',
            MENU_STYLES[makeClass_('MENULABEL') + ':focus'] = '{' +
                '  background-color: #E8E8E8' +
                '}',
            MENU_STYLES[makeClass_('CONTEXTMENU') + ':focus'] = '{' +
                '  outline:none' +
                '}',
            MENU_STYLES[makeClass_('CONTEXTMENU') + ' ' +
                makeClass_('MENUITEM') + ':focus'] = '{' +
                '  outline:none' +
                '}',
            MENU_STYLES[makeClass_('MENU') + ' ' + makeClass_('MENUCLOSE')] = '{' +
                '  top:-10px; left:-10px' +
                '}';
        var CLOSE_ICON_STYLES = {};
        CLOSE_ICON_STYLES[makeClass_('MENUCLOSE')] = '{' +
            '  position:absolute;' +
            '  cursor:pointer;' +
            '  display:inline-block;' +
            '  border:2px solid #AAA;' +
            '  border-radius:18px;' +
            '  -webkit-border-radius: 18px;             /* Safari and Chrome */' +
            '  -moz-border-radius: 18px;                /* Firefox */' +
            '  -khtml-border-radius: 18px;              /* Konqueror */' +
            '  font-family: "Courier New", Courier;' +
            '  font-size:24px;' +
            '  color:#F0F0F0' +
            '}',
            CLOSE_ICON_STYLES[makeClass_('MENUCLOSE') + ' span'] = '{' +
                '  display:block; background-color:#AAA; border:1.5px solid;' +
                '  border-radius:18px;' +
                '  -webkit-border-radius: 18px;             /* Safari and Chrome */' +
                '  -moz-border-radius: 18px;                /* Firefox */' +
                '  -khtml-border-radius: 18px;              /* Konqueror */' +
                '  line-height:0;' +
                '  padding:8px 0 6px     /* may need to be browser-specific */' +
                '}',
            CLOSE_ICON_STYLES[makeClass_('MENUCLOSE') + ':hover'] = '{' +
                '  color:white!important;' +
                '  border:2px solid #CCC!important' +
                '}',
            CLOSE_ICON_STYLES[makeClass_('MENUCLOSE') + ':hover span'] = '{' +
                '  background-color:#CCC!important' +
                '}',
            CLOSE_ICON_STYLES[makeClass_('MENUCLOSE') + ':hover:focus'] = '{' +
                '  outline:none' +
                '}';
        var INFO_ADDED = false;
        var MENU_ADDED = false;
        var CLOSE_ICON_ADDED = false;
        function addMenuStyles(opt_document) {
            if (MENU_ADDED) {
                return;
            }
            addStyles_(MENU_STYLES, opt_document);
            MENU_ADDED = true;
            addCloseIconStyles_(opt_document);
        }
        CssStyles.addMenuStyles = addMenuStyles;
        function addInfoStyles(opt_document) {
            if (INFO_ADDED) {
                return;
            }
            addStyles_(INFO_STYLES, opt_document);
            INFO_ADDED = true;
            addCloseIconStyles_(opt_document);
        }
        CssStyles.addInfoStyles = addInfoStyles;
        function addCloseIconStyles_(opt_document) {
            if (CLOSE_ICON_ADDED) {
                return;
            }
            addStyles_(CLOSE_ICON_STYLES, opt_document);
            CLOSE_ICON_ADDED = true;
        }
        function addStyles_(styles, opt_document) {
            var doc = opt_document || document;
            var element = doc.createElement('style');
            element.type = 'text/css';
            var inner = '';
            for (var style in styles) {
                inner += style;
                inner += ' ';
                inner += styles[style];
                inner += '\n';
            }
            element.innerHTML = inner;
            doc.head.appendChild(element);
        }
    })(CssStyles = ContextMenu.CssStyles || (ContextMenu.CssStyles = {}));
})(ContextMenu || (ContextMenu = {}));
var ContextMenu;
(function (ContextMenu) {
    var CloseButton = (function (_super) {
        __extends(CloseButton, _super);
        function CloseButton(element) {
            _super.call(this);
            this.className = ContextMenu.HtmlClasses['MENUCLOSE'];
            this.role = 'button';
            this.element = element;
        }
        CloseButton.prototype.generateHtml = function () {
            var html = document.createElement('span');
            html.classList.add(this.className);
            html.setAttribute('role', this.role);
            html.setAttribute('tabindex', '0');
            var content = document.createElement('span');
            content.textContent = '\u00D7';
            html.appendChild(content);
            this.setHtml(html);
        };
        CloseButton.prototype.display = function () { };
        ;
        CloseButton.prototype.unpost = function () {
            _super.prototype.unpost.call(this);
            this.element.unpost();
        };
        CloseButton.prototype.keydown = function (event) {
            this.bubbleKey();
            _super.prototype.keydown.call(this, event);
        };
        CloseButton.prototype.space = function (event) {
            this.unpost();
            this.stop(event);
        };
        CloseButton.prototype.mousedown = function (event) {
            this.unpost();
            this.stop(event);
        };
        return CloseButton;
    }(ContextMenu.AbstractPostable));
    ContextMenu.CloseButton = CloseButton;
})(ContextMenu || (ContextMenu = {}));
var ContextMenu;
(function (ContextMenu) {
    var Info = (function (_super) {
        __extends(Info, _super);
        function Info(title, content, signature) {
            _super.call(this);
            this.className = ContextMenu.HtmlClasses['INFO'];
            this.role = 'dialog';
            this.title = '';
            this.signature = '';
            this.contentDiv = this.generateContent();
            this.close = this.generateClose();
            this.title = title;
            this.content = content || function () { return ''; };
            this.signature = signature;
        }
        Info.prototype.attachMenu = function (menu) {
            this.menu = menu;
        };
        Info.prototype.getHtml = function () {
            var html = _super.prototype.getHtml.call(this);
            return html;
        };
        Info.prototype.generateHtml = function () {
            _super.prototype.generateHtml.call(this);
            var html = this.getHtml();
            html.appendChild(this.generateTitle());
            html.appendChild(this.contentDiv);
            html.appendChild(this.generateSignature());
            html.appendChild(this.close.getHtml());
            html.setAttribute('tabindex', '0');
        };
        Info.prototype.post = function () {
            _super.prototype.post.call(this);
            var doc = document.documentElement;
            var html = this.getHtml();
            var H = window.innerHeight || doc.clientHeight || doc.scrollHeight || 0;
            var x = Math.floor((-html.offsetWidth) / 2);
            var y = Math.floor((H - html.offsetHeight) / 3);
            html.setAttribute('style', 'margin-left: ' + x + 'px; top: ' + y + 'px;');
            if (window.event instanceof MouseEvent) {
                html.classList.add(ContextMenu.HtmlClasses['MOUSEPOST']);
            }
            html.focus();
        };
        Info.prototype.display = function () {
            this.menu.registerWidget(this);
            this.contentDiv.innerHTML = this.content();
            var html = this.menu.getHtml();
            html.parentNode.removeChild(html);
            this.menu.getFrame().appendChild(this.getHtml());
        };
        Info.prototype.click = function (event) { };
        Info.prototype.keydown = function (event) {
            this.bubbleKey();
            _super.prototype.keydown.call(this, event);
        };
        Info.prototype.escape = function (event) {
            this.unpost();
        };
        Info.prototype.unpost = function () {
            _super.prototype.unpost.call(this);
            this.getHtml().classList.remove(ContextMenu.HtmlClasses['MOUSEPOST']);
            this.menu.unregisterWidget(this);
        };
        Info.prototype.generateClose = function () {
            var close = new ContextMenu.CloseButton(this);
            var html = close.getHtml();
            html.classList.add(ContextMenu.HtmlClasses['INFOCLOSE']);
            html.setAttribute('aria-label', 'Close Dialog Box');
            return close;
        };
        Info.prototype.generateTitle = function () {
            var span = document.createElement('span');
            span.innerHTML = this.title;
            span.classList.add(ContextMenu.HtmlClasses['INFOTITLE']);
            return span;
        };
        Info.prototype.generateContent = function () {
            var div = document.createElement('div');
            div.classList.add(ContextMenu.HtmlClasses['INFOCONTENT']);
            div.setAttribute('tabindex', '0');
            return div;
        };
        Info.prototype.generateSignature = function () {
            var span = document.createElement('span');
            span.innerHTML = this.signature;
            span.classList.add(ContextMenu.HtmlClasses['INFOSIGNATURE']);
            return span;
        };
        return Info;
    }(ContextMenu.AbstractPostable));
    ContextMenu.Info = Info;
})(ContextMenu || (ContextMenu = {}));
var ContextMenu;
(function (ContextMenu) {
    var Checkbox = (function (_super) {
        __extends(Checkbox, _super);
        function Checkbox(menu, content, variable, id) {
            _super.call(this, menu, 'checkbox', content, id);
            this.role = 'menuitemcheckbox';
            this.variable = menu.getPool().lookup(variable);
            this.register();
        }
        Checkbox.parse = function (_a, menu) {
            var content = _a.content, variable = _a.variable, id = _a.id;
            return new Checkbox(menu, content, variable, id);
        };
        Checkbox.prototype.executeAction = function () {
            this.variable.setValue(!this.variable.getValue());
            ContextMenu.MenuUtil.close(this);
        };
        Checkbox.prototype.generateHtml = function () {
            _super.prototype.generateHtml.call(this);
            var html = this.getHtml();
            this.span = document.createElement('span');
            this.span.textContent = '\u2713';
            this.span.classList.add(ContextMenu.HtmlClasses['MENUCHECK']);
            html.appendChild(this.span);
            this.update();
        };
        Checkbox.prototype.register = function () {
            this.variable.register(this);
        };
        Checkbox.prototype.unregister = function () {
            this.variable.unregister(this);
        };
        Checkbox.prototype.update = function () {
            var disp = this.variable.getValue() ? '' : 'none';
            this.span.style.display = this.variable.getValue() ? '' : 'none';
        };
        return Checkbox;
    }(ContextMenu.AbstractItem));
    ContextMenu.Checkbox = Checkbox;
})(ContextMenu || (ContextMenu = {}));
var ContextMenu;
(function (ContextMenu) {
    var Command = (function (_super) {
        __extends(Command, _super);
        function Command(menu, content, command, id) {
            _super.call(this, menu, 'command', content, id);
            this.command = null;
            this.command = command;
        }
        Command.parse = function (_a, menu) {
            var content = _a.content, action = _a.action, id = _a.id;
            return new Command(menu, content, action, id);
        };
        Command.prototype.executeAction = function () {
            try {
                this.command(ContextMenu.MenuUtil.getActiveElement(this));
            }
            catch (e) {
                ContextMenu.MenuUtil.error(e, 'Illegal command callback.');
            }
            ContextMenu.MenuUtil.close(this);
        };
        return Command;
    }(ContextMenu.AbstractItem));
    ContextMenu.Command = Command;
})(ContextMenu || (ContextMenu = {}));
var ContextMenu;
(function (ContextMenu) {
    var Label = (function (_super) {
        __extends(Label, _super);
        function Label(menu, content, id) {
            _super.call(this, menu, 'label', content, id);
        }
        Label.parse = function (_a, menu) {
            var content = _a.content, id = _a.id;
            return new Label(menu, content, id);
        };
        Label.prototype.generateHtml = function () {
            _super.prototype.generateHtml.call(this);
            var html = this.getHtml();
            html.classList.add(ContextMenu.HtmlClasses['MENULABEL']);
        };
        return Label;
    }(ContextMenu.AbstractItem));
    ContextMenu.Label = Label;
})(ContextMenu || (ContextMenu = {}));
var ContextMenu;
(function (ContextMenu) {
    var Radio = (function (_super) {
        __extends(Radio, _super);
        function Radio(menu, content, variable, id) {
            _super.call(this, menu, 'radio', content, id);
            this.role = 'menuitemradio';
            this.variable = menu.getPool().lookup(variable);
            this.register();
        }
        Radio.parse = function (_a, menu) {
            var content = _a.content, variable = _a.variable, id = _a.id;
            return new Radio(menu, content, variable, id);
        };
        Radio.prototype.executeAction = function () {
            var oldValue = this.variable.getValue();
            if (oldValue === this.getId()) {
                return;
            }
            this.variable.setValue(this.getId());
            ContextMenu.MenuUtil.close(this);
        };
        Radio.prototype.generateHtml = function () {
            _super.prototype.generateHtml.call(this);
            var html = this.getHtml();
            this.span = document.createElement('span');
            this.span.textContent = '\u2713';
            this.span.classList.add(ContextMenu.HtmlClasses['MENURADIOCHECK']);
            html.appendChild(this.span);
            this.update();
        };
        Radio.prototype.register = function () {
            this.variable.register(this);
        };
        Radio.prototype.unregister = function () {
            this.variable.unregister(this);
        };
        Radio.prototype.update = function () {
            this.updateAria();
            this.updateSpan();
        };
        Radio.prototype.updateAria = function () {
            this.getHtml().setAttribute('aria-checked', this.variable.getValue() === this.getId() ? 'true' : 'false');
        };
        Radio.prototype.updateSpan = function () {
            this.span.style.display =
                this.variable.getValue() === this.getId() ? '' : 'none';
        };
        return Radio;
    }(ContextMenu.AbstractItem));
    ContextMenu.Radio = Radio;
})(ContextMenu || (ContextMenu = {}));
var ContextMenu;
(function (ContextMenu) {
    var Rule = (function (_super) {
        __extends(Rule, _super);
        function Rule(menu) {
            _super.call(this, menu, 'rule');
            this.className = ContextMenu.HtmlClasses['MENUITEM'];
            this.role = 'separator';
        }
        Rule.parse = function (_a, menu) {
            return new Rule(menu);
        };
        Rule.prototype.generateHtml = function () {
            _super.prototype.generateHtml.call(this);
            var html = this.getHtml();
            html.classList.add(ContextMenu.HtmlClasses['MENURULE']);
            html.setAttribute('aria-orientation', 'vertical');
        };
        Rule.prototype.addEvents = function (element) { };
        return Rule;
    }(ContextMenu.AbstractEntry));
    ContextMenu.Rule = Rule;
})(ContextMenu || (ContextMenu = {}));
var ContextMenu;
(function (ContextMenu) {
    var Submenu = (function (_super) {
        __extends(Submenu, _super);
        function Submenu(menu, content, id) {
            _super.call(this, menu, 'submenu', content, id);
            this.submenu = null;
        }
        Submenu.parse = function (_a, menu) {
            var content = _a.content, submenu = _a.menu, id = _a.id;
            var item = new Submenu(menu, content, id);
            item.setSubmenu(ContextMenu.SubMenu.parse(submenu, item));
            return item;
        };
        Submenu.prototype.setSubmenu = function (menu) {
            this.submenu = menu;
        };
        Submenu.prototype.getSubmenu = function () {
            return this.submenu;
        };
        Submenu.prototype.mouseover = function (event) {
            this.focus();
            this.stop(event);
        };
        Submenu.prototype.mouseout = function (event) {
            this.stop(event);
        };
        Submenu.prototype.unfocus = function () {
            if (!this.submenu.isPosted()) {
                _super.prototype.unfocus.call(this);
                return;
            }
            if (this.getMenu().getFocused() !== this) {
                _super.prototype.unfocus.call(this);
                this.getMenu().unpostSubmenus();
                return;
            }
            this.getHtml().setAttribute('tabindex', '-1');
            this.getHtml().blur();
        };
        Submenu.prototype.focus = function () {
            _super.prototype.focus.call(this);
            if (!this.submenu.isPosted() && !this.disabled) {
                this.submenu.post();
            }
        };
        Submenu.prototype.executeAction = function () {
            this.submenu.isPosted() ? this.submenu.unpost() : this.submenu.post();
        };
        Submenu.prototype.generateHtml = function () {
            _super.prototype.generateHtml.call(this);
            var html = this.getHtml();
            this.span = document.createElement('span');
            this.span.textContent = '\u25BA';
            this.span.classList.add(ContextMenu.HtmlClasses['MENUARROW']);
            html.appendChild(this.span);
            html.setAttribute('aria-haspopup', 'true');
        };
        Submenu.prototype.left = function (event) {
            if (this.getSubmenu().isPosted()) {
                this.getSubmenu().unpost();
            }
            else {
                _super.prototype.left.call(this, event);
            }
        };
        Submenu.prototype.right = function (event) {
            if (!this.getSubmenu().isPosted()) {
                this.getSubmenu().post();
            }
            else {
                this.getSubmenu().down(event);
            }
        };
        return Submenu;
    }(ContextMenu.AbstractItem));
    ContextMenu.Submenu = Submenu;
})(ContextMenu || (ContextMenu = {}));
var ContextMenu;
(function (ContextMenu) {
    var Popup = (function (_super) {
        __extends(Popup, _super);
        function Popup(title, content) {
            _super.call(this);
            this.title = '';
            this.window = null;
            this.windowList = [];
            this.mobileFlag = false;
            this.active = null;
            this.title = title;
            this.content = content || function () { return ''; };
        }
        Popup.prototype.attachMenu = function (menu) {
            this.menu = menu;
        };
        Popup.prototype.post = function () {
            this.display();
        };
        Popup.prototype.display = function () {
            this.active = this.menu.getStore().getActive();
            var settings = [];
            for (var setting in Popup.popupSettings) {
                settings.push(setting + '=' + Popup.popupSettings[setting]);
            }
            this.window = window.open('', '_blank', settings.join(','));
            this.windowList.push(this.window);
            var doc = this.window.document;
            if (this.mobileFlag) {
                doc.open();
                doc.write('<html><head><meta name="viewport" ' +
                    'content="width=device-width, initial-scale=1.0" /><title>' +
                    this.title +
                    '</title></head><body style="font-size:85%">');
                doc.write('<pre>' + this.generateContent() + '</pre>');
                doc.write('<hr><input type="button" value="' +
                    'Close' + '" onclick="window.close()" />');
                doc.write('</body></html>');
                doc.close();
            }
            else {
                doc.open();
                doc.write('<html><head><title>' + this.title +
                    '</title></head><body style="font-size:85%">');
                doc.write('<table><tr><td><pre>' + this.generateContent() +
                    '</pre></td></tr></table>');
                doc.write('</body></html>');
                doc.close();
                setTimeout(this.resize.bind(this), 50);
            }
        };
        Popup.prototype.unpost = function () {
            this.windowList.forEach(function (x) { return x.close(); });
            this.window = null;
        };
        Popup.prototype.generateContent = function () {
            return this.content(this.active);
        };
        Popup.prototype.resize = function () {
            var table = this.window.document.body.firstChild;
            var H = (this.window.outerHeight - this.window.innerHeight) || 30;
            var W = (this.window.outerWidth - this.window.innerWidth) || 30;
            W = Math.max(140, Math.min(Math.floor(.5 * screen.width), table.offsetWidth + W + 25));
            H = Math.max(40, Math.min(Math.floor(.5 * screen.height), table.offsetHeight + H + 25));
            this.window.resizeTo(W, H);
            var bb = this.active.getBoundingClientRect();
            if (bb) {
                var x = Math.max(0, Math.min(bb.right - Math.floor(W / 2), screen.width - W - 20));
                var y = Math.max(0, Math.min(bb.bottom - Math.floor(H / 2), screen.height - H - 20));
                this.window.moveTo(x, y);
            }
            this.active = null;
        };
        Popup.popupSettings = {
            status: 'no',
            toolbar: 'no',
            locationbar: 'no',
            menubar: 'no',
            directories: 'no',
            personalbar: 'no',
            resizable: 'yes',
            scrollbars: 'yes',
            width: 400,
            height: 300,
            left: Math.round((screen.width - 400) / 2),
            top: Math.round((screen.height - 300) / 3)
        };
        return Popup;
    }(ContextMenu.AbstractPostable));
    ContextMenu.Popup = Popup;
})(ContextMenu || (ContextMenu = {}));
var ContextMenu;
(function (ContextMenu) {
    ContextMenu.TOUCH = {
        START: 'touchstart',
        MOVE: 'touchmove',
        END: 'touchend',
        CANCEL: 'touchcancel'
    };
})(ContextMenu || (ContextMenu = {}));
//# sourceMappingURL=http://cdn.rawgit.com/zorkow/context-menu/make-samples/samples/scripts/context_menu.js.map