"""
Main Pedagogical API - Orchestrates all components
"""

import inspect
from typing import Any, Dict, List, Optional
from .learning_engine import AdaptiveLearningEngine
from .concept_mapper import ConceptDependencyMapper
from .skill_inference import SkillInferenceEngine
from .context_analyzer import ContextAnalyzer
from .insight_delivery import InsightDelivery


class PedagogicalAPI:
    """
    Main API that wraps existing APIs and adds pedagogical features
    """
    
    def __init__(self, wrapped_api: Any, max_history: int = 1000, default_verbosity: str = 'normal'):
        """
        Initialize the Pedagogical API
        
        Args:
            wrapped_api: The API to wrap with pedagogical features
            max_history: Maximum number of calls to keep in history
            default_verbosity: Default verbosity level
        """
        self.wrapped_api = wrapped_api
        self.max_history = max_history
        
        # Initialize all components
        self.learning_engine = AdaptiveLearningEngine()
        self.concept_mapper = ConceptDependencyMapper()
        self.skill_inference = SkillInferenceEngine()
        self.context_analyzer = ContextAnalyzer()
        self.insight_delivery = InsightDelivery(verbosity=default_verbosity)
        
        # Call history for tracking learning progress
        self._call_history: List[Dict[str, Any]] = []
        self._user_profile: Dict[str, Any] = {}
    
    def call(self, method_name: str, *args, **kwargs) -> Any:
        """
        Call a method on the wrapped API with pedagogical enhancements
        
        Args:
            method_name: Name of the method to call
            *args: Positional arguments for the method
            **kwargs: Keyword arguments for the method
            
        Returns:
            Result from the wrapped API method
        """
        # 1. Get calling context
        context = self.context_analyzer.analyze(inspect.currentframe())
        
        # 2. Execute the actual method
        if not hasattr(self.wrapped_api, method_name):
            raise AttributeError(f"Wrapped API has no method '{method_name}'")
        
        method = getattr(self.wrapped_api, method_name)
        result = method(*args, **kwargs)
        
        # 3. Record the call in history
        self._record_call(method_name, args, kwargs, result, context)
        
        # 4. Infer user skill level
        skill_level = self._infer_skill_level()
        
        # 5. Identify teaching opportunity
        teaching_moment = self.learning_engine.identify_teaching_opportunity(
            method=method_name,
            context=context,
            user_skill_level=skill_level,
            call_history=self._call_history
        )
        
        # 6. Deliver the teaching moment
        self.insight_delivery.deliver(teaching_moment, result)
        
        # 7. Return the result
        return result
    
    def _record_call(
        self,
        method: str,
        args: tuple,
        kwargs: dict,
        result: Any,
        context: Dict[str, Any]
    ):
        """Record a method call in history"""
        call_record = {
            'method': method,
            'args_count': len(args),
            'kwargs_count': len(kwargs),
            'result_type': type(result).__name__,
            'context': context,
            'timestamp': self._get_timestamp()
        }
        
        self._call_history.append(call_record)
        
        # Limit history size
        if len(self._call_history) > self.max_history:
            self._call_history = self._call_history[-self.max_history:]
    
    def _get_timestamp(self) -> str:
        """Get current timestamp"""
        from datetime import datetime
        return datetime.now().isoformat()
    
    def _infer_skill_level(self) -> str:
        """Infer the current skill level of the user"""
        return self.skill_inference.infer_level(
            self._call_history,
            self._user_profile
        )
    
    def get_learning_progress(self) -> Dict[str, Any]:
        """
        Get learning progress metrics
        
        Returns:
            Dictionary containing progress information
        """
        return self.learning_engine.get_progress(self._call_history)
    
    def set_verbosity(self, level: str):
        """
        Set the verbosity level for insights
        
        Args:
            level: 'minimal', 'normal', or 'detailed'
        """
        self.insight_delivery.set_verbosity(level)
    
    def get_skill_trajectory(self) -> List[Dict[str, Any]]:
        """
        Get skill level progression over time
        
        Returns:
            List of skill snapshots
        """
        return self.skill_inference.get_skill_progression(self._call_history)
    
    def get_concept_path(self, target_concept: str) -> List[Dict[str, Any]]:
        """
        Get learning path to a specific concept
        
        Args:
            target_concept: The concept to learn
            
        Returns:
            Ordered learning path
        """
        return self.concept_mapper.get_learning_path(target_concept)
    
    def suggest_next_concepts(self, mastered: Optional[List[str]] = None) -> List[str]:
        """
        Suggest next concepts to learn
        
        Args:
            mastered: List of mastered concepts (optional)
            
        Returns:
            List of suggested concepts
        """
        if mastered is None:
            # Infer from call history
            progress = self.get_learning_progress()
            mastered = progress.get('mastered_concepts', [])
        
        return self.concept_mapper.suggest_next_concepts(mastered)
    
    def get_skill_level(self) -> str:
        """
        Get the current inferred skill level
        
        Returns:
            Skill level: 'beginner', 'intermediate', 'advanced', or 'expert'
        """
        return self._infer_skill_level()
    
    def get_concept_difficulty(self, concept: str) -> str:
        """
        Get the difficulty level of a specific concept
        
        Args:
            concept: Name of the concept
            
        Returns:
            Difficulty level: 'beginner', 'intermediate', or 'advanced'
        """
        # Delegate to concept mapper
        return self.concept_mapper.get_concept_difficulty(concept)
    
    def reset_history(self):
        """Reset the call history"""
        self._call_history = []
    
    def export_history(self) -> List[Dict[str, Any]]:
        """
        Export call history
        
        Returns:
            Complete call history
        """
        return self._call_history.copy()
    
    def import_history(self, history: List[Dict[str, Any]]):
        """
        Import call history
        
        Args:
            history: Call history to import
        """
        self._call_history = history[-self.max_history:]
    
    def __getattr__(self, name: str) -> Any:
        """
        Forward attribute access to wrapped API
        
        This allows transparent access to wrapped API attributes
        """
        return getattr(self.wrapped_api, name)
