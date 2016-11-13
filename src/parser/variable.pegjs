Expression = InputDef / OutputDef / ReferenceDef

// Core definition types

InputDef = name:Ident _ ":" _ range:Range _ d:("=" _ v:Value { return v })? { return { is: 'input', name: name, range: range, initial: d} }
OutputDef = name:Ident _ "<-" _ value:(.*) { return { is: 'output', name: name, expr: value.join('') } }
ReferenceDef = name:Ident { return { is: 'reference', name: name } }

Ident = [a-zA-Z0-9]+ { return text() }

Value = [a-zA-Z0-9]+ { return text() }

Range = DiscreteRange / ContinuousRange / CategoricalRange

Integer = [0-9]+ { return parseInt(text(), 10); }

// Float = DecimalIntegerLiteral "." DecimalDigit* { return parseFloat(text()) }
// DecimalIntegerLiteral = "0" / NonZeroDigit DecimalDigit*
// DecimalDigit = [0-9]
// NonZeroDigit = [1-9]

ContinuousRange = start:Integer "..." end:Integer { return { type: "continuous", start: start, end: end } }

DiscreteRange = start:Integer _ "to" _ end:Integer { return { type: "discrete", start: start, end: end } }

CategoricalRange = head:CategoricalTerm tail:CategoricalSubsequentTerm* { return {type: "categorical", values: [head, ...tail] } }
CategoricalTerm = Ident
CategoricalSubsequentTerm = "," _ term:CategoricalTerm { return term }

_ "whitespace"
  = [ \t\n\r]*
