const fs = require('fs')

// Define the Hotscript lexer
class Lexer {
	constructor(input) {
		this.input = input
		this.pos = 0
		this.currentChar = this.input[this.pos]
	}

	advance() {
		this.pos++
		if (this.pos < this.input.length) {
			this.currentChar = this.input[this.pos]
		} else {
			this.currentChar = null
		}
	}

	skipWhitespace() {
		while (this.currentChar && /\s/.test(this.currentChar)) {
			this.advance()
		}
	}

	// Tokenize the input
	tokenize() {
		const tokens = []

		while (this.currentChar !== null) {
			if (/\s/.test(this.currentChar)) {
				this.skipWhitespace()
				continue
			}

			if (/[0-9]/.test(this.currentChar)) {
				let num = ''
				while (/[0-9]/.test(this.currentChar)) {
					num += this.currentChar
					this.advance()
				}
				tokens.push({ type: 'INTEGER', value: parseInt(num) })
				continue
			}

			if (this.currentChar === '"') {
				let str = ''
				this.advance()
				while (this.currentChar !== '"') {
					str += this.currentChar
					this.advance()
				}
				this.advance() // Skip the ending quote
				tokens.push({ type: 'STRING', value: str })
				continue
			}

			if (this.currentChar === '+') {
				tokens.push({ type: 'PLUS', value: '+' })
				this.advance()
				continue
			}

			if (this.currentChar === '-') {
				tokens.push({ type: 'MINUS', value: '-' })
				this.advance()
				continue
			}

			if (this.currentChar === '=') {
				tokens.push({ type: 'ASSIGN', value: '=' })
				this.advance()
				continue
			}

			if (this.currentChar === '(') {
				tokens.push({ type: 'LPAREN', value: '(' })
				this.advance()
				continue
			}

			if (this.currentChar === ')') {
				tokens.push({ type: 'RPAREN', value: ')' })
				this.advance()
				continue
			}

			if (/[a-zA-Z]/.test(this.currentChar)) {
				let identifier = ''
				while (/[a-zA-Z0-9]/.test(this.currentChar)) {
					identifier += this.currentChar
					this.advance()
				}

				if (identifier === 'print') {
					tokens.push({ type: 'PRINT', value: 'print' })
				} else {
					tokens.push({ type: 'IDENTIFIER', value: identifier })
				}
				continue
			}

			throw new Error(`Invalid character: ${this.currentChar}`)
		}

		return tokens
	}
}

// Define the Hotscript parser
class Parser {
	constructor(tokens) {
		this.tokens = tokens
		this.currentToken = this.tokens[0]
		this.pos = 0
		this.variables = {} // Store variables here
	}

	eat(tokenType) {
		if (this.currentToken.type === tokenType) {
			this.pos++
			if (this.pos < this.tokens.length) {
				this.currentToken = this.tokens[this.pos]
			} else {
				this.currentToken = null
			}
		} else {
			throw new Error(`Unexpected token: ${this.currentToken.type}`)
		}
	}

	parse() {
		const result = this.statements()
		if (this.currentToken !== null) {
			throw new Error('Unexpected token at end of expression')
		}
		return result
	}

	statements() {
		const result = {}
		while (this.currentToken !== null) {
			const statementResult = this.statement()
			if (statementResult) {
				this.variables[statementResult.identifier] =
					statementResult.value // Store variable value
				result[statementResult.identifier] = statementResult.value
			}
		}
		return result
	}

	statement() {
		const token = this.currentToken
		if (token.type === 'IDENTIFIER') {
			const identifier = token.value
			this.eat('IDENTIFIER')
			if (this.currentToken.type === 'ASSIGN') {
				this.eat('ASSIGN')
				const value = this.expr()
				return { identifier, value }
			} else {
				const value = this.variables[identifier] // Retrieve variable value
				if (value === undefined) {
					throw new Error(`Undefined variable: ${identifier}`)
				}
				console.log(value)
				return { identifier, value }
			}
		} else if (token.type === 'PRINT') {
			this.eat('PRINT')
			const value = this.expr()
			console.log(value)
			return { value }
		} else {
			throw new Error(`Unexpected token: ${token.type}`)
		}
	}

	expr() {
		let result = this.term()

		while (
			this.currentToken !== null &&
			(this.currentToken.type === 'PLUS' ||
				this.currentToken.type === 'MINUS')
		) {
			const token = this.currentToken
			if (token.type === 'PLUS') {
				this.eat('PLUS')
				result += this.term()
			} else if (token.type === 'MINUS') {
				this.eat('MINUS')
				result -= this.term()
			}
		}

		return result
	}

	term() {
		let result
		const token = this.currentToken
		if (token.type === 'INTEGER' || token.type === 'STRING') {
			this.eat(token.type)
			result = token.value
		} else if (token.type === 'LPAREN') {
			this.eat('LPAREN')
			result = this.expr()
			this.eat('RPAREN')
		} else if (token.type === 'IDENTIFIER') {
			const identifier = token.value
			this.eat('IDENTIFIER')
			if (this.currentToken.type === 'ASSIGN') {
				this.eat('ASSIGN')
				const value = this.expr()
				this.variables[identifier] = value
				result = value
			} else {
				const value = this.variables[identifier]
				if (value === undefined) {
					throw new Error(`Undefined variable: ${identifier}`)
				}
				result = value
			}
		} else {
			throw new Error(`Unexpected token: ${token.type}`)
		}
		return result
	}
}

// Function to run Hotscript code
const variables = {}

function runHotscript(input) {
	const lexer = new Lexer(input)
	const tokens = lexer.tokenize()
	const parser = new Parser(tokens)
	return parser.parse()
}

// Read the Hotscript file and execute the code
if (process.argv.length !== 3) {
	console.log('Usage: hotscript <filename>')
	process.exit(1)
}

const filename = process.argv[2]

fs.readFile(filename, 'utf8', (err, data) => {
	if (err) {
		console.error(err)
		return
	}

	try {
		runHotscript(data)
		// Print the variables after execution
		// console.log(variables)
	} catch (error) {
		console.error('Error:', error.message)
	}
})
