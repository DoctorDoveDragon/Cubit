"""
Cubit Language Interpreter - Evaluates the Abstract Syntax Tree
"""

from typing import Any, Dict
from parser import (
    ASTNode, NumberNode, StringNode, VariableNode, BinaryOpNode,
    AssignmentNode, PrintNode, BlockNode, IfNode, WhileNode, Parser
)


class Interpreter:
    def __init__(self):
        self.variables: Dict[str, Any] = {}
        self.output_produced = False
    
    def evaluate(self, node: ASTNode) -> Any:
        if isinstance(node, NumberNode):
            return node.value
        
        elif isinstance(node, StringNode):
            return node.value
        
        elif isinstance(node, VariableNode):
            if node.name not in self.variables:
                raise Exception(f"Undefined variable: {node.name}")
            return self.variables[node.name]
        
        elif isinstance(node, BinaryOpNode):
            left = self.evaluate(node.left)
            right = self.evaluate(node.right)
            
            if node.operator == '+':
                return left + right
            elif node.operator == '-':
                return left - right
            elif node.operator == '*':
                return left * right
            elif node.operator == '/':
                if right == 0:
                    raise Exception("Division by zero")
                return left / right
            elif node.operator == '==':
                return left == right
            elif node.operator == '!=':
                return left != right
            elif node.operator == '<':
                return left < right
            elif node.operator == '>':
                return left > right
            elif node.operator == '<=':
                return left <= right
            elif node.operator == '>=':
                return left >= right
            else:
                raise Exception(f"Unknown operator: {node.operator}")
        
        elif isinstance(node, AssignmentNode):
            value = self.evaluate(node.value)
            self.variables[node.name] = value
            return value
        
        elif isinstance(node, PrintNode):
            value = self.evaluate(node.expression)
            print(value)
            self.output_produced = True
            return value
        
        elif isinstance(node, BlockNode):
            result = None
            for statement in node.statements:
                result = self.evaluate(statement)
            return result
        
        elif isinstance(node, IfNode):
            condition = self.evaluate(node.condition)
            if condition:
                return self.evaluate(node.then_block)
            elif node.else_block:
                return self.evaluate(node.else_block)
            return None
        
        elif isinstance(node, WhileNode):
            result = None
            while self.evaluate(node.condition):
                result = self.evaluate(node.body)
            return result
        
        else:
            raise Exception(f"Unknown node type: {type(node)}")
    
    def run(self, source: str) -> Any:
        from lexer import Lexer
        
        # Reset output flag
        self.output_produced = False
        
        # Tokenize
        lexer = Lexer(source)
        tokens = lexer.tokenize()
        
        # Parse
        parser = Parser(tokens)
        syntax_tree = parser.parse()
        
        # Evaluate
        return self.evaluate(syntax_tree)
