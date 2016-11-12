Expression = InputDef / OutputDef / ReferenceDef

InputDef = name:Ident _ ":" _ type:Type _ d:("=" _ v:Value { return v })? { return { is: 'input', name: name, type: type, initial: d} }

OutputDef = name:Ident _ "<-" _ value:(.*) { return { is: 'output', name: name, expr: value.join('') } }

ReferenceDef = name:Ident { return { is: 'reference', name: name } }

Ident = val:[a-zA-Z0-9]+ { return val.join('') }

Value = val:[a-zA-Z0-9]+ { return val.join('') }

Type = "discrete" / "continuous"

_ "whitespace"
  = [ \t\n\r]*
