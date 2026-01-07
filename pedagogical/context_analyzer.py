"""
Context Analyzer for understanding the calling context
"""

import inspect
from typing import Dict, Any, Optional, List
from types import FrameType as _FrameType

# Some Python versions (older runners) don't expose inspect.FrameType.
# Provide a compatibility alias that prefers inspect.FrameType but falls
# back to types.FrameType so annotations work on Python 3.10 and 3.11.
FrameType = getattr(inspect, "FrameType", _FrameType)
from pathlib import Path


class ContextAnalyzer:
    """
    Analyzes the context in which methods are called to provide better insights
    """
    
    def analyze(self, frame: Optional['FrameType']) -> Dict[str, Any]:
        """
        Analyze the calling context
        
        Args:
            frame: The calling frame from inspect.currentframe()
            
        Returns:
            Dictionary containing context information
        """
        if frame is None:
            return self._empty_context()
        
        # Go up two frames to get the actual caller (skip internal frames)
        caller_frame = frame.f_back.f_back if frame.f_back and frame.f_back.f_back else frame
        
        return {
            'file': self._get_file_info(caller_frame),
            'function': self._get_function_info(caller_frame),
            'line_number': caller_frame.f_lineno,
            'local_variables': self._get_local_variables(caller_frame),
            'call_chain': self._get_call_chain(caller_frame),
            'module': self._get_module_info(caller_frame),
            'code_snippet': self._get_code_snippet(caller_frame)
        }
    
    def _empty_context(self) -> Dict[str, Any]:
        """Return empty context when frame is not available"""
        return {
            'file': 'unknown',
            'function': 'unknown',
            'line_number': 0,
            'local_variables': {},
            'call_chain': [],
            'module': 'unknown',
            'code_snippet': ''
        }
    
    def _get_file_info(self, frame: 'FrameType') -> str:
        """Get the file path from the frame"""
        try:
            file_path = frame.f_code.co_filename
            return str(Path(file_path).name)
        except:
            return 'unknown'
    
    def _get_function_info(self, frame: 'FrameType') -> str:
        """Get the function name from the frame"""
        try:
            return frame.f_code.co_name
        except:
            return 'unknown'
    
    def _get_local_variables(self, frame: 'FrameType') -> Dict[str, str]:
        """
        Get local variables from the frame (types only for privacy)
        
        Args:
            frame: The stack frame
            
        Returns:
            Dictionary mapping variable names to their types
        """
        try:
            local_vars = {}
            for name, value in frame.f_locals.items():
                if not name.startswith('_'):
                    local_vars[name] = type(value).__name__
            return local_vars
        except:
            return {}
    
    def _get_call_chain(self, frame: 'FrameType') -> List[str]:
        """
        Get the call chain leading to this point
        
        Args:
            frame: The stack frame
            
        Returns:
            List of function names in the call chain
        """
        try:
            call_chain = []
            current_frame = frame
            max_depth = 10  # Limit depth to avoid huge chains
            
            while current_frame and len(call_chain) < max_depth:
                func_name = current_frame.f_code.co_name
                if func_name not in ['<module>', '__init__', '_get_caller_context']:
                    call_chain.append(func_name)
                current_frame = current_frame.f_back
            
            return call_chain
        except:
            return []
    
    def _get_module_info(self, frame: 'FrameType') -> str:
        """Get the module name from the frame"""
        try:
            return frame.f_globals.get('__name__', 'unknown')
        except:
            return 'unknown'
    
    def _get_code_snippet(self, frame: 'FrameType', context_lines: int = 3) -> str:
        """
        Get the code snippet around the calling line
        
        Args:
            frame: The stack frame
            context_lines: Number of lines before/after to include
            
        Returns:
            Code snippet as a string
        """
        try:
            filename = frame.f_code.co_filename
            line_number = frame.f_lineno
            
            with open(filename, 'r') as f:
                lines = f.readlines()
            
            start = max(0, line_number - context_lines - 1)
            end = min(len(lines), line_number + context_lines)
            
            snippet_lines = []
            for i in range(start, end):
                prefix = '>>> ' if i == line_number - 1 else '    '
                snippet_lines.append(f"{prefix}{lines[i].rstrip()}")
            
            return '\n'.join(snippet_lines)
        except:
            return ''
    
    def infer_intent(self, context: Dict[str, Any]) -> str:
        """
        Infer the user's intent from the context
        
        Args:
            context: Context dictionary from analyze()
            
        Returns:
            Inferred intent description
        """
        function = context.get('function', '')
        module = context.get('module', '')
        
        # Simple intent inference based on naming patterns
        if 'test' in function.lower() or 'test' in module.lower():
            return 'testing'
        elif 'main' in function.lower():
            return 'main_execution'
        elif 'init' in function.lower():
            return 'initialization'
        elif 'process' in function.lower() or 'handle' in function.lower():
            return 'data_processing'
        else:
            return 'general_usage'
    
    def detect_patterns(self, context: Dict[str, Any], call_history: List[Dict]) -> List[str]:
        """
        Detect usage patterns from context and history
        
        Args:
            context: Current context
            call_history: Previous calls
            
        Returns:
            List of detected patterns
        """
        patterns = []
        
        # Check for rapid repeated calls
        if len(call_history) > 3:
            recent_methods = [call['method'] for call in call_history[-3:]]
            if len(set(recent_methods)) == 1:
                patterns.append('repeated_method_calls')
        
        # Check for exploratory behavior
        if len(call_history) > 5:
            unique_methods = len(set(call['method'] for call in call_history[-5:]))
            if unique_methods == 5:
                patterns.append('exploration')
        
        # Check for error recovery pattern
        local_vars = context.get('local_variables', {})
        if 'error' in local_vars or 'exception' in local_vars:
            patterns.append('error_handling')
        
        return patterns
