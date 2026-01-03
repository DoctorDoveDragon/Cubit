"""
Cubit Language Parser - Builds an Abstract Syntax Tree from tokens
"""

from typing import List, Optional
from dataclasses import dataclass
from lexer import Token, TokenType


# AST Node types
@dataclass
class ASTNode:
    pass


@dataclass
class NumberNode(ASTNode):
    value: float


@dataclass
class StringNode(ASTNode):
    value: str


@dataclass
class VariableNode(ASTNode):
    name: str


@dataclass
class BinaryOpNode(ASTNode):
    left: ASTNode
    operator: str
    right: ASTNode


@dataclass
class AssignmentNode(ASTNode):
    name: str
    value: ASTNode


@dataclass
class PrintNode(ASTNode):
    expression: ASTNode


@dataclass
class BlockNode(ASTNode):
    statements: List[ASTNode]


@dataclass
class IfNode(ASTNode):
    condition: ASTNode
    then_block: ASTNode
    else_block: Optional[ASTNode] = None


@dataclass
class WhileNode(ASTNode):
    condition: ASTNode
    body: ASTNode


class Parser:
    def __init__(self, tokens: List[Token]):
        self.tokens = tokens
        self.position = 0
    
    def current_token(self) -> Token:
        if self.position >= len(self.tokens):
            return self.tokens[-1]  # Return EOF
        return self.tokens[self.position]
    
    def peek_token(self, offset: int = 1) -> Token:
        peek_position = self.position + offset
        if peek_position >= len(self.tokens):
            return self.tokens[-1]
        return self.tokens[peek_position]
    
    def advance(self):
        if self.position < len(self.tokens) - 1:
            self.position += 1
    
    def expect(self, token_type: TokenType) -> Token:
        token = self.current_token()
        if token.type != token_type:
            raise Exception(f"Expected {token_type}, got {token.type} at line {token.line}")
        self.advance()
        return token
    
    def skip_newlines(self):
        while self.current_token().type == TokenType.NEWLINE:
            self.advance()
    
    def parse(self) -> BlockNode:
        statements = []
        self.skip_newlines()
        
        while self.current_token().type != TokenType.EOF:
            statement = self.parse_statement()
            if statement:
                statements.append(statement)
            self.skip_newlines()
        
        return BlockNode(statements)
    
    def parse_statement(self) -> Optional[ASTNode]:
        self.skip_newlines()
        token = self.current_token()
        
        if token.type == TokenType.PRINT:
            return self.parse_print()
        elif token.type == TokenType.LET:
            return self.parse_assignment()
        elif token.type == TokenType.IF:
            return self.parse_if()
        elif token.type == TokenType.WHILE:
            return self.parse_while()
        elif token.type == TokenType.IDENTIFIER:
            # Check if it's an assignment
            if self.peek_token().type == TokenType.ASSIGN:
                return self.parse_assignment()
            else:
                # Expression statement
                expression = self.parse_expression()
                self.skip_statement_end()
                return expression
        elif token.type == TokenType.LBRACE:
            return self.parse_block()
        elif token.type in (TokenType.NEWLINE, TokenType.SEMICOLON):
            self.advance()
            return None
        else:
            expression = self.parse_expression()
            self.skip_statement_end()
            return expression
    
    def skip_statement_end(self):
        """Skip semicolons and newlines that mark end of statement"""
        while self.current_token().type in (TokenType.SEMICOLON, TokenType.NEWLINE):
            self.advance()
    
    def parse_print(self) -> PrintNode:
        self.expect(TokenType.PRINT)
        expression = self.parse_expression()
        self.skip_statement_end()
        return PrintNode(expression)
    
    def parse_assignment(self) -> AssignmentNode:
        if self.current_token().type == TokenType.LET:
            self.advance()
        
        name_token = self.expect(TokenType.IDENTIFIER)
        self.expect(TokenType.ASSIGN)
        value = self.parse_expression()
        self.skip_statement_end()
        
        return AssignmentNode(name_token.value, value)
    
    def parse_if(self) -> IfNode:
        self.expect(TokenType.IF)
        
        # Optional parentheses around condition
        has_parentheses = self.current_token().type == TokenType.LPAREN
        if has_parentheses:
            self.advance()
        
        condition = self.parse_expression()
        
        if has_parentheses:
            self.expect(TokenType.RPAREN)
        
        self.skip_newlines()
        then_block = self.parse_statement()
        
        else_block = None
        self.skip_newlines()
        if self.current_token().type == TokenType.ELSE:
            self.advance()
            self.skip_newlines()
            else_block = self.parse_statement()
        
        return IfNode(condition, then_block, else_block)
    
    def parse_while(self) -> WhileNode:
        self.expect(TokenType.WHILE)
        
        # Optional parentheses around condition
        has_parentheses = self.current_token().type == TokenType.LPAREN
        if has_parentheses:
            self.advance()
        
        condition = self.parse_expression()
        
        if has_parentheses:
            self.expect(TokenType.RPAREN)
        
        self.skip_newlines()
        body = self.parse_statement()
        
        return WhileNode(condition, body)
    
    def parse_block(self) -> BlockNode:
        self.expect(TokenType.LBRACE)
        self.skip_newlines()
        
        statements = []
        while self.current_token().type != TokenType.RBRACE and self.current_token().type != TokenType.EOF:
            statement = self.parse_statement()
            if statement:
                statements.append(statement)
            self.skip_newlines()
        
        self.expect(TokenType.RBRACE)
        return BlockNode(statements)
    
    def parse_expression(self) -> ASTNode:
        return self.parse_comparison()
    
    def parse_comparison(self) -> ASTNode:
        left = self.parse_additive()
        
        while self.current_token().type in (TokenType.EQUAL, TokenType.NOT_EQUAL,
                                            TokenType.LESS, TokenType.GREATER,
                                            TokenType.LESS_EQUAL, TokenType.GREATER_EQUAL):
            operator_token = self.current_token()
            self.advance()
            right = self.parse_additive()
            left = BinaryOpNode(left, operator_token.value, right)
        
        return left
    
    def parse_additive(self) -> ASTNode:
        left = self.parse_multiplicative()
        
        while self.current_token().type in (TokenType.PLUS, TokenType.MINUS):
            operator_token = self.current_token()
            self.advance()
            right = self.parse_multiplicative()
            left = BinaryOpNode(left, operator_token.value, right)
        
        return left
    
    def parse_multiplicative(self) -> ASTNode:
        left = self.parse_primary()
        
        while self.current_token().type in (TokenType.MULTIPLY, TokenType.DIVIDE):
            operator_token = self.current_token()
            self.advance()
            right = self.parse_primary()
            left = BinaryOpNode(left, operator_token.value, right)
        
        return left
    
    def parse_primary(self) -> ASTNode:
        token = self.current_token()
        
        if token.type == TokenType.NUMBER:
            self.advance()
            return NumberNode(token.value)
        elif token.type == TokenType.STRING:
            self.advance()
            return StringNode(token.value)
        elif token.type == TokenType.IDENTIFIER:
            self.advance()
            return VariableNode(token.value)
        elif token.type == TokenType.LPAREN:
            self.advance()
            expression = self.parse_expression()
            self.expect(TokenType.RPAREN)
            return expression
        elif token.type == TokenType.MINUS:
            self.advance()
            expression = self.parse_primary()
            return BinaryOpNode(NumberNode(0), '-', expression)
        else:
            raise Exception(f"Unexpected token {token.type} at line {token.line}")
