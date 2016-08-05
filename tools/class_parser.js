var ts = require('typescript');

classParser = {};

//
s// Some general utility files.
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
  return sources.find(x => x.fileName.match(name));
};

//
// Building UML Diagrams with dot
//

classParser.store = {};

classParser.WITH_METHODS = false;

classParser.ast = function(ast) {
  ast.statements.forEach(classParser.node, 0);
};

classParser.node = function(node, indentation) {
  var indent = new Array(indentation).join(' ');
  var store = {attrs: [], mods: []};
  switch(node.kind) {
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
    if (node.body) {
      node.body.statements.forEach(function(x) {
        classParser.node(x, indentation + 1);});
    }
    return;
  }
  classParser.block(node, store);
  classParser.store[node.name.text] = store;
};

classParser.block = function(expr, store) {
  classParser.heritageClauses(expr.heritageClauses, store);
  classParser.modifiers(expr.modifiers, store);
  if (classParser.WITH_METHODS) {
    classParser.methods(expr.members, store);
  }
};

classParser.methods = function(members, store) {
  store.members = [];
  var valid = ['MethodDeclaration', 'MethodSignature', 'EnumMember'].
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
  sources.forEach(x => classParser.ast(x));
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
  var files = fs.readdirSync(directory).filter(x => x.match(/\.ts$/));
  var sources = files.map(source => ts.createSourceFile(
    directory + source, fs.readFileSync(directory + source).toString(),
    ts.ScriptTarget.ES6, true));
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

classParser.rewriteInterface = function(interface) {
  var string = interface.text;
  var headerComments = ts.getJsDocComments(interface.statements[0], interface);
  var header = classParser.combinePartialContent(string, headerComments, '\n\n');
  var base = interface.statements[0].body.statements[0];
  var name = base.name.text;
  var store = {};
  classParser.heritageClauses(base.heritageClauses, store);

  var interfaceStr = '';
  interfaceStr += '/**\n * @interface\n';
  store.extends.forEach(x => interfaceStr += ' * @extends {' + x + '}\n');
  interfaceStr += ' */\n';
  interfaceStr += name + ' = function() {}\n';
  classParser.methods(base.members, store);
  // console.log(interfaceStr);
  // console.log(store);
  // base.members.forEach(x => console.log(ts.getJsDocComments(x, interface)));
  var methods = base.members.map(
    x => classParser.interfaceMethod(x, name, string, interface));
  return header + '\n\n\n\n' + interfaceStr + '\n\n' + methods.join('\n\n');
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
// Rewriting transpiled Javascript files.
//
classParser.readJSFile = function(filename) {
  var source = ts.createSourceFile(filename, fs.readFileSync(filename).toString(),
                                   ts.ScriptTarget.ES5, true);
  return source;
};

classParser.cleanJSFile = function(js) {
  // remove entry.statements[0].declarationList.declarations;
  // beginning is file header comment.
  //
  // Fileoverview comment:
  // classParser.getPartialContent(entry.text, entry.statements[1].jsDocComment);
  //
  // Get the expression alone.
  // classParser.getPartialContent(entry.text, entry.statements[2].expression.expression);
  // 
  // Iterate entry.statements[2].expression.expression.expression.body.statements[0].declarationList.declarations[0].initializer.expression.expression.body.statements
  // from position 1 to last - 1.
  //
  
  
};
