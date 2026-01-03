/**
 * Example Cubit code snippets for the code executor
 */

export interface CubitExample {
  name: string
  description: string
  code: string
}

export const CUBIT_EXAMPLES: Record<string, CubitExample> = {
  hello: {
    name: 'Hello World',
    description: 'A simple hello world program',
    code: 'print "Hello, Cubit!"'
  },
  
  fibonacci: {
    name: 'Fibonacci',
    description: 'Generate first 10 Fibonacci numbers',
    code: `# Fibonacci sequence
let a = 0
let b = 1
let i = 0

while i < 10 {
    print a
    let temp = a + b
    a = b
    b = temp
    i = i + 1
}`
  },
  
  variables: {
    name: 'Variables & Math',
    description: 'Basic arithmetic operations',
    code: `# Variables and math
let x = 10
let y = 20
let sum = x + y
let product = x * y

print "x ="
print x
print "y ="
print y
print "sum ="
print sum
print "product ="
print product`
  },
  
  conditionals: {
    name: 'Conditionals',
    description: 'If/else example with grade calculation',
    code: `# Grade calculator
let score = 85

print "Score:"
print score

if score >= 90 {
    print "Grade: A"
} else {
    if score >= 80 {
        print "Grade: B"
    } else {
        if score >= 70 {
            print "Grade: C"
        } else {
            print "Grade: F"
        }
    }
}`
  },
  
  loops: {
    name: 'Loops',
    description: 'While loop countdown example',
    code: `# Countdown
let count = 10

print "Countdown:"

while count > 0 {
    print count
    count = count - 1
}

print "Liftoff!"`
  }
}

export const getExamplesList = (): CubitExample[] => {
  return Object.values(CUBIT_EXAMPLES)
}

export const getExampleByKey = (key: string): CubitExample | undefined => {
  return CUBIT_EXAMPLES[key]
}
