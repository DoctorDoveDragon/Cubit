"""
Skill Inference Engine for determining user skill level
"""

from typing import Dict, List, Any
from collections import Counter


class SkillInferenceEngine:
    """
    Infers user skill level based on usage patterns and behavior
    """
    
    def __init__(self):
        self.skill_indicators = {
            'beginner': self._beginner_indicators,
            'intermediate': self._intermediate_indicators,
            'advanced': self._advanced_indicators,
            'expert': self._expert_indicators
        }
    
    def infer_level(
        self,
        call_history: List[Dict[str, Any]],
        user_profile: Dict[str, Any]
    ) -> str:
        """
        Infer the user's current skill level
        
        Args:
            call_history: History of method calls
            user_profile: User profile information
            
        Returns:
            Skill level: 'beginner', 'intermediate', 'advanced', or 'expert'
        """
        if not call_history:
            return 'beginner'
        
        # Calculate scores for each skill level
        scores = {}
        for level, indicator_func in self.skill_indicators.items():
            scores[level] = indicator_func(call_history, user_profile)
        
        # Return level with highest score
        return max(scores, key=scores.get)
    
    def _beginner_indicators(
        self,
        call_history: List[Dict[str, Any]],
        user_profile: Dict[str, Any]
    ) -> float:
        """Calculate score for beginner level"""
        score = 0.0
        
        # Few total calls
        if len(call_history) < 10:
            score += 2.0
        
        # Limited variety of methods
        unique_methods = len(set(call['method'] for call in call_history))
        if unique_methods < 5:
            score += 1.5
        
        # Repeated use of same methods (learning)
        method_counts = Counter(call['method'] for call in call_history)
        if method_counts.most_common(1)[0][1] > len(call_history) * 0.5:
            score += 1.0
        
        # No complex patterns
        if not self._detect_complex_patterns(call_history):
            score += 1.0
        
        return score
    
    def _intermediate_indicators(
        self,
        call_history: List[Dict[str, Any]],
        user_profile: Dict[str, Any]
    ) -> float:
        """Calculate score for intermediate level"""
        score = 0.0
        
        # Moderate number of calls
        if 10 <= len(call_history) < 50:
            score += 2.0
        
        # Good variety of methods
        unique_methods = len(set(call['method'] for call in call_history))
        if 5 <= unique_methods < 15:
            score += 1.5
        
        # Some pattern recognition
        if self._detect_basic_patterns(call_history):
            score += 1.0
        
        # Balanced exploration and repetition
        exploration_ratio = unique_methods / max(len(call_history), 1)
        if 0.3 <= exploration_ratio <= 0.7:
            score += 1.0
        
        return score
    
    def _advanced_indicators(
        self,
        call_history: List[Dict[str, Any]],
        user_profile: Dict[str, Any]
    ) -> float:
        """Calculate score for advanced level"""
        score = 0.0
        
        # Substantial call history
        if len(call_history) >= 50:
            score += 2.0
        
        # Wide variety of methods
        unique_methods = len(set(call['method'] for call in call_history))
        if unique_methods >= 15:
            score += 1.5
        
        # Complex patterns detected
        if self._detect_complex_patterns(call_history):
            score += 1.5
        
        # Efficient method usage (less repetition)
        method_counts = Counter(call['method'] for call in call_history)
        max_repetition = method_counts.most_common(1)[0][1]
        if max_repetition < len(call_history) * 0.3:
            score += 1.0
        
        return score
    
    def _expert_indicators(
        self,
        call_history: List[Dict[str, Any]],
        user_profile: Dict[str, Any]
    ) -> float:
        """Calculate score for expert level"""
        score = 0.0
        
        # Extensive history
        if len(call_history) >= 100:
            score += 2.0
        
        # Very wide variety
        unique_methods = len(set(call['method'] for call in call_history))
        if unique_methods >= 25:
            score += 2.0
        
        # Advanced patterns
        if self._detect_expert_patterns(call_history):
            score += 2.0
        
        # Optimal usage (minimal waste)
        if self._is_optimal_usage(call_history):
            score += 1.0
        
        return score
    
    def _detect_basic_patterns(self, call_history: List[Dict[str, Any]]) -> bool:
        """Detect basic usage patterns"""
        if len(call_history) < 3:
            return False
        
        # Check for sequential method usage
        methods = [call['method'] for call in call_history[-10:]]
        
        # Look for A -> B pattern
        for i in range(len(methods) - 1):
            if methods[i] != methods[i + 1]:
                return True
        
        return False
    
    def _detect_complex_patterns(self, call_history: List[Dict[str, Any]]) -> bool:
        """Detect complex usage patterns"""
        if len(call_history) < 5:
            return False
        
        methods = [call['method'] for call in call_history[-20:]]
        
        # Check for method chaining patterns (A -> B -> C)
        unique_sequences = set()
        for i in range(len(methods) - 2):
            sequence = tuple(methods[i:i+3])
            unique_sequences.add(sequence)
        
        # Complex patterns have multiple unique sequences
        return len(unique_sequences) >= 3
    
    def _detect_expert_patterns(self, call_history: List[Dict[str, Any]]) -> bool:
        """Detect expert-level usage patterns"""
        if len(call_history) < 10:
            return False
        
        # Check for optimization patterns, error handling, edge cases
        methods = [call['method'] for call in call_history[-30:]]
        
        # Look for advanced method combinations
        advanced_methods = ['optimize', 'cache', 'async', 'parallel', 'batch']
        expert_usage = any(
            any(adv in method.lower() for adv in advanced_methods)
            for method in methods
        )
        
        return expert_usage
    
    def _is_optimal_usage(self, call_history: List[Dict[str, Any]]) -> bool:
        """Check if usage patterns are optimal"""
        if len(call_history) < 10:
            return False
        
        # Calculate efficiency metrics
        unique_methods = len(set(call['method'] for call in call_history))
        total_calls = len(call_history)
        
        # Optimal usage has good variety without excessive repetition
        efficiency_ratio = unique_methods / total_calls
        return 0.4 <= efficiency_ratio <= 0.8
    
    def get_skill_progression(self, call_history: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Track skill progression over time
        
        Args:
            call_history: Complete call history
            
        Returns:
            List of skill level snapshots over time
        """
        progression = []
        window_size = 10
        
        for i in range(window_size, len(call_history) + 1, window_size):
            window = call_history[max(0, i - window_size):i]
            level = self.infer_level(window, {})
            
            progression.append({
                'call_count': i,
                'skill_level': level,
                'unique_methods': len(set(call['method'] for call in window))
            })
        
        return progression
    
    def suggest_skill_improvement(
        self,
        current_level: str,
        call_history: List[Dict[str, Any]]
    ) -> List[str]:
        """
        Suggest ways to improve skills
        
        Args:
            current_level: Current skill level
            call_history: Call history
            
        Returns:
            List of suggestions
        """
        suggestions = []
        
        if current_level == 'beginner':
            suggestions.extend([
                "Try exploring more diverse methods",
                "Practice combining methods together",
                "Experiment with different parameters"
            ])
        elif current_level == 'intermediate':
            suggestions.extend([
                "Learn advanced patterns and best practices",
                "Focus on optimization techniques",
                "Study error handling and edge cases"
            ])
        elif current_level == 'advanced':
            suggestions.extend([
                "Explore expert-level optimizations",
                "Study implementation details",
                "Contribute to documentation or teaching"
            ])
        
        return suggestions
