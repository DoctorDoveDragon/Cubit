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
        self.position = 0
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
        if self.position >= len(self.source):
            return None
        return self.source[self.position]
    
    def peek_char(self, offset: int = 1) -> Optional[str]:
        peek_position = self.position + offset
        if peek_position >= len(self.source):
            return None
        return self.source[peek_position]
    
    def advance(self):
        if self.position < len(self.source):
            if self.source[self.position] == '\n':
                self.line += 1
                self.column = 1
            else:
                self.column += 1
            self.position += 1
    
    def skip_whitespace(self):
        while self.current_char() and self.current_char() in ' \t\r':
            self.advance()
    
    def skip_comment(self):
        if self.current_char() == '#':
            while self.current_char() and self.current_char() != '\n':
                self.advance()
    
    def read_number(self) -> Token:
        start_column = self.column
        number_string = ''
        has_dot = False
        
        while self.current_char() and (self.current_char().isdigit() or self.current_char() == '.'):
            if self.current_char() == '.':
                if has_dot:
                    break
                has_dot = True
            number_string += self.current_char()
            self.advance()
        
        value = float(number_string) if has_dot else int(number_string)
        return Token(TokenType.NUMBER, value, self.line, start_column)
    
    def read_string(self) -> Token:
        start_column = self.column
        self.advance()  # Skip opening quote
        string_value = ''
        
        while self.current_char() and self.current_char() != '"':
            if self.current_char() == '\\' and self.peek_char() == '"':
                self.advance()
                string_value += '"'
                self.advance()
            else:
                string_value += self.current_char()
                self.advance()
        
        self.advance()  # Skip closing quote
        return Token(TokenType.STRING, string_value, self.line, start_column)
    
    def read_identifier(self) -> Token:
        start_column = self.column
        identifier = ''
        
        while self.current_char() and (self.current_char().isalnum() or self.current_char() == '_'):
            identifier += self.current_char()
            self.advance()
        
        token_type = self.keywords.get(identifier, TokenType.IDENTIFIER)
        return Token(token_type, identifier, self.line, start_column)
    
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
            current_char = self.current_char()
            line, column = self.line, self.column
            
            if current_char == '+':
                self.tokens.append(Token(TokenType.PLUS, '+', line, column))
                self.advance()
            elif current_char == '-':
                self.tokens.append(Token(TokenType.MINUS, '-', line, column))
                self.advance()
            elif current_char == '*':
                self.tokens.append(Token(TokenType.MULTIPLY, '*', line, column))
                self.advance()
            elif current_char == '/':
                self.tokens.append(Token(TokenType.DIVIDE, '/', line, column))
                self.advance()
            elif current_char == '=':
                if self.peek_char() == '=':
                    self.tokens.append(Token(TokenType.EQUAL, '==', line, column))
                    self.advance()
                    self.advance()
                else:
                    self.tokens.append(Token(TokenType.ASSIGN, '=', line, column))
                    self.advance()
            elif current_char == '!':
                if self.peek_char() == '=':
                    self.tokens.append(Token(TokenType.NOT_EQUAL, '!=', line, column))
                    self.advance()
                    self.advance()
                else:
                    self.advance()
            elif current_char == '<':
                if self.peek_char() == '=':
                    self.tokens.append(Token(TokenType.LESS_EQUAL, '<=', line, column))
                    self.advance()
                    self.advance()
                else:
                    self.tokens.append(Token(TokenType.LESS, '<', line, column))
                    self.advance()
            elif current_char == '>':
                if self.peek_char() == '=':
                    self.tokens.append(Token(TokenType.GREATER_EQUAL, '>=', line, column))
                    self.advance()
                    self.advance()
                else:
                    self.tokens.append(Token(TokenType.GREATER, '>', line, column))
                    self.advance()
            elif current_char == '(':
                self.tokens.append(Token(TokenType.LPAREN, '(', line, column))
                self.advance()
            elif current_char == ')':
                self.tokens.append(Token(TokenType.RPAREN, ')', line, column))
                self.advance()
            elif current_char == '{':
                self.tokens.append(Token(TokenType.LBRACE, '{', line, column))
                self.advance()
            elif current_char == '}':
                self.tokens.append(Token(TokenType.RBRACE, '}', line, column))
                self.advance()
            elif current_char == ';':
                self.tokens.append(Token(TokenType.SEMICOLON, ';', line, column))
                self.advance()
            else:
                raise Exception(f"Unexpected character '{current_char}' at line {line}, column {column}")
        
        self.tokens.append(Token(TokenType.EOF, None, self.line, self.column))
        return self.tokens
