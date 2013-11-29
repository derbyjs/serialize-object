exports.instance = serializeInstance;
exports.value = serializeValue;

function serializeInstance(instance) {
  // Map each argument into its string representation
  var args = [];
  for (var i = arguments.length; i-- > 1;) {
    var arg = serializeValue(arguments[i]);
    args.unshift(arg);
  }
  // Remove trailing null values, assuming they are optional
  for (var i = args.length; i--;) {
    var arg = args[i];
    if (arg !== 'void 0' && arg !== 'null') break;
    args.pop();
  }
  return 'new ' + instance.module + '.' + instance.type + '(' + args.join(', ') + ')';
}

function serializeValue(input) {
  if (input && input.serialize) {
    return input.serialize();

  } else if (typeof input == 'undefined') {
    return 'void 0';

  } else if (input === null) {
    return 'null';

  } else if (typeof input === 'string') {
    return formatString(input);

  } else if (typeof input === 'number' || typeof input === 'boolean') {
    return input + '';

  } else if (Array.isArray(input)) {
    var items = [];
    for (var i = 0; i < input.length; i++) {
      var value = serializeValue(input[i]);
      items.push(value);
    }
    return '[' + items.join(', ') + ']';

  } else if (typeof input == 'object') {
    var items = [];
    for (var key in input) {
      var value = serializeValue(input[key]);
      items.push(formatString(key) + ': ' + value);
    }
    return '{' + items.join(', ') + '}';
  }
}
function formatString(value) {
  var escaped = value
    .replace(/'/g, '\\\'')
    .replace(/\r?\n/g, '\\n');
  return '\'' + escaped + '\'';
}
