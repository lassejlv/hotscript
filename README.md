> [!WARNING]
> This is a joke, chatgpt made all of this. Also the documention

# Hotscript Language Documentation

Hotscript is a simple programming language designed to be easy to learn and use. It supports basic arithmetic operations, variable assignment, and printing.

## Getting Started

To write and run Hotscript code, follow these steps:

1. Write your Hotscript code in a file with a `.hs` extension.
2. Run the Hotscript interpreter using the provided Node.js script.

### Example:

```plaintext
x = 10
y = 5
z = x + y
print(z)
```

Save this code in a file named `example.hs`, and then run it using the Hotscript interpreter:

```
node hotscript.js example.hs
```

This will output the result of the arithmetic operation, which is `15`.

## Syntax

### Variables

Variables in Hotscript are dynamically typed and can hold integer values or strings. Variable names can contain letters and numbers, but must start with a letter.

```plaintext
x = 10
name = "John"
```

### Arithmetic Operations

Hotscript supports addition (`+`) and subtraction (`-`) operations on integers.

```plaintext
result = 10 + 5
```

### Printing

You can use the `print()` function to output the value of a variable or expression.

```plaintext
x = 10
y = 5
z = x + y
print(z)
```

## Comments

Single-line comments start with `//`.

```plaintext
// This is a comment
```

## Error Handling

Hotscript will throw an error if it encounters unexpected tokens or undefined variables.

## Example Program

Here's a complete example program that demonstrates the basic features of Hotscript:

```plaintext
// Define variables
x = 10
y = 5
name = "John"

// Perform arithmetic operation
z = x + y

// Construct message
message = "Hello, " + name + "! The sum of x and y is " + z

// Print message
print(message)
```

Save this code in a file named `example.hs`, and then run it using the Hotscript interpreter as shown earlier.

## Conclusion

Hotscript is a simple yet powerful programming language suitable for beginners and small-scale projects. It provides essential features for arithmetic operations, variable handling, and printing output.

For more information and updates, visit the Hotscript GitHub repository.
