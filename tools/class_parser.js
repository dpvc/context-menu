classParser = {};
classParser.extern = {};

classParser.extern.fs = require('fs');
classParser.extern.path = require('path');
classParser.extern.ts = require('typescript');

var ts = classParser.extern.ts;
var fs = classParser.extern.fs;
var path = classParser.extern.path;

//
// Some general utility files.
//
classParser.properties = function(expr) {
  for (var i in expr) {
    if (expr.hasOwnProperty(i)) {
      console.log(i);
    }
  }
};

classParser.filter = function(sources, name) {
  var kind = ts.SyntaxKind[name];
  return sources.filter(x => x.statements[0].body.statements[0].kind === kind);
};

classParser.findSource = function(sources, name) {
  return sources.find(x => x.baseName === name);
};

//
// Building UML Diagrams with dot
//

classParser.store = {};

classParser.sources = {};

classParser.WITH_METHODS = false;

/**
 *
 * @param {Source} source Source file.
 */
classParser.source = function(source) {
  classParser.sources[source.baseName] = [];
  source.statements.forEach(
    x => classParser.node(x, 0, source));
};

classParser.node = function(node, indentation, source) {
  var indent = new Array(indentation).join(' ');
  var store = {attrs: [], mods: [], node: node};
  switch (node.kind) {
  case ts.SyntaxKind['InterfaceDeclaration']:
    store.type = 'interface';
    store.attrs.push('color=green');
    break;
  case ts.SyntaxKind['ClassDeclaration']:
    store.type = 'class';
    break;
  case ts.SyntaxKind['EnumDeclaration']:
    store.type = 'enum';
    store.attrs.push('color=magenta');
    break;
  default:
    let name = classParser.getEnumName(source, node);
    if (name) {
      store.type = 'enum';
      store.attrs.push('color=magenta');
      classParser.store[name] = store;
      classParser.sources[source.baseName].push(store);
      classParser.modifiers(
        node.declarationList.declarations[0].mofifiers, store);
      store.extends = [];
      store.implements = [];
      if (classParser.WITH_METHODS) {
        classParser.methods(
          node.declarationList.declarations[0].initializer.properties, store);
      }
      return;
    }
    if (node.body) {
      node.body.statements.forEach(function(x) {
        classParser.node(x, indentation + 1, source);});
    }
    return;
  }
  classParser.block(node, store);
  classParser.store[node.name.text] = store;
  classParser.sources[source.baseName].push(store);
};

// Begin: Getting enums

classParser.getEnumName = function(source, statement) {
  let comments = ts.getJsDocComments(statement, source);
  if (!comments || !comments.length) {
    return '';
  }
  if (comments.some(x => classParser.jsDocIsEnum(source.text, x))) {
    return statement.declarationList.declarations[0].name.text;
  }
  return '';
};

classParser.getEnum = function(source, statement) {
  let comments = ts.getJsDocComments(statement, source);
  if (!comments || !comments.length) {
    return '';
  }
  if (comments.some(x => classParser.jsDocIsEnum(source.text, x))) {
    return classParser.assembleEnum(source.text, statement, comments);
  }
  return '';
};

classParser.assembleEnum = function(str, statement, comments) {
  let comment = classParser.combinePartialContent(str, comments);
  let decl = statement.declarationList.declarations[0];
  let name = decl.name.text;
  let map = classParser.getPartialContent(str, decl.initializer);
  return comment + '\n' + name + ' = ' + map;
};

classParser.jsDocIsEnum = function(str, doc) {
  let jsdoc = ts.parseIsolatedJSDocComment(
    str, doc.pos, doc.end - doc.pos);
  if (!jsdoc || !jsdoc.jsDocComment || !jsdoc.jsDocComment.tags) {
    return;
  }
  return jsdoc.jsDocComment.tags.some(x => x.tagName.text === 'enum');
};

// End: Getting enums

classParser.block = function(expr, store) {
  classParser.heritageClauses(expr.heritageClauses, store);
  classParser.modifiers(expr.modifiers, store);
  if (classParser.WITH_METHODS) {
    classParser.methods(expr.members, store);
  }
};

classParser.methods = function(members, store) {
  store.members = [];
  var valid = ['MethodDeclaration', 'MethodSignature',
               'EnumMember', 'PropertyAssignment'].
        map(x => ts.SyntaxKind[x]);
  for (var i = 0, member; member = members[i]; i++) {
    if (valid.indexOf(member.kind) === -1) {
      continue;
    }
    let meth = {name: member.name.text, attrs: [], mods: []};
    classParser.modifiers(member.modifiers, meth);
    store.members.push(meth);
  }
};


classParser.modifiers = function(modifiers, store) {
  store.modifiers = [];
  if (!modifiers) {
    return;
  }
  modifiers.forEach(x => store.modifiers.push(x.kind));
};

classParser.heritageClauses = function(clauses, store) {
  store.extends = [];
  store.implements = [];
  if (!clauses) {
    return;
  }
  for (var i = 0, clause; clause = clauses[i]; i++) {
    if (ts.SyntaxKind['ImplementsKeyword'] === clause.token) {
      clause.types.forEach(function(type) {
        store.implements.push(type.expression.text);
      });
    }
    if (ts.SyntaxKind['ExtendsKeyword'] === clause.token) {
      clause.types.forEach(function(type) {
        store.extends.push(type.expression.text);
      });
    }
  }
};

classParser.program = function(sources) {
  classParser.store = {};
  classParser.sources = {};
  sources.forEach(x => classParser.source(x));
};

classParser.dotFile = function(filename) {
  fs.writeFileSync(filename, classParser.dotOutput());
};

classParser.dotOutput = function() {
  let result = 'digraph structs {\n' +
        '  edge [dir=back];\n' +
        '  node [shape=record];\n';
  for (let id in classParser.store) {
    let value = classParser.store[id];
    classParser.outputModifiers(value.modifiers, value);
    result += id + ' [';
    result += value.attrs.length ? value.attrs.join(', ') + ', ' : '';
    result += 'label="{ ';
    result += value.mods.length ? value.mods.join(' ') + ' ' : '';
    result += value.type + ' ' + id + ' | ';
    if (classParser.WITH_METHODS) {
      result += value.members.map(classParser.outputMethod).join('\\n');
    }
    result += '}"];\n';
    value.extends.forEach(x => result += x + ' -> ' + id +
                          '[label="extends"]\n');
    value.implements.forEach(x => result += x + ' -> ' + id +
                             '[label="implements"]\n');
  }
  result += '}\n';
  return result;
};

classParser.outputMethod = function(method) {
  classParser.outputModifiers(method.modifiers, method);
  return (method.mods.length ? method.mods.join(' ') + ' ' : '') + method.name;
};

classParser.outputModifiers = function(modifiers, store) {
  for (var i = 0, modifier; modifier = modifiers[i]; i++) {
    switch (modifier) {
    case ts.SyntaxKind['ExportKeyword']:
      break;
    case ts.SyntaxKind['AbstractKeyword']:
      store.attrs.push('color=blue');
      store.mods.push('abstract');
      break;
    case ts.SyntaxKind['PrivateKeyword']:
      store.attrs.push('color=red');
      store.mods.push('abstract');
      break;
    case ts.SyntaxKind['ProtectedKeyword']:
      store.mods.push('protected');
      break;
    case ts.SyntaxKind['StaticKeyword']:
      store.mods.push('static');
      break;
    default:
      break;
    }
  }
};

classParser.methodGraph = function(directory, output) {
  classParser.WITH_METHODS = true;
  classParser.transform(directory, output);
};

classParser.classGraph = function(directory, output) {
  classParser.WITH_METHODS = false;
  classParser.transform(directory, output);
};

classParser.transform = function(directory, output) {
  var sources = classParser.readDirectory(directory, 'ts');
  classParser.program(sources);
  classParser.dotFile(output);
};

// Current test directory.
// var directory = '/home/sorge/git/context-menu/scripts/ts/';


//
// The following code rewrites a Typescript interface spec into a closure style
// interface spec. This is useful for JSDoc generation and maybe later for
// closure compilation.
//
////TODO: Insert namespace prefix.

classParser.rewriteInterfaceFile = function(file) {
  var headerComments = ts.getJsDocComments(file.statements[0], file);
  var header = classParser.combinePartialContent(file.text, headerComments, '\n\n');

  ////TODO:  Here we have to search for the correct interface first!
  var base = file.statements[0].body.statements[0];
  var interfaceStr = classParser.rewriteInterface(base, file);
  return header + '\n\n\n\n' + interfaceStr;
};
  
classParser.rewriteInterface = function(interface, file) {
  var name = interface.name.text;
  console.log(name);
  var store = {};
  classParser.heritageClauses(interface.heritageClauses, store);
  console.log(store);

  var interfaceStr = '';
  interfaceStr += '/**\n * @interface\n';
  store.extends.forEach(x => interfaceStr += ' * @extends {' + x + '}\n');
  interfaceStr += ' */\n';
  interfaceStr += name + ' = function() {}\n';
  classParser.methods(interface.members, store);
  console.log(store.members);
  var methods = interface.members.map(
    x => classParser.interfaceMethod(x, name, file.text, file));
  return interfaceStr + '\n\n' + methods.join('\n\n');
};

classParser.interfaceMethod = function(method, name, string, interface) {
  var jsdoc = classParser.combinePartialContent(
    string, ts.getJsDocComments(method, interface));
  var methodStr = jsdoc ? jsdoc + '\n' : '';
  methodStr += name + '.prototype.' + method.name.text;
  methodStr += ' = function() {};\n';
  return methodStr;
};

classParser.combinePartialContent = function(str, positions, opt_separator) {
  var separator = (typeof opt_separator === 'undefined') ?
        '\n' : opt_separator;
  return positions.length ?
    positions.map(
      pos => classParser.getPartialContent(str, pos)).join(separator) :
    '';
};

classParser.getPartialContent = function(str, position) {
  return str.slice(position.pos, position.end);
};


//
// Reading files.
//
classParser.extMap = {
  'ts': 'ES6',
  'js': 'ES5'
};

classParser.readFile = function(filename, ext) {
  var lang = classParser.extMap[ext];
  var file = ts.createSourceFile(filename, fs.readFileSync(filename).toString(),
                                 ts.ScriptTarget[lang], true);
  file.baseName = path.basename(filename, '.' + ext);
  return file;
};

classParser.readDirectory = function(directory, ext) {
  var files = fs.readdirSync(directory).
        filter(x => x.match(RegExp('.' + ext + '$')));
  return files.map(x => classParser.readFile(directory + x, ext));
};

//
// Rewriting transpiled Javascript files.
// NOTE: Needs info from store, i.e., ts files need to be parsed first!
//
classParser.cleanJSFile = function(js) {
  return js.statements.length === 2 ?
    classParser.cleanJSFile2(js) :
    classParser.cleanJSFile3(js);
};

classParser.cleanJSFile3 = function(js) {
  // Top level comment
  let file = [];
  let comment = ts.getJsDocComments(js.statements[0].declarationList, js);
  file = file.concat(comment);
  let refText = classParser.getPartialContent(js.text, js.statements[1]);
  let overview = js.statements[1].jsDocComment;
  file.push(overview);
  let references = classParser.getPartialContent(
    js.text,
    {pos: overview.end,
     end: js.statements[1].declarationList.declarations[0].pos});
  let newline = references.lastIndexOf('\n');
  if (newline !== -1) {
    //references = references.slice(0, newline + 1);
    file.push({pos: overview.end, end: overview.end + newline + 1});
  }
  let expression = js.statements[2].expression.expression.expression.
        body.statements[0].declarationList.declarations[0].initializer.
        expression.expression.body.statements;
  // The constructor computation. Can be very fragile!
  let constructor = expression[1];
  if (ts.getJsDocComments(constructor, js)) {
    file = file.concat(expression);
    return classParser.combinePartialContent(js.text, file);
  }
  var commentStr = '\n\n';
  var store = classParser.store[constructor.name.text];
  commentStr += '/**\n * @constructor\n';
  store.extends.forEach(x => commentStr += ' * @extends {' + x + '}\n');
  store.implements.forEach(x => commentStr += ' * @implements {' + x + '}\n');
  commentStr += ' */\n';
  file.push(expression[0]);
  var start = classParser.combinePartialContent(js.text, file);
  var end = classParser.combinePartialContent(js.text, expression.slice(1));
  return start + commentStr + end;
};


classParser.cleanJSFile2 = function(js) {
  // Top level comment
  let file = [];
  let comment = classParser.getPartialContent(
    js.text, js.statements[0]);
  let newline = comment.lastIndexOf('\n');
  if (newline !== -1) {
    file.push({pos: 0, end: newline + 1});
  }
  let expression = js.statements[1].expression.expression.expression.
        body.statements[0].declarationList.declarations[0].initializer.
        expression.expression.body.statements;
  // The constructor computation. Can be very fragile!
  let constructor = expression[0];
  if (ts.getJsDocComments(constructor, js)) {
    file = file.concat(expression);
    return classParser.combinePartialContent(js.text, file);
  }
  var commentStr = '\n\n';
  var store = classParser.store[constructor.name.text];
  commentStr += '/**\n * @constructor\n';
  store.extends.forEach(x => commentStr += ' * @extends {' + x + '}\n');
  store.implements.forEach(x => commentStr += ' * @implements {' + x + '}\n');
  commentStr += ' */\n';
  //file.push(expression[0]);
  var start = classParser.combinePartialContent(js.text, file);
  var end = classParser.combinePartialContent(js.text, expression.slice(0));
  return start + commentStr + end;
};


// Generate JSDoc with proper enums and interface handling.
//
// Parse .ts sources.
// Find all interfaces and enums.
//
// Parse .js and rewrite sources.
// Add
//
// What if we have a real typescript enum?
// 
// Some issues:
//
// - JSDoc includes the JS sources, which we want to replace by .ts source
// files.
// - Links into the sources will be wrong but we will ignore that for now
//

classParser.enums;

classParser.makeJSDoc = function(tsDir, jsDir, outDir) {
  classParser.enums = '';
  var tsFiles = classParser.readDirectory(tsDir, 'ts');
  var jsFiles = classParser.readDirectory(jsDir, 'js');
  var cleanJS = {};
  classParser.program(tsFiles);
  for (var i = 0, file; file = jsFiles[i]; i++) {
    try {
      cleanJS[file.baseName] = classParser.cleanJSFile(file);
    } catch (e) {
      cleanJS[file.baseName] =
        classParser.addInterfacesEnums(
          classParser.findSource(tsFiles, file.baseName),
          file.baseName);
    }
    var dir = outDir + file.baseName + '.js';
    fs.writeFileSync(dir, cleanJS[file.baseName]);
  }
  //return cleanJS;
};

classParser.addInterfacesEnums = function(src, name) {
  var elements = classParser.sources[name];
  var file = '';
  for (var i = 0, element; element = elements[i]; i++) {
    switch (element.type) {
    case 'enum':
      let enumString = classParser.getPartialContent(src.text, element.node);
      file += element.kind === ts.SyntaxKind['EnumDeclaration'] ?
        classParser.rewriteEnum(element.node, src) :
        enumString;
      break;
    case 'interface':
      file += classParser.rewriteInterface(element.node, src);
      break;
    default:
      break;
    }
  }
  return file;
};

classParser.rewriteEnum = function(node, src) {
  return '';
};


//console.log('loaded');
//console.log(ts)
