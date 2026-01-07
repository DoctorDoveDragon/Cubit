"""
Cubit Language Interpreter - Evaluates the Abstract Syntax Tree
"""

import math
import random
from typing import Any, Dict, List, Callable
from parser import (
    ASTNode, NumberNode, StringNode, VariableNode, BinaryOpNode,
    AssignmentNode, PrintNode, BlockNode, IfNode, WhileNode, Parser,
    FunctionCallNode, ListNode, IndexNode
)


class Interpreter:
    def __init__(self):
        self.variables: Dict[str, Any] = {}
        self.output_produced = False
        self.builtin_functions = self._init_builtin_functions()
    
    def _init_builtin_functions(self) -> Dict[str, Callable]:
        """Initialize built-in functions for all modules"""
        return {
            # Math module
            'sqrt': lambda x: math.sqrt(x),
            'pow': lambda x, y: pow(x, y),
            'abs': lambda x: abs(x),
            'min': lambda *args: min(args),
            'max': lambda *args: max(args),
            'floor': lambda x: math.floor(x),
            'ceil': lambda x: math.ceil(x),
            'round': lambda x: round(x),
            'sin': lambda x: math.sin(x),
            'cos': lambda x: math.cos(x),
            'tan': lambda x: math.tan(x),
            
            # String module
            'len': lambda x: len(x),
            'upper': lambda s: s.upper() if isinstance(s, str) else str(s).upper(),
            'lower': lambda s: s.lower() if isinstance(s, str) else str(s).lower(),
            'split': lambda s, sep=' ': s.split(sep) if isinstance(s, str) else str(s).split(sep),
            'join': lambda sep, lst: sep.join(str(item) for item in lst),
            'strip': lambda s: s.strip() if isinstance(s, str) else str(s).strip(),
            'replace': lambda s, old, new: s.replace(old, new) if isinstance(s, str) else str(s).replace(old, new),
            'startswith': lambda s, prefix: s.startswith(prefix) if isinstance(s, str) else str(s).startswith(prefix),
            'endswith': lambda s, suffix: s.endswith(suffix) if isinstance(s, str) else str(s).endswith(suffix),
            
            # List/Array module
            'append': self._list_append,
            'pop': self._list_pop,
            'insert': self._list_insert,
            'remove': self._list_remove,
            'reverse': self._list_reverse,
            'sort': self._list_sort,
            
            # Random module
            'random': lambda: random.random(),
            'randint': lambda a, b: random.randint(int(a), int(b)),
            'choice': lambda lst: random.choice(lst),
            'shuffle': self._list_shuffle,
            
            # Type conversion
            'int': lambda x: int(x),
            'float': lambda x: float(x),
            'str': lambda x: str(x),
            
            # Input
            'input': lambda prompt='': input(prompt),
        }
    
    def _list_append(self, lst: List, item: Any) -> None:
        """Append item to list (in-place)"""
        if not isinstance(lst, list):
            raise Exception("append() requires a list as first argument")
        lst.append(item)
        return None
    
    def _list_pop(self, lst: List, index: int = -1) -> Any:
        """Pop item from list"""
        if not isinstance(lst, list):
            raise Exception("pop() requires a list as first argument")
        return lst.pop(int(index))
    
    def _list_insert(self, lst: List, index: int, item: Any) -> None:
        """Insert item into list at index"""
        if not isinstance(lst, list):
            raise Exception("insert() requires a list as first argument")
        lst.insert(int(index), item)
        return None
    
    def _list_remove(self, lst: List, item: Any) -> None:
        """Remove first occurrence of item from list"""
        if not isinstance(lst, list):
            raise Exception("remove() requires a list as first argument")
        lst.remove(item)
        return None
    
    def _list_reverse(self, lst: List) -> None:
        """Reverse list in-place"""
        if not isinstance(lst, list):
            raise Exception("reverse() requires a list")
        lst.reverse()
        return None
    
    def _list_sort(self, lst: List) -> None:
        """Sort list in-place"""
        if not isinstance(lst, list):
            raise Exception("sort() requires a list")
        lst.sort()
        return None
    
    def _list_shuffle(self, lst: List) -> None:
        """Shuffle list in-place"""
        if not isinstance(lst, list):
            raise Exception("shuffle() requires a list")
        random.shuffle(lst)
        return None
    
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
        
        elif isinstance(node, FunctionCallNode):
            # Evaluate function call
            if node.function_name not in self.builtin_functions:
                raise Exception(f"Undefined function: {node.function_name}")
            
            # Evaluate arguments
            args = [self.evaluate(arg) for arg in node.arguments]
            
            # Call the function
            try:
                return self.builtin_functions[node.function_name](*args)
            except TypeError as e:
                raise Exception(f"Error calling {node.function_name}: {str(e)}")
        
        elif isinstance(node, ListNode):
            # Evaluate list literal
            return [self.evaluate(element) for element in node.elements]
        
        elif isinstance(node, IndexNode):
            # Evaluate array indexing
            list_value = self.evaluate(node.list_expr)
            index_value = self.evaluate(node.index)
            
            if not isinstance(list_value, (list, str)):
                raise Exception(f"Cannot index non-list/string type")
            
            if not isinstance(index_value, (int, float)):
                raise Exception(f"List index must be a number")
            
            index = int(index_value)
            try:
                return list_value[index]
            except IndexError:
                raise Exception(f"List index out of range: {index}")
        
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
