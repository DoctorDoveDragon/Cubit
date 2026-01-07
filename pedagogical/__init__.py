"""
Pedagogical API for Cubit Programming Language
Transforms Cubit into a teaching-focused programming environment
"""

__version__ = "0.1.0"
__author__ = "RITA 3 Team"

from .api import PedagogicalAPI
from .learning_engine import AdaptiveLearningEngine
from .concept_mapper import ConceptDependencyMapper
from .skill_inference import SkillInferenceEngine
from .context_analyzer import ContextAnalyzer
from .insight_delivery import InsightDelivery

__all__ = [
    'PedagogicalAPI',
    'AdaptiveLearningEngine',
    'ConceptDependencyMapper',
    'SkillInferenceEngine',
    'ContextAnalyzer',
    'InsightDelivery',
]
