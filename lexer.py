"""
Cubit Language Lexer - Tokenizes source code into tokens
"""

import re
from enum import Enum, auto
from dataclasses import dataclass
from typing import List, Optional


class TokenType(Enum):
    # Literals
    NUMBER = auto()
    STRING = auto()
    IDENTIFIER = auto()
    
    # Keywords
    PRINT = auto()
    LET = auto()
    IF = auto()
    ELSE = auto()
    WHILE = auto()
    
    # Operators
    PLUS = auto()
    MINUS = auto()
    MULTIPLY = auto()
    DIVIDE = auto()
    ASSIGN = auto()
    EQUAL = auto()
    NOT_EQUAL = auto()
    LESS = auto()
    GREATER = auto()
    LESS_EQUAL = auto()
    GREATER_EQUAL = auto()
    
    # Delimiters
    LPAREN = auto()
    RPAREN = auto()
    LBRACE = auto()
    RBRACE = auto()
    SEMICOLON = auto()
    
    # Special
    EOF = auto()
    NEWLINE = auto()


@dataclass
class Token:
    type: TokenType
    value: any
    line: int
    column: int


class Lexer:
    def __init__(self, source: str):
        self.source = source
        self.pos = 0
        self.line = 1
        self.column = 1
        self.tokens: List[Token] = []
        
        self.keywords = {
            'print': TokenType.PRINT,
            'let': TokenType.LET,
            'if': TokenType.IF,
            'else': TokenType.ELSE,
            'while': TokenType.WHILE,
        }
    
    def current_char(self) -> Optional[str]:
        if self.pos >= len(self.source):
            return None
        return self.source[self.pos]
    
    def peek_char(self, offset: int = 1) -> Optional[str]:
        pos = self.pos + offset
        if pos >= len(self.source):
            return None
        return self.source[pos]
    
    def advance(self):
        if self.pos < len(self.source):
            if self.source[self.pos] == '\n':
                self.line += 1
                self.column = 1
            else:
                self.column += 1
            self.pos += 1
    
    def skip_whitespace(self):
        while self.current_char() and self.current_char() in ' \t\r':
            self.advance()
    
    def skip_comment(self):
        if self.current_char() == '#':
            while self.current_char() and self.current_char() != '\n':
                self.advance()
    
    def read_number(self) -> Token:
        start_column = self.column
        num_str = ''
        has_dot = False
        
        while self.current_char() and (self.current_char().isdigit() or self.current_char() == '.'):
            if self.current_char() == '.':
                if has_dot:
                    break
                has_dot = True
            num_str += self.current_char()
            self.advance()
        
        value = float(num_str) if has_dot else int(num_str)
        return Token(TokenType.NUMBER, value, self.line, start_column)
    
    def read_string(self) -> Token:
        start_column = self.column
        self.advance()  # Skip opening quote
        string_val = ''
        
        while self.current_char() and self.current_char() != '"':
            if self.current_char() == '\\' and self.peek_char() == '"':
                self.advance()
                string_val += '"'
                self.advance()
            else:
                string_val += self.current_char()
                self.advance()
        
        self.advance()  # Skip closing quote
        return Token(TokenType.STRING, string_val, self.line, start_column)
    
    def read_identifier(self) -> Token:
        start_column = self.column
        ident = ''
        
        while self.current_char() and (self.current_char().isalnum() or self.current_char() == '_'):
            ident += self.current_char()
            self.advance()
        
        token_type = self.keywords.get(ident, TokenType.IDENTIFIER)
        return Token(token_type, ident, self.line, start_column)
    
    def tokenize(self) -> List[Token]:
        while self.current_char():
            self.skip_whitespace()
            
            if not self.current_char():
                break
            
            # Comments
            if self.current_char() == '#':
                self.skip_comment()
                continue
            
            # Newlines
            if self.current_char() == '\n':
                token = Token(TokenType.NEWLINE, '\n', self.line, self.column)
                self.tokens.append(token)
                self.advance()
                continue
            
            # Numbers
            if self.current_char().isdigit():
                self.tokens.append(self.read_number())
                continue
            
            # Strings
            if self.current_char() == '"':
                self.tokens.append(self.read_string())
                continue
            
            # Identifiers and keywords
            if self.current_char().isalpha() or self.current_char() == '_':
                self.tokens.append(self.read_identifier())
                continue
            
            # Operators and delimiters
            char = self.current_char()
            line, col = self.line, self.column
            
            if char == '+':
                self.tokens.append(Token(TokenType.PLUS, '+', line, col))
                self.advance()
            elif char == '-':
                self.tokens.append(Token(TokenType.MINUS, '-', line, col))
                self.advance()
            elif char == '*':
                self.tokens.append(Token(TokenType.MULTIPLY, '*', line, col))
                self.advance()
            elif char == '/':
                self.tokens.append(Token(TokenType.DIVIDE, '/', line, col))
                self.advance()
            elif char == '=':
                if self.peek_char() == '=':
                    self.tokens.append(Token(TokenType.EQUAL, '==', line, col))
                    self.advance()
                    self.advance()
                else:
                    self.tokens.append(Token(TokenType.ASSIGN, '=', line, col))
                    self.advance()
            elif char == '!':
                if self.peek_char() == '=':
                    self.tokens.append(Token(TokenType.NOT_EQUAL, '!=', line, col))
                    self.advance()
                    self.advance()
                else:
                    self.advance()
            elif char == '<':
                if self.peek_char() == '=':
                    self.tokens.append(Token(TokenType.LESS_EQUAL, '<=', line, col))
                    self.advance()
                    self.advance()
                else:
                    self.tokens.append(Token(TokenType.LESS, '<', line, col))
                    self.advance()
            elif char == '>':
                if self.peek_char() == '=':
                    self.tokens.append(Token(TokenType.GREATER_EQUAL, '>=', line, col))
                    self.advance()
                    self.advance()
                else:
                    self.tokens.append(Token(TokenType.GREATER, '>', line, col))
                    self.advance()
            elif char == '(':
                self.tokens.append(Token(TokenType.LPAREN, '(', line, col))
                self.advance()
            elif char == ')':
                self.tokens.append(Token(TokenType.RPAREN, ')', line, col))
                self.advance()
            elif char == '{':
                self.tokens.append(Token(TokenType.LBRACE, '{', line, col))
                self.advance()
            elif char == '}':
                self.tokens.append(Token(TokenType.RBRACE, '}', line, col))
                self.advance()
            elif char == ';':
                self.tokens.append(Token(TokenType.SEMICOLON, ';', line, col))
                self.advance()
            else:
                raise Exception(f"Unexpected character '{char}' at line {line}, column {col}")
        
        self.tokens.append(Token(TokenType.EOF, None, self.line, self.column))
        return self.tokens
