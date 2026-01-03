"""
Basic Example - Demonstrating Pedagogical API
"""

from pedagogical.api import PedagogicalAPI


# Simple calculator API that we want to enhance with pedagogical features
class Calculator:
    """A simple calculator for basic math operations"""
    
    def add(self, a: float, b: float) -> float:
        """Add two numbers"""
        return a + b
    
    def subtract(self, a: float, b: float) -> float:
        """Subtract b from a"""
        return a - b
    
    def multiply(self, a: float, b: float) -> float:
        """Multiply two numbers"""
        return a * b
    
    def divide(self, a: float, b: float) -> float:
        """Divide a by b"""
        if b == 0:
            raise ValueError("Cannot divide by zero")
        return a / b


def main():
    """Demonstrate basic usage of the Pedagogical API"""
    
    print("=" * 60)
    print("Pedagogical API - Basic Example")
    print("=" * 60)
    print()
    
    # Create the calculator and wrap it
    calc = Calculator()
    pedagogical_calc = PedagogicalAPI(calc)
    
    print("🎓 Starting calculations with pedagogical guidance...\n")
    
    # Example 1: Basic addition
    print("Example 1: Basic Addition")
    print("-" * 40)
    result = pedagogical_calc.call('add', 5, 3)
    print(f"Result: {result}\n")
    
    # Example 2: Subtraction
    print("Example 2: Subtraction")
    print("-" * 40)
    result = pedagogical_calc.call('subtract', 10, 4)
    print(f"Result: {result}\n")
    
    # Example 3: Multiplication
    print("Example 3: Multiplication")
    print("-" * 40)
    result = pedagogical_calc.call('multiply', 6, 7)
    print(f"Result: {result}\n")
    
    # Example 4: Division
    print("Example 4: Division")
    print("-" * 40)
    result = pedagogical_calc.call('divide', 20, 4)
    print(f"Result: {result}\n")
    
    # Show learning progress
    print("📊 Learning Progress Summary")
    print("=" * 60)
    progress = pedagogical_calc.get_learning_progress()
    print(f"Total calls: {progress.get('total_calls', 0)}")
    print(f"Unique methods: {len(progress.get('method_diversity', []))}")
    print(f"Current skill level: {pedagogical_calc._infer_skill_level()}")
    print()
    
    # Suggest next concepts
    print("🎯 Suggested Next Concepts:")
    print("-" * 40)
    suggestions = pedagogical_calc.suggest_next_concepts()
    for i, concept in enumerate(suggestions[:5], 1):
        print(f"{i}. {concept}")
    print()


if __name__ == '__main__':
    main()
