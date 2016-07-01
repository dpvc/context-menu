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
 * @fileoverview Generic class for keeping track of all menu variables.
 *
 * @author volker.sorge@gmail.com (Volker Sorge)
 */

/// <reference path="variable.ts" />

namespace ContextMenu {

  export class VariablePool<T> {

    private pool: {[name: string]: Variable<T>} = {};

    constructor() { }

    /**
     * Inserts a new variable into the pool.
     * @param {Variable<T>} variable The new variable.
     */
    insert(variable: Variable<T>) {
      this.pool[variable.getName()] = variable;
    }


    /**
     * Lookup a variable in the pool. Returns undefined if the variable does not
     * exist.
     * @param {string} name The name of the variable.
     * @return {?T} The value of the variable.
     */
    lookup(name: string) {
      let variable = this.pool[name];
      return variable ? variable.getValue() : variable;
    }


    /**
     * Removes the variable from the pool.
     * @param {name} name The name of the variable.
     */
    remove(name: string) {
      delete this.pool[name];
    }

  }

}
