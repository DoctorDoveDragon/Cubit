
import json
import uuid
import time
import asyncio
from enum import Enum
from typing import Dict, List, Optional, Any, Tuple, Union
from datetime import datetime, timedelta
from pathlib import Path
import pickle
import hashlib
import inspect
from dataclasses import dataclass, field, asdict
from abc import ABC, abstractmethod
import traceback

# ============ EXTERNAL DEPENDENCIES ============
try:
    from fastapi import FastAPI, HTTPException, Depends, BackgroundTasks, Query
    from fastapi.middleware.cors import CORSMiddleware
    from fastapi.responses import JSONResponse, StreamingResponse, HTMLResponse
    from fastapi.staticfiles import StaticFiles
    from fastapi.templating import Jinja2Templates
    from pydantic import BaseModel, Field, validator
    import uvicorn
    from sqlalchemy import create_engine, Column, Integer, String, Text, DateTime, JSON, Boolean, Float
    from sqlalchemy.ext.declarative import declarative_base
    from sqlalchemy.orm import sessionmaker, Session
    import numpy as np
    import pandas as pd
    import matplotlib.pyplot as plt
    from io import BytesIO, StringIO
    import base64
    import seaborn as sns
    from scipy import stats
    import plotly.graph_objects as go
    import plotly.express as px
    EXTERNAL_DEPS_AVAILABLE = True
except ImportError as e:
    print(f"Missing dependencies: {e}")
    print("Install with: pip install fastapi uvicorn sqlalchemy numpy pandas matplotlib seaborn scipy plotly")
    EXTERNAL_DEPS_AVAILABLE = False

# ============ DATA MODELS ============
class SkillLevel(str, Enum):
    BEGINNER = "beginner"
    INTERMEDIATE = "intermediate"
    ADVANCED = "advanced"
    EXPERT = "expert"

class TopicCategory(str, Enum):
    FILE_OPS = "file_operations"
    DATA_PROCESSING = "data_processing"
    DATA_ANALYSIS = "data_analysis"
    WEB_API = "web_api"
    DATABASE = "database"
    AUTOMATION = "automation"
    TESTING = "testing"
    OPTIMIZATION = "optimization"
    SECURITY = "security"
    VISUALIZATION = "visualization"

class LearningStyle(str, Enum):
    VISUAL = "visual"
    AUDITORY = "auditory"
    READ_WRITE = "read_write"
    KINESTHETIC = "kinesthetic"
    THEORETICAL = "theoretical"
    PRACTICAL = "practical"

class ChallengeType(str, Enum):
    MULTIPLE_CHOICE = "multiple_choice"
    CODE_COMPLETION = "code_completion"
    BUG_FIXING = "bug_fixing"
    ALGORITHM_DESIGN = "algorithm_design"
    CODE_REVIEW = "code_review"
    PERFORMANCE_OPT = "performance_optimization"
    SYSTEM_DESIGN = "system_design"

@dataclass
class UserProfile:
    """User learning profile with adaptive capabilities"""
    user_id: str
    skill_level: SkillLevel = SkillLevel.BEGINNER
    learning_style: LearningStyle = LearningStyle.PRACTICAL
    completed_topics: Dict[str, List[str]] = field(default_factory=dict)
    topic_proficiency: Dict[str, float] = field(default_factory=dict)  # 0-1 score
    learning_pace: float = 1.0  # Multiplier for difficulty adjustment
    preferred_topics: List[TopicCategory] = field(default_factory=list)
    weak_areas: List[str] = field(default_factory=list)
    session_history: List[Dict] = field(default_factory=list)
    created_at: datetime = field(default_factory=datetime.now)
    last_active: datetime = field(default_factory=datetime.now)
    
    def update_proficiency(self, topic: str, score: float):
        """Update proficiency with exponential moving average"""
        old_score = self.topic_proficiency.get(topic, 0.5)
        alpha = 0.3  # Learning rate
        new_score = old_score * (1 - alpha) + score * alpha
        self.topic_proficiency[topic] = min(1.0, max(0.0, new_score))
        self.last_active = datetime.now()
        
        # Update skill level if proficiency improves
        avg_proficiency = np.mean(list(self.topic_proficiency.values())) if self.topic_proficiency else 0
        if avg_proficiency > 0.8 and self.skill_level != SkillLevel.EXPERT:
            self.skill_level = SkillLevel.EXPERT
        elif avg_proficiency > 0.6 and self.skill_level not in [SkillLevel.ADVANCED, SkillLevel.EXPERT]:
            self.skill_level = SkillLevel.ADVANCED
        elif avg_proficiency > 0.4 and self.skill_level not in [SkillLevel.INTERMEDIATE, SkillLevel.ADVANCED, SkillLevel.EXPERT]:
            self.skill_level = SkillLevel.INTERMEDIATE

@dataclass
class LearningUnit:
    """A single learning unit (concept + example + exercise)"""
    unit_id: str
    title: str
    description: str
    category: TopicCategory
    skill_level: SkillLevel
    prerequisites: List[str]  # Unit IDs
    concepts: List[str]  # Key concepts covered
    code_examples: List[Dict]  # Dict with 'code', 'explanation', 'visualization'
    exercises: List[Dict]  # Challenges for this unit
    common_mistakes: List[Dict]  # Common errors and fixes
    real_world_applications: List[str]
    estimated_time: int  # Minutes
    tags: List[str]
    
    def get_adaptive_example(self, user_profile: UserProfile) -> Dict:
        """Get example adapted to user's learning style and level"""
        base_example = self.code_examples[0]
        
        if user_profile.learning_style == LearningStyle.VISUAL:
            return {
                **base_example,
                "visualization": True,
                "diagram": self._generate_visual_diagram(),
                "explanation": f"Visual representation: {base_example['explanation']}"
            }
        elif user_profile.learning_style == LearningStyle.THEORETICAL:
            return {
                **base_example,
                "theory_background": self._get_theory_background(),
                "mathematical_basis": self._get_math_basis()
            }
        elif user_profile.learning_style == LearningStyle.PRACTICAL:
            return {
                **base_example,
                "practical_tips": self._get_practical_tips(),
                "production_ready": True
            }
        return base_example
    
    def _generate_visual_diagram(self):
        """Generate visual diagram for the concept"""
        # This would be implemented with matplotlib/plotly
        return {"type": "flowchart", "data": "Visual representation of concept"}
    
    def _get_theory_background(self):
        """Get theoretical background"""
        return f"Theoretical basis for {self.title}"
    
    def _get_math_basis(self):
        """Get mathematical basis if applicable"""
        return "Mathematical foundation here"
    
    def _get_practical_tips(self):
        """Get practical implementation tips"""
        return ["Tip 1: Always handle exceptions", "Tip 2: Use context managers", "Tip 3: Write tests"]

@dataclass
class Challenge:
    """Interactive coding challenge"""
    challenge_id: str
    unit_id: str
    title: str
    description: str
    challenge_type: ChallengeType
    initial_code: str
    target_output: Any
    hints: List[str]
    difficulty: float  # 0-1
    time_limit: Optional[int] = None  # Seconds
    memory_limit: Optional[int] = None  # MB
    test_cases: List[Dict] = field(default_factory=list)
    solution_code: str = ""
    explanation: str = ""
    
    def validate_solution(self, user_code: str, execution_context: Dict = None) -> Dict:
        """Validate user's solution"""
        try:
            # Create safe execution environment
            safe_globals = {
                'np': np,
                'pd': pd,
                'plt': plt,
                'json': json,
                'datetime': datetime,
                'Path': Path,
                '__builtins__': {
                    'len': len,
                    'range': range,
                    'str': str,
                    'int': int,
                    'float': float,
                    'list': list,
                    'dict': dict,
                    'tuple': tuple,
                    'set': set,
                    'bool': bool,
                    'type': type,
                    'isinstance': isinstance,
                    'enumerate': enumerate,
                    'zip': zip,
                    'min': min,
                    'max': max,
                    'sum': sum,
                    'abs': abs,
                    'round': round
                }
            }
            
            # Add user's code to execution context
            exec(user_code, safe_globals)
            
            # Run test cases
            results = []
            for test_case in self.test_cases:
                # Execute test with timeout
                try:
                    result = eval(test_case['code'], safe_globals)
                    results.append({
                        'passed': result == test_case['expected'],
                        'input': test_case.get('input', ''),
                        'expected': test_case['expected'],
                        'actual': result
                    })
                except Exception as e:
                    results.append({
                        'passed': False,
                        'error': str(e),
                        'input': test_case.get('input', '')
                    })
            
            # Calculate score
            passed = sum(1 for r in results if r.get('passed', False))
            total = len(results)
            score = passed / total if total > 0 else 0
            
            return {
                'success': True,
                'score': score,
                'results': results,
                'feedback': self._generate_feedback(score, results)
            }
            
        except Exception as e:
            return {
                'success': False,
                'error': str(e),
                'traceback': traceback.format_exc(),
                'feedback': self._generate_error_feedback(e)
            }
    
    def _generate_feedback(self, score: float, results: List[Dict]) -> str:
        """Generate personalized feedback based on performance"""
        if score == 1.0:
            return "Excellent! All test cases passed. Consider optimizing your solution."
        elif score >= 0.7:
            return f"Good job! {int(score*100)}% of tests passed. Review the failed cases."
        elif score >= 0.4:
            return f"Progress made. {int(score*100)}% passed. Try using the hints."
        else:
            return f"Keep trying! Review the concepts and try a different approach."
    
    def _generate_error_feedback(self, error: Exception) -> str:
        """Generate helpful error feedback"""
        error_msg = str(error)
        if 'NameError' in error_msg:
            return "Check for undefined variables. Make sure all variables are declared before use."
        elif 'SyntaxError' in error_msg:
            return "There's a syntax error in your code. Check for missing parentheses, brackets, or colons."
        elif 'TypeError' in error_msg:
            return "Check your data types. You might be mixing incompatible types."
        elif 'IndexError' in error_msg:
            return "You're trying to access an index that doesn't exist. Check your list/array bounds."
        elif 'KeyError' in error_msg:
            return "The dictionary key you're trying to access doesn't exist."
        return "There's an error in your code. Read the error message carefully."

# ============ KNOWLEDGE GRAPH ============
class KnowledgeGraph:
    """Graph-based knowledge representation for recursive learning"""
    
    def __init__(self):
        self.nodes = {}  # unit_id -> LearningUnit
        self.edges = {}  # unit_id -> List[connected_unit_ids]
        self.prerequisites = {}  # unit_id -> List[prerequisite_ids]
        self.concept_map = {}  # concept -> List[unit_ids]
        
    def add_unit(self, unit: LearningUnit):
        """Add a learning unit to the graph"""
        self.nodes[unit.unit_id] = unit
        self.edges[unit.unit_id] = []
        self.prerequisites[unit.unit_id] = unit.prerequisites
        
        # Add forward edges from prerequisites
        for prereq_id in unit.prerequisites:
            if prereq_id in self.edges:
                self.edges[prereq_id].append(unit.unit_id)
        
        # Map concepts
        for concept in unit.concepts:
            if concept not in self.concept_map:
                self.concept_map[concept] = []
            self.concept_map[concept].append(unit.unit_id)
    
    def get_recommended_path(self, user_profile: UserProfile) -> List[str]:
        """Get optimal learning path based on user's profile"""
        completed = set()
        for topic_list in user_profile.completed_topics.values():
            completed.update(topic_list)
        
        # Start with prerequisites of preferred topics
        start_nodes = []
        for topic in user_profile.preferred_topics:
            topic_units = [uid for uid, u in self.nodes.items() 
                          if u.category == topic and u.skill_level.value <= user_profile.skill_level.value]
            start_nodes.extend(topic_units)
        
        if not start_nodes:
            # Start with beginner units
            start_nodes = [uid for uid, u in self.nodes.items() 
                          if u.skill_level == SkillLevel.BEGINNER]
        
        # Perform topological sort with prioritization
        visited = set()
        path = []
        
        def dfs(node_id):
            if node_id in visited:
                return
            visited.add(node_id)
            
            # Visit prerequisites first
            for prereq_id in self.prerequisites.get(node_id, []):
                if prereq_id not in completed:
                    dfs(prereq_id)
            
            if node_id not in completed:
                path.append(node_id)
            
            # Visit dependent nodes
            for next_id in self.edges.get(node_id, []):
                dfs(next_id)
        
        for start_node in start_nodes[:3]:  # Limit to 3 starting points
            dfs(start_node)
        
        return path[:10]  # Return first 10 units
    
    def find_gap_units(self, user_profile: UserProfile, target_unit: str) -> List[str]:
        """Find missing prerequisite units for a target unit"""
        target = self.nodes.get(target_unit)
        if not target:
            return []
        
        completed = set()
        for topic_list in user_profile.completed_topics.values():
            completed.update(topic_list)
        
        gaps = []
        to_check = list(target.prerequisites)
        
        while to_check:
            unit_id = to_check.pop()
            if unit_id in completed or unit_id in gaps:
                continue
            
            unit = self.nodes.get(unit_id)
            if unit:
                gaps.append(unit_id)
                to_check.extend(unit.prerequisites)
        
        return gaps[::-1]  # Return in learning order

# ============ ADAPTIVE LEARNING ENGINE ============
class AdaptiveLearningEngine:
    """Core engine for adaptive learning with recursive feedback"""
    
    def __init__(self, knowledge_graph: KnowledgeGraph):
        self.kg = knowledge_graph
        self.user_profiles = {}  # user_id -> UserProfile
        self.learning_sessions = {}  # session_id -> LearningSession
        self.code_executor = SafeCodeExecutor()
        
    def register_user(self, user_id: str, initial_level: SkillLevel = None) -> UserProfile:
        """Register a new user"""
        if initial_level is None:
            initial_level = SkillLevel.BEGINNER
        
        profile = UserProfile(
            user_id=user_id,
            skill_level=initial_level,
            learning_style=LearningStyle.PRACTICAL
        )
        
        self.user_profiles[user_id] = profile
        return profile
    
    def assess_skill_level(self, user_id: str, assessment_data: Dict) -> SkillLevel:
        """Assess user's skill level through interactive assessment"""
        profile = self.user_profiles.get(user_id)
        if not profile:
            profile = self.register_user(user_id)
        
        # Analyze assessment responses
        score = 0
        total = len(assessment_data.get('responses', []))
        
        for response in assessment_data['responses']:
            # Simple scoring - in production, this would be more sophisticated
            if response.get('correct', False):
                score += 1
        
        proficiency = score / total if total > 0 else 0
        
        # Determine level based on proficiency
        if proficiency >= 0.8:
            profile.skill_level = SkillLevel.EXPERT
        elif proficiency >= 0.6:
            profile.skill_level = SkillLevel.ADVANCED
        elif proficiency >= 0.4:
            profile.skill_level = SkillLevel.INTERMEDIATE
        else:
            profile.skill_level = SkillLevel.BEGINNER
        
        return profile.skill_level
    
    def get_next_learning_unit(self, user_id: str) -> Tuple[LearningUnit, Dict]:
        """Get the next appropriate learning unit for the user"""
        profile = self.user_profiles.get(user_id)
        if not profile:
            raise ValueError(f"User {user_id} not found")
        
        # Get recommended path
        recommended = self.kg.get_recommended_path(profile)
        
        if not recommended:
            # Fallback to beginner units
            beginner_units = [uid for uid, u in self.kg.nodes.items() 
                             if u.skill_level == SkillLevel.BEGINNER]
            recommended = beginner_units
        
        # Get the first uncompleted unit
        for unit_id in recommended:
            completed = any(unit_id in topics for topics in profile.completed_topics.values())
            if not completed:
                unit = self.kg.nodes[unit_id]
                
                # Check if prerequisites are met
                prereqs_met = all(
                    any(prereq_id in topics for topics in profile.completed_topics.values())
                    for prereq_id in unit.prerequisites
                )
                
                if prereqs_met or not unit.prerequisites:
                    # Generate adaptive content
                    adaptive_content = {
                        'example': unit.get_adaptive_example(profile),
                        'exercises': self._filter_exercises(unit.exercises, profile),
                        'explanations': self._adapt_explanations(unit.description, profile),
                        'visualizations': self._generate_visualizations(unit, profile)
                    }
                    
                    return unit, adaptive_content
        
        # All units completed or no suitable unit found
        return None, {}
    
    def submit_exercise(self, user_id: str, unit_id: str, exercise_id: str, 
                       user_code: str) -> Dict:
        """Submit and evaluate an exercise solution"""
        profile = self.user_profiles.get(user_id)
        if not profile:
            raise ValueError(f"User {user_id} not found")
        
        unit = self.kg.nodes.get(unit_id)
        if not unit:
            raise ValueError(f"Unit {unit_id} not found")
        
        # Find the exercise
        exercise = None
        for ex in unit.exercises:
            if ex.get('id') == exercise_id:
                exercise = ex
                break
        
        if not exercise:
            raise ValueError(f"Exercise {exercise_id} not found")
        
        # Create challenge from exercise
        challenge = Challenge(
            challenge_id=exercise_id,
            unit_id=unit_id,
            title=exercise.get('title', 'Exercise'),
            description=exercise.get('description', ''),
            challenge_type=ChallengeType(exercise.get('type', 'code_completion')),
            initial_code=exercise.get('initial_code', ''),
            target_output=exercise.get('expected_output'),
            hints=exercise.get('hints', []),
            difficulty=exercise.get('difficulty', 0.5),
            test_cases=exercise.get('test_cases', []),
            solution_code=exercise.get('solution', '')
        )
        
        # Validate solution
        result = challenge.validate_solution(user_code)
        
        # Update user profile
        if result['success']:
            # Update completed topics
            if unit.category.value not in profile.completed_topics:
                profile.completed_topics[unit.category.value] = []
            
            if unit.unit_id not in profile.completed_topics[unit.category.value]:
                profile.completed_topics[unit.category.value].append(unit.unit_id)
            
            # Update proficiency
            profile.update_proficiency(unit.category.value, result['score'])
            
            # Adjust learning pace based on performance
            if result['score'] > 0.8:
                profile.learning_pace = min(2.0, profile.learning_pace * 1.1)
            elif result['score'] < 0.4:
                profile.learning_pace = max(0.5, profile.learning_pace * 0.9)
        
        # Generate personalized feedback
        feedback = self._generate_detailed_feedback(result, profile, unit)
        
        return {
            **result,
            'feedback': feedback,
            'updated_profile': asdict(profile),
            'next_recommendations': self._get_next_recommendations(profile, unit_id, result['score'])
        }
    
    def _filter_exercises(self, exercises: List[Dict], profile: UserProfile) -> List[Dict]:
        """Filter and adapt exercises based on user profile"""
        filtered = []
        
        for ex in exercises:
            # Adjust difficulty based on learning pace
            base_difficulty = ex.get('difficulty', 0.5)
            adjusted_difficulty = base_difficulty * profile.learning_pace
            
            # Filter by skill level
            if adjusted_difficulty <= profile.skill_level.value / 4.0:  # Normalize 0-1
                # Adapt exercise description
                adapted_ex = ex.copy()
                if profile.learning_style == LearningStyle.VISUAL:
                    adapted_ex['description'] += "\n\n(Try to visualize the solution)"
                elif profile.learning_style == LearningStyle.THEORETICAL:
                    adapted_ex['description'] += "\n\n(Consider the theoretical implications)"
                
                filtered.append(adapted_ex)
        
        return filtered[:3]  # Limit to 3 exercises
    
    def _adapt_explanations(self, explanation: str, profile: UserProfile) -> str:
        """Adapt explanations based on learning style"""
        if profile.learning_style == LearningStyle.VISUAL:
            return f"🔍 {explanation}\n\nVisualize this concept as a workflow or diagram."
        elif profile.learning_style == LearningStyle.AUDITORY:
            return f"👂 {explanation}\n\nTry explaining this concept out loud to reinforce understanding."
        elif profile.learning_style == LearningStyle.THEORETICAL:
            return f"📚 {explanation}\n\nConsider the underlying theory and mathematical basis."
        elif profile.learning_style == LearningStyle.PRACTICAL:
            return f"🔧 {explanation}\n\nFocus on practical applications and real-world use cases."
        return explanation
    
    def _generate_visualizations(self, unit: LearningUnit, profile: UserProfile) -> List[Dict]:
        """Generate visualizations for the learning unit"""
        visualizations = []
        
        if profile.learning_style == LearningStyle.VISUAL:
            # Generate flowchart for concept
            visualizations.append({
                'type': 'flowchart',
                'title': f'Concept Flow: {unit.title}',
                'data': self._create_concept_flowchart(unit)
            })
            
            # Generate code execution visualization
            for i, example in enumerate(unit.code_examples[:2]):
                visualizations.append({
                    'type': 'execution_trace',
                    'title': f'Code Trace Example {i+1}',
                    'data': self._trace_code_execution(example['code'])
                })
        
        return visualizations
    
    def _create_concept_flowchart(self, unit: LearningUnit) -> Dict:
        """Create flowchart for a concept"""
        return {
            'nodes': [
                {'id': 'start', 'label': 'Start', 'type': 'start'},
                {'id': 'concept', 'label': unit.title, 'type': 'process'},
                {'id': 'example', 'label': 'Examples', 'type': 'process'},
                {'id': 'practice', 'label': 'Practice', 'type': 'process'},
                {'id': 'end', 'label': 'Mastered', 'type': 'end'}
            ],
            'edges': [
                {'from': 'start', 'to': 'concept', 'label': 'Learn'},
                {'from': 'concept', 'to': 'example', 'label': 'See Examples'},
                {'from': 'example', 'to': 'practice', 'label': 'Practice'},
                {'from': 'practice', 'to': 'end', 'label': 'Validate'}
            ]
        }
    
    def _trace_code_execution(self, code: str) -> Dict:
        """Create execution trace visualization"""
        # Simplified trace - in production, would use actual tracing
        lines = code.split('\n')
        trace = []
        
        for i, line in enumerate(lines):
            if line.strip() and not line.strip().startswith('#'):
                trace.append({
                    'line': i + 1,
                    'code': line.strip(),
                    'explanation': f"Executing line {i+1}: {line.strip()[:50]}..."
                })
        
        return {'lines': trace, 'total_steps': len(trace)}
    
    def _generate_detailed_feedback(self, result: Dict, profile: UserProfile, 
                                   unit: LearningUnit) -> Dict:
        """Generate detailed, personalized feedback"""
        feedback = {
            'summary': result.get('feedback', ''),
            'detailed_analysis': [],
            'suggestions': [],
            'resources': [],
            'next_steps': []
        }
        
        score = result.get('score', 0)
        
        # Add detailed analysis
        if 'results' in result:
            for i, test_result in enumerate(result['results']):
                if test_result.get('passed', False):
                    feedback['detailed_analysis'].append(
                        f"✓ Test case {i+1} passed successfully."
                    )
                else:
                    error = test_result.get('error', '')
                    feedback['detailed_analysis'].append(
                        f"✗ Test case {i+1} failed: {error}"
                    )
        
        # Add suggestions based on performance
        if score >= 0.8:
            feedback['suggestions'].append(
                "Great work! Try optimizing your solution for better performance."
            )
            feedback['suggestions'].append(
                "Consider edge cases that might break your solution."
            )
        elif score >= 0.5:
            feedback['suggestions'].append(
                "Review the failed test cases and understand why they failed."
            )
            feedback['suggestions'].append(
                "Try breaking down the problem into smaller parts."
            )
        else:
            feedback['suggestions'].append(
                "Review the core concepts from this unit."
            )
            feedback['suggestions'].append(
                "Try solving simpler variations of this problem first."
            )
        
        # Add learning style specific resources
        if profile.learning_style == LearningStyle.VISUAL:
            feedback['resources'].append("Watch video tutorials on this topic.")
            feedback['resources'].append("Create diagrams to visualize the solution.")
        elif profile.learning_style == LearningStyle.THEORETICAL:
            feedback['resources'].append("Read about the theory behind this concept.")
            feedback['resources'].append("Study mathematical proofs if applicable.")
        
        # Add unit-specific resources
        feedback['resources'].extend(unit.real_world_applications[:2])
        
        return feedback
    
    def _get_next_recommendations(self, profile: UserProfile, current_unit_id: str, 
                                score: float) -> List[Dict]:
        """Get next learning recommendations"""
        recommendations = []
        
        current_unit = self.kg.nodes.get(current_unit_id)
        if not current_unit:
            return recommendations
        
        # If score is low, recommend revisiting prerequisites
        if score < 0.5:
            for prereq_id in current_unit.prerequisites:
                prereq = self.kg.nodes.get(prereq_id)
                if prereq:
                    recommendations.append({
                        'type': 'review',
                        'unit_id': prereq_id,
                        'title': f"Review: {prereq.title}",
                        'reason': 'Prerequisite concept needs strengthening',
                        'priority': 'high'
                    })
        
        # Recommend next units
        for next_id in self.kg.edges.get(current_unit_id, []):
            next_unit = self.kg.nodes.get(next_id)
            if next_unit:
                recommendations.append({
                    'type': 'continue',
                    'unit_id': next_id,
                    'title': next_unit.title,
                    'reason': 'Natural progression from current topic',
                    'priority': 'medium'
                })
        
        # Recommend complementary topics
        for concept in current_unit.concepts:
            related_units = self.kg.concept_map.get(concept, [])
            for unit_id in related_units:
                if unit_id != current_unit_id:
                    unit = self.kg.nodes.get(unit_id)
                    if unit and unit.unit_id not in [r['unit_id'] for r in recommendations]:
                        recommendations.append({
                            'type': 'complementary',
                            'unit_id': unit_id,
                            'title': unit.title,
                            'reason': f'Related concept: {concept}',
                            'priority': 'low'
                        })
        
        return recommendations[:5]  # Limit to 5 recommendations

# ============ SAFE CODE EXECUTOR ============
class SafeCodeExecutor:
    """Secure code execution sandbox"""
    
    def __init__(self):
        self.allowed_modules = {
            'math': ['sqrt', 'sin', 'cos', 'tan', 'log', 'exp', 'pi', 'e'],
            'random': ['random', 'randint', 'choice', 'shuffle'],
            'datetime': ['datetime', 'date', 'time', 'timedelta'],
            'collections': ['Counter', 'defaultdict', 'deque', 'namedtuple'],
            'itertools': ['chain', 'combinations', 'permutations', 'product'],
            'json': ['dumps', 'loads'],
            're': ['search', 'match', 'findall', 'sub', 'compile'],
            'string': ['ascii_letters', 'digits', 'punctuation', 'whitespace'],
            'statistics': ['mean', 'median', 'stdev', 'variance']
        }
        
        self.restricted_keywords = [
            'import', 'exec', 'eval', '__import__', 'open', 'file',
            'os.', 'sys.', 'subprocess', 'shutil', 'socket', 'requests',
            'compile', 'execfile', 'getattr', 'setattr', 'delattr',
            '__builtins__', '__dict__', '__globals__', '__code__'
        ]
    
    def execute_safely(self, code: str, timeout: int = 5) -> Dict:
        """Execute code in a safe environment"""
        # Check for restricted keywords
        for keyword in self.restricted_keywords:
            if keyword in code.lower():
                return {
                    'success': False,
                    'error': f'Restricted keyword detected: {keyword}',
                    'output': ''
                }
        
        # Create safe globals
        safe_globals = {
            '__builtins__': {
                'print': print,
                'len': len,
                'range': range,
                'enumerate': enumerate,
                'zip': zip,
                'map': map,
                'filter': filter,
                'sorted': sorted,
                'reversed': reversed,
                'min': min,
                'max': max,
                'sum': sum,
                'abs': abs,
                'round': round,
                'bool': bool,
                'int': int,
                'float': float,
                'str': str,
                'list': list,
                'dict': dict,
                'tuple': tuple,
                'set': set,
                'type': type,
                'isinstance': isinstance,
                'issubclass': issubclass,
                'hasattr': hasattr,
                'getattr': getattr,
                'setattr': setattr,
                'all': all,
                'any': any
            }
        }
        
        # Add allowed modules
        for module, functions in self.allowed_modules.items():
            try:
                mod = __import__(module)
                for func in functions:
                    if hasattr(mod, func):
                        safe_globals[func] = getattr(mod, func)
            except ImportError:
                pass
        
        # Capture output
        import io
        import sys
        
        old_stdout = sys.stdout
        sys.stdout = io.StringIO()
        
        try:
            # Execute with timeout
            exec(code, safe_globals)
            output = sys.stdout.getvalue()
            
            return {
                'success': True,
                'output': output,
                'error': None
            }
            
        except Exception as e:
            return {
                'success': False,
                'output': sys.stdout.getvalue(),
                'error': str(e),
                'traceback': traceback.format_exc()
            }
        
        finally:
            sys.stdout = old_stdout

# ============ KNOWLEDGE BASE BUILDER ============
class KnowledgeBaseBuilder:
    """Builds the knowledge base from our comprehensive chat content"""
    
    def __init__(self):
        self.units = []
        self.challenges = []
    
    def build_from_chat_content(self) -> List[LearningUnit]:
        """Build learning units from the comprehensive chat content"""
        
        # ============ FILE OPERATIONS UNITS ============
        self.units.extend([
            LearningUnit(
                unit_id="file_ops_basic_1",
                title="Basic File Reading and Writing",
                description="Learn to read from and write to text files in Python",
                category=TopicCategory.FILE_OPS,
                skill_level=SkillLevel.BEGINNER,
                prerequisites=[],
                concepts=["File I/O", "Context Managers", "Encoding"],
                code_examples=[
                    {
                        "code": """# Reading a file
with open('example.txt', 'r') as file:
    content = file.read()
    print(content)

# Writing to a file
with open('output.txt', 'w') as file:
    file.write('Hello, World!')""",
                        "explanation": "Using 'with' statement ensures proper file closure",
                        "visualization": "file_flow.png"
                    }
                ],
                exercises=[
                    {
                        "id": "file_read_exercise",
                        "title": "Read and Process File",
                        "description": "Read a file and count the number of lines",
                        "type": "code_completion",
                        "initial_code": """def count_lines(filename):
    # Your code here
    pass""",
                        "expected_output": "Function should return line count",
                        "difficulty": 0.3,
                        "test_cases": [
                            {"code": "count_lines('test.txt')", "expected": 5}
                        ],
                        "solution": """def count_lines(filename):
    with open(filename, 'r') as file:
        return len(file.readlines())"""
                    }
                ],
                common_mistakes=[
                    {
                        "mistake": "Not closing files properly",
                        "fix": "Always use 'with' statement",
                        "example": "Bad: f = open('file.txt')\nGood: with open('file.txt') as f:"
                    }
                ],
                real_world_applications=[
                    "Log file analysis",
                    "Configuration file reading",
                    "Data export to CSV"
                ],
                estimated_time=15,
                tags=["files", "io", "beginner"]
            ),
            
            LearningUnit(
                unit_id="file_ops_csv_2",
                title="CSV File Processing",
                description="Work with CSV files using Python's csv module",
                category=TopicCategory.FILE_OPS,
                skill_level=SkillLevel.INTERMEDIATE,
                prerequisites=["file_ops_basic_1"],
                concepts=["CSV parsing", "DataFrames", "Delimiters"],
                code_examples=[
                    {
                        "code": """import csv

# Reading CSV
with open('data.csv', 'r') as file:
    reader = csv.reader(file)
    for row in reader:
        print(row)

# Writing CSV
data = [['Name', 'Age'], ['Alice', 30], ['Bob', 25]]
with open('output.csv', 'w', newline='') as file:
    writer = csv.writer(file)
    writer.writerows(data)""",
                        "explanation": "CSV module handles quoting and delimiters automatically",
                        "visualization": "csv_structure.png"
                    }
                ],
                exercises=[
                    {
                        "id": "csv_processing",
                        "title": "CSV Data Analysis",
                        "description": "Read CSV and calculate average of a numeric column",
                        "type": "bug_fixing",
                        "initial_code": """import csv

def calculate_average(filename, column_index):
    total = 0
    count = 0
    with open(filename, 'r') as file:
        reader = csv.reader(file)
        for row in reader:
            total += row[column_index]
            count += 1
    return total / count""",
                        "expected_output": "Correct average calculation",
                        "difficulty": 0.4,
                        "test_cases": [],
                        "solution": """import csv

def calculate_average(filename, column_index):
    total = 0
    count = 0
    with open(filename, 'r') as file:
        reader = csv.reader(file)
        next(reader)  # Skip header
        for row in reader:
            total += float(row[column_index])
            count += 1
    return total / count if count > 0 else 0"""
                    }
                ],
                common_mistakes=[
                    {
                        "mistake": "Forgetting to convert strings to numbers",
                        "fix": "Use float() or int() conversion",
                        "example": "Bad: total += row[1]\nGood: total += float(row[1])"
                    }
                ],
                real_world_applications=[
                    "Data import/export",
                    "Report generation",
                    "Data cleaning"
                ],
                estimated_time=20,
                tags=["csv", "data", "intermediate"]
            )
        ])
        
        # ============ DATA PROCESSING UNITS ============
        self.units.extend([
            LearningUnit(
                unit_id="data_strings_1",
                title="String Manipulation",
                description="Comprehensive string operations and methods",
                category=TopicCategory.DATA_PROCESSING,
                skill_level=SkillLevel.BEGINNER,
                prerequisites=[],
                concepts=["String methods", "Formatting", "Regular expressions"],
                code_examples=[
                    {
                        "code": """# Basic string operations
text = "  Hello, World!  "
print(text.strip())          # Remove whitespace
print(text.upper())          # Convert to uppercase
print(text.replace('World', 'Python'))  # Replace substring

# String formatting
name = "Alice"
age = 30
print(f"{name} is {age} years old")  # f-string
print("{} is {} years old".format(name, age))  # format method""",
                        "explanation": "Strings are immutable - operations return new strings",
                        "visualization": "string_operations.png"
                    }
                ],
                exercises=[
                    {
                        "id": "string_cleanup",
                        "title": "Text Cleanup Function",
                        "description": "Create a function to clean and normalize text",
                        "type": "code_completion",
                        "initial_code": """def clean_text(text):
    # Remove extra whitespace, lowercase, and remove punctuation
    # Return cleaned text
    pass""",
                        "expected_output": "Cleaned text string",
                        "difficulty": 0.4,
                        "test_cases": [
                            {"code": "clean_text('  Hello, WORLD!  ')", "expected": "hello world"}
                        ],
                        "solution": """import string

def clean_text(text):
    # Remove punctuation
    text = text.translate(str.maketrans('', '', string.punctuation))
    # Convert to lowercase and strip whitespace
    text = text.lower().strip()
    # Remove extra spaces
    return ' '.join(text.split())"""
                    }
                ],
                common_mistakes=[
                    {
                        "mistake": "Modifying strings in place",
                        "fix": "Remember strings are immutable",
                        "example": "Bad: text[0] = 'H'\nGood: text = 'H' + text[1:]"
                    }
                ],
                real_world_applications=[
                    "Text preprocessing for NLP",
                    "Data cleaning",
                    "User input validation"
                ],
                estimated_time=25,
                tags=["strings", "text", "beginner"]
            )
        ])
        
        # ============ DATA ANALYSIS UNITS ============
        self.units.extend([
            LearningUnit(
                unit_id="analysis_pandas_1",
                title="Pandas DataFrame Basics",
                description="Introduction to data manipulation with pandas",
                category=TopicCategory.DATA_ANALYSIS,
                skill_level=SkillLevel.INTERMEDIATE,
                prerequisites=["file_ops_csv_2"],
                concepts=["DataFrames", "Series", "Data cleaning"],
                code_examples=[
                    {
                        "code": """import pandas as pd

# Creating DataFrames
data = {'Name': ['Alice', 'Bob', 'Charlie'],
        'Age': [25, 30, 35],
        'City': ['NYC', 'London', 'Tokyo']}
df = pd.DataFrame(data)

# Basic operations
print(df.head())  # First few rows
print(df.info())  # DataFrame info
print(df.describe())  # Statistical summary

# Filtering data
young_people = df[df['Age'] < 30]
print(young_people)""",
                        "explanation": "DataFrames are 2D labeled data structures with columns of potentially different types",
                        "visualization": "dataframe_structure.png"
                    }
                ],
                exercises=[
                    {
                        "id": "data_analysis_task",
                        "title": "Data Analysis Challenge",
                        "description": "Load data and perform basic analysis",
                        "type": "algorithm_design",
                        "initial_code": """import pandas as pd

def analyze_data(filename):
    # Load CSV file
    # Calculate mean, median, std of numeric columns
    # Return summary statistics
    pass""",
                        "expected_output": "Dictionary of statistics",
                        "difficulty": 0.5,
                        "test_cases": [],
                        "solution": """import pandas as pd

def analyze_data(filename):
    df = pd.read_csv(filename)
    
    # Select numeric columns
    numeric_cols = df.select_dtypes(include=['number']).columns
    
    results = {}
    for col in numeric_cols:
        results[col] = {
            'mean': df[col].mean(),
            'median': df[col].median(),
            'std': df[col].std(),
            'min': df[col].min(),
            'max': df[col].max()
        }
    
    return results"""
                    }
                ],
                common_mistakes=[
                    {
                        "mistake": "Modifying a slice of DataFrame",
                        "fix": "Use .copy() or .loc",
                        "example": "Bad: df[df['Age'] < 30]['Name'] = 'Young'\nGood: df.loc[df['Age'] < 30, 'Name'] = 'Young'"
                    }
                ],
                real_world_applications=[
                    "Data exploration",
                    "Business intelligence",
                    "Statistical analysis"
                ],
                estimated_time=30,
                tags=["pandas", "dataframe", "analysis"]
            )
        ])
        
        # ============ VISUALIZATION UNITS ============
        self.units.extend([
            LearningUnit(
                unit_id="viz_matplotlib_1",
                title="Data Visualization with Matplotlib",
                description="Creating plots and charts with matplotlib",
                category=TopicCategory.VISUALIZATION,
                skill_level=SkillLevel.INTERMEDIATE,
                prerequisites=["analysis_pandas_1"],
                concepts=["Plotting", "Subplots", "Customization"],
                code_examples=[
                    {
                        "code": """import matplotlib.pyplot as plt
import numpy as np

# Create data
x = np.linspace(0, 10, 100)
y = np.sin(x)

# Basic plot
plt.figure(figsize=(10, 6))
plt.plot(x, y, 'b-', linewidth=2, label='sin(x)')
plt.xlabel('X-axis')
plt.ylabel('Y-axis')
plt.title('Sine Wave')
plt.legend()
plt.grid(True, alpha=0.3)
plt.show()""",
                        "explanation": "Matplotlib follows a procedural approach for plotting",
                        "visualization": "matplotlib_plot.png"
                    }
                ],
                exercises=[
                    {
                        "id": "custom_visualization",
                        "title": "Create Custom Visualization",
                        "description": "Generate a multi-plot figure with different chart types",
                        "type": "code_completion",
                        "initial_code": """import matplotlib.pyplot as plt
import numpy as np

def create_dashboard(data):
    # Create 2x2 subplot grid
    # 1. Line plot
    # 2. Scatter plot
    # 3. Histogram
    # 4. Bar chart
    pass""",
                        "expected_output": "Figure object with 4 subplots",
                        "difficulty": 0.6,
                        "test_cases": [],
                        "solution": """import matplotlib.pyplot as plt
import numpy as np

def create_dashboard(data):
    fig, axes = plt.subplots(2, 2, figsize=(12, 8))
    
    # Line plot
    axes[0, 0].plot(data['x'], data['y1'])
    axes[0, 0].set_title('Line Plot')
    
    # Scatter plot
    axes[0, 1].scatter(data['x'], data['y2'])
    axes[0, 1].set_title('Scatter Plot')
    
    # Histogram
    axes[1, 0].hist(data['values'], bins=20)
    axes[1, 0].set_title('Histogram')
    
    # Bar chart
    categories = ['A', 'B', 'C', 'D']
    values = data['bar_values']
    axes[1, 1].bar(categories, values)
    axes[1, 1].set_title('Bar Chart')
    
    plt.tight_layout()
    return fig"""
                    }
                ],
                common_mistakes=[
                    {
                        "mistake": "Not using tight_layout()",
                        "fix": "Always call tight_layout() to prevent label overlap",
                        "example": "plt.tight_layout()"
                    }
                ],
                real_world_applications=[
                    "Data reporting",
                    "Scientific visualization",
                    "Business dashboards"
                ],
                estimated_time=35,
                tags=["matplotlib", "visualization", "plots"]
            )
        ])
        
        # Add more units for other categories...
        
        return self.units

# ============ FASTAPI APPLICATION ============
class PedagogicCodingEngineAPI:
    """FastAPI application for the pedagogic coding engine"""
    
    def __init__(self):
        if not EXTERNAL_DEPS_AVAILABLE:
            raise ImportError("Required dependencies not installed")
        
        self.app = FastAPI(
            title="Pedagogic Python Coding Engine",
            description="Adaptive learning platform for Python programming",
            version="1.0.0"
        )
        
        # Setup CORS
        self.app.add_middleware(
            CORSMiddleware,
            allow_origins=["*"],
            allow_credentials=True,
            allow_methods=["*"],
            allow_headers=["*"],
        )
        
        # Initialize components
        self.kb_builder = KnowledgeBaseBuilder()
        self.learning_units = self.kb_builder.build_from_chat_content()
        
        self.knowledge_graph = KnowledgeGraph()
        for unit in self.learning_units:
            self.knowledge_graph.add_unit(unit)
        
        self.learning_engine = AdaptiveLearningEngine(self.knowledge_graph)
        
        # Setup routes
        self.setup_routes()
        
        # Static files and templates
        self.app.mount("/static", StaticFiles(directory="static"), name="static")
        self.templates = Jinja2Templates(directory="templates")
    
    def setup_routes(self):
        """Setup all API routes"""
        
        # ============ MODELS ============
        class UserRegistration(BaseModel):
            user_id: str
            initial_level: Optional[SkillLevel] = SkillLevel.BEGINNER
            learning_style: Optional[LearningStyle] = LearningStyle.PRACTICAL
            preferred_topics: Optional[List[TopicCategory]] = []
        
        class ExerciseSubmission(BaseModel):
            user_id: str
            unit_id: str
            exercise_id: str
            code: str
        
        class AssessmentData(BaseModel):
            user_id: str
            responses: List[Dict[str, Any]]
        
        # ============ ROUTES ============
        
        @self.app.get("/")
        async def root():
            return {
                "message": "Pedagogic Python Coding Engine API",
                "version": "1.0.0",
                "endpoints": [
                    "/docs - API documentation",
                    "/register - Register new user",
                    "/next-unit/{user_id} - Get next learning unit",
                    "/submit-exercise - Submit exercise solution",
                    "/assess-level - Assess skill level"
                ]
            }
        
        @self.app.post("/register")
        async def register_user(user_data: UserRegistration):
            """Register a new user"""
            try:
                profile = self.learning_engine.register_user(
                    user_id=user_data.user_id,
                    initial_level=user_data.initial_level
                )
                
                # Update additional profile info
                if user_data.learning_style:
                    profile.learning_style = user_data.learning_style
                if user_data.preferred_topics:
                    profile.preferred_topics = user_data.preferred_topics
                
                return {
                    "success": True,
                    "message": "User registered successfully",
                    "user_profile": asdict(profile)
                }
            except Exception as e:
                raise HTTPException(status_code=400, detail=str(e))
        
        @self.app.get("/user/{user_id}")
        async def get_user_profile(user_id: str):
            """Get user profile"""
            profile = self.learning_engine.user_profiles.get(user_id)
            if not profile:
                raise HTTPException(status_code=404, detail="User not found")
            
            return {
                "success": True,
                "profile": asdict(profile)
            }
        
        @self.app.get("/next-unit/{user_id}")
        async def get_next_unit(user_id: str):
            """Get next learning unit for user"""
            try:
                unit, adaptive_content = self.learning_engine.get_next_learning_unit(user_id)
                
                if not unit:
                    return {
                        "success": False,
                        "message": "No more units available or all completed",
                        "recommendations": self.knowledge_graph.get_recommended_path(
                            self.learning_engine.user_profiles[user_id]
                        )
                    }
                
                return {
                    "success": True,
                    "unit": {
                        "id": unit.unit_id,
                        "title": unit.title,
                        "description": unit.description,
                        "category": unit.category.value,
                        "skill_level": unit.skill_level.value,
                        "estimated_time": unit.estimated_time,
                        "concepts": unit.concepts
                    },
                    "adaptive_content": adaptive_content,
                    "common_mistakes": unit.common_mistakes,
                    "real_world_applications": unit.real_world_applications
                }
            except Exception as e:
                raise HTTPException(status_code=400, detail=str(e))
        
        @self.app.post("/submit-exercise")
        async def submit_exercise(submission: ExerciseSubmission):
            """Submit and evaluate an exercise"""
            try:
                result = self.learning_engine.submit_exercise(
                    user_id=submission.user_id,
                    unit_id=submission.unit_id,
                    exercise_id=submission.exercise_id,
                    user_code=submission.code
                )
                
                return {
                    "success": True,
                    "result": result
                }
            except Exception as e:
                raise HTTPException(status_code=400, detail=str(e))
        
        @self.app.post("/assess-level")
        async def assess_skill_level(assessment: AssessmentData):
            """Assess user's skill level"""
            try:
                level = self.learning_engine.assess_skill_level(
                    user_id=assessment.user_id,
                    assessment_data=assessment.dict()
                )
                
                return {
                    "success": True,
                    "skill_level": level.value,
                    "profile": asdict(self.learning_engine.user_profiles[assessment.user_id])
                }
            except Exception as e:
                raise HTTPException(status_code=400, detail=str(e))
        
        @self.app.get("/learning-path/{user_id}")
        async def get_learning_path(user_id: str):
            """Get recommended learning path for user"""
            profile = self.learning_engine.user_profiles.get(user_id)
            if not profile:
                raise HTTPException(status_code=404, detail="User not found")
            
            path = self.knowledge_graph.get_recommended_path(profile)
            
            # Get unit details for the path
            path_details = []
            for unit_id in path[:10]:  # Limit to 10 units
                unit = self.knowledge_graph.nodes.get(unit_id)
                if unit:
                    path_details.append({
                        "id": unit.unit_id,
                        "title": unit.title,
                        "category": unit.category.value,
                        "skill_level": unit.skill_level.value,
                        "estimated_time": unit.estimated_time
                    })
            
            return {
                "success": True,
                "path": path_details,
                "total_units": len(path),
                "estimated_total_time": sum(u.estimated_time for u in self.knowledge_graph.nodes.values() 
                                          if u.unit_id in path[:10])
            }
        
        @self.app.get("/gap-analysis/{user_id}/{target_unit_id}")
        async def get_gap_analysis(user_id: str, target_unit_id: str):
            """Analyze knowledge gaps for a target unit"""
            profile = self.learning_engine.user_profiles.get(user_id)
            if not profile:
                raise HTTPException(status_code=404, detail="User not found")
            
            gaps = self.knowledge_graph.find_gap_units(profile, target_unit_id)
            
            gap_details = []
            for unit_id in gaps:
                unit = self.knowledge_graph.nodes.get(unit_id)
                if unit:
                    gap_details.append({
                        "id": unit.unit_id,
                        "title": unit.title,
                        "reason": "Missing prerequisite",
                        "priority": "high"
                    })
            
            return {
                "success": True,
                "gaps": gap_details,
                "total_gaps": len(gaps),
                "recommendation": f"Complete {len(gaps)} prerequisite units before attempting target unit"
            }
        
        @self.app.get("/execute-code")
        async def execute_code(code: str = Query(..., description="Python code to execute")):
            """Safe code execution endpoint"""
            executor = SafeCodeExecutor()
            result = executor.execute_safely(code)
            
            return {
                "success": result['success'],
                "output": result['output'],
                "error": result.get('error'),
                "traceback": result.get('traceback')
            }
        
        @self.app.get("/visualize/{unit_id}")
        async def visualize_unit(unit_id: str):
            """Generate visualizations for a unit"""
            unit = self.knowledge_graph.nodes.get(unit_id)
            if not unit:
                raise HTTPException(status_code=404, detail="Unit not found")
            
            # Generate visualizations (simplified)
            visualizations = []
            
            for i, example in enumerate(unit.code_examples[:3]):
                # Create simple flowchart for each example
                flowchart = {
                    "type": "flowchart",
                    "title": f"Example {i+1} Flow",
                    "data": {
                        "nodes": [
                            {"id": "start", "label": "Start"},
                            {"id": "process", "label": "Process Data"},
                            {"id": "output", "label": "Generate Output"},
                            {"id": "end", "label": "End"}
                        ],
                        "edges": [
                            {"from": "start", "to": "process", "label": "input"},
                            {"from": "process", "to": "output", "label": "transform"},
                            {"from": "output", "to": "end", "label": "result"}
                        ]
                    }
                }
                visualizations.append(flowchart)
            
            return {
                "success": True,
                "unit_id": unit_id,
                "unit_title": unit.title,
                "visualizations": visualizations
            }
        
        @self.app.get("/progress/{user_id}")
        async def get_learning_progress(user_id: str):
            """Get user's learning progress"""
            profile = self.learning_engine.user_profiles.get(user_id)
            if not profile:
                raise HTTPException(status_code=404, detail="User not found")
            
            # Calculate progress statistics
            total_units = len(self.knowledge_graph.nodes)
            completed_units = sum(len(topics) for topics in profile.completed_topics.values())
            
            progress_by_category = {}
            for category in TopicCategory:
                cat_units = [u for u in self.learning_units if u.category == category]
                completed = len(profile.completed_topics.get(category.value, []))
                progress_by_category[category.value] = {
                    "completed": completed,
                    "total": len(cat_units),
                    "percentage": (completed / len(cat_units) * 100) if cat_units else 0
                }
            
            # Calculate streak
            streak = 0
            if profile.session_history:
                dates = [datetime.fromisoformat(s.get('date', '')) 
                        for s in profile.session_history if 'date' in s]
                dates.sort(reverse=True)
                
                if dates:
                    today = datetime.now().date()
                    last_date = dates[0].date()
                    if last_date == today:
                        streak = 1
                        for i in range(1, len(dates)):
                            if dates[i].date() == today - timedelta(days=i):
                                streak += 1
                            else:
                                break
            
            return {
                "success": True,
                "progress": {
                    "overall": {
                        "completed": completed_units,
                        "total": total_units,
                        "percentage": (completed_units / total_units * 100) if total_units else 0
                    },
                    "by_category": progress_by_category,
                    "proficiency": profile.topic_proficiency,
                    "skill_level": profile.skill_level.value,
                    "learning_pace": profile.learning_pace,
                    "current_streak": streak
                }
            }
        
        @self.app.get("/recommendations/{user_id}")
        async def get_personalized_recommendations(user_id: str):
            """Get personalized learning recommendations"""
            profile = self.learning_engine.user_profiles.get(user_id)
            if not profile:
                raise HTTPException(status_code=404, detail="User not found")
            
            recommendations = []
            
            # 1. Weak areas focus
            for area in profile.weak_areas[:2]:
                related_units = [u for u in self.learning_units 
                                if area in u.concepts and u.unit_id not in 
                                [t for topics in profile.completed_topics.values() for t in topics]]
                for unit in related_units[:2]:
                    recommendations.append({
                        "type": "weak_area_focus",
                        "unit_id": unit.unit_id,
                        "title": unit.title,
                        "reason": f"Strengthen understanding of {area}",
                        "priority": "high"
                    })
            
            # 2. Next logical units
            next_unit, _ = self.learning_engine.get_next_learning_unit(user_id)
            if next_unit:
                recommendations.append({
                    "type": "continuation",
                    "unit_id": next_unit.unit_id,
                    "title": next_unit.title,
                    "reason": "Continue your learning path",
                    "priority": "medium"
                })
            
            # 3. Complementary skills
            last_completed = []
            for topics in profile.completed_topics.values():
                last_completed.extend(topics[-2:])  # Get last 2 completed units per category
            
            for unit_id in last_completed[:3]:
                unit = self.knowledge_graph.nodes.get(unit_id)
                if unit:
                    # Find related units
                    for concept in unit.concepts[:2]:
                        related = self.knowledge_graph.concept_map.get(concept, [])
                        for rel_id in related:
                            if rel_id != unit_id and rel_id not in [
                                r['unit_id'] for r in recommendations
                            ]:
                                rel_unit = self.knowledge_graph.nodes.get(rel_id)
                                if rel_unit:
                                    recommendations.append({
                                        "type": "complementary",
                                        "unit_id": rel_unit.unit_id,
                                        "title": rel_unit.title,
                                        "reason": f"Related to {concept} from {unit.title}",
                                        "priority": "low"
                                    })
            
            return {
                "success": True,
                "recommendations": recommendations[:5]  # Limit to 5
            }
        
        @self.app.post("/feedback/{user_id}")
        async def submit_feedback(user_id: str, feedback: Dict):
            """Submit user feedback for adaptive learning"""
            profile = self.learning_engine.user_profiles.get(user_id)
            if not profile:
                raise HTTPException(status_code=404, detail="User not found")
            
            # Store feedback in session history
            profile.session_history.append({
                "timestamp": datetime.now().isoformat(),
                "type": "feedback",
                "data": feedback
            })
            
            # Adjust learning parameters based on feedback
            if feedback.get("difficulty") == "too_hard":
                profile.learning_pace = max(0.5, profile.learning_pace * 0.9)
            elif feedback.get("difficulty") == "too_easy":
                profile.learning_pace = min(2.0, profile.learning_pace * 1.1)
            
            if feedback.get("learning_style_preference"):
                try:
                    profile.learning_style = LearningStyle(feedback["learning_style_preference"])
                except ValueError:
                    pass
            
            return {
                "success": True,
                "message": "Feedback recorded",
                "updated_profile": asdict(profile)
            }
        
        @self.app.get("/challenge/{challenge_type}")
        async def get_daily_challenge(challenge_type: ChallengeType = ChallengeType.CODE_COMPLETION):
            """Get a daily coding challenge"""
            # Find appropriate challenge based on type
            challenges = []
            for unit in self.learning_units:
                for exercise in unit.exercises:
                    if exercise.get('type') == challenge_type.value:
                        challenges.append({
                            "unit_id": unit.unit_id,
                            "exercise": exercise,
                            "unit_title": unit.title
                        })
            
            if not challenges:
                raise HTTPException(status_code=404, detail="No challenges found")
            
            # Select random challenge
            import random
            challenge = random.choice(challenges)
            
            return {
                "success": True,
                "challenge": challenge["exercise"],
                "unit_info": {
                    "id": challenge["unit_id"],
                    "title": challenge["unit_title"]
                },
                "type": challenge_type.value
            }
        
        @self.app.get("/export-progress/{user_id}")
        async def export_learning_progress(user_id: str):
            """Export user's learning progress as JSON"""
            profile = self.learning_engine.user_profiles.get(user_id)
            if not profile:
                raise HTTPException(status_code=404, detail="User not found")
            
            progress_data = {
                "user_id": user_id,
                "export_date": datetime.now().isoformat(),
                "profile": asdict(profile),
                "completed_units": profile.completed_topics,
                "proficiency": profile.topic_proficiency,
                "learning_statistics": {
                    "total_learning_time": sum(
                        s.get('duration', 0) for s in profile.session_history
                        if 'duration' in s
                    ),
                    "total_sessions": len(profile.session_history),
                    "average_score": np.mean(list(profile.topic_proficiency.values())) 
                    if profile.topic_proficiency else 0
                }
            }
            
            return {
                "success": True,
                "data": progress_data,
                "message": "Progress data exported successfully"
            }
        
        # Web interface endpoint
        @self.app.get("/dashboard/{user_id}", response_class=HTMLResponse)
        async def learning_dashboard(user_id: str):
            """Learning dashboard web interface"""
            profile = self.learning_engine.user_profiles.get(user_id)
            
            context = {
                "user_id": user_id,
                "profile": profile,
                "skill_level": profile.skill_level.value if profile else "beginner",
                "total_units": len(self.learning_units)
            }
            
            # This would render an HTML template
            return """
            <!DOCTYPE html>
            <html>
            <head>
                <title>Learning Dashboard - User {user_id}</title>
                <style>
                    body {{ font-family: Arial, sans-serif; margin: 20px; }}
                    .card {{ border: 1px solid #ddd; padding: 20px; margin: 10px 0; border-radius: 5px; }}
                    .progress-bar {{ background: #eee; height: 20px; border-radius: 10px; }}
                    .progress {{ background: #4CAF50; height: 100%; border-radius: 10px; }}
                </style>
            </head>
            <body>
                <h1>Learning Dashboard</h1>
                <div class="card">
                    <h2>User: {user_id}</h2>
                    <p>Skill Level: {skill_level}</p>
                    <p>Progress: 0/{total_units} units completed</p>
                    <div class="progress-bar">
                        <div class="progress" style="width: 0%"></div>
                    </div>
                </div>
                <div class="card">
                    <h3>Get Started</h3>
                    <p>Use the API endpoints to:</p>
                    <ul>
                        <li>GET /next-unit/{user_id} - Get next learning unit</li>
                        <li>POST /submit-exercise - Submit exercises</li>
                        <li>GET /progress/{user_id} - View progress</li>
                    </ul>
                </div>
            </body>
            </html>
            """.format(**context)

# ============ CLIENT CLASSES ============
class LearningClient:
    """Client for interacting with the learning engine"""
    
    def __init__(self, base_url="http://localhost:8000"):
        self.base_url = base_url
        self.session = None
        
    async def register(self, user_id: str, initial_level: SkillLevel = None):
        """Register a new user"""
        import aiohttp
        
        async with aiohttp.ClientSession() as session:
            data = {"user_id": user_id}
            if initial_level:
                data["initial_level"] = initial_level.value
            
            async with session.post(f"{self.base_url}/register", json=data) as resp:
                return await resp.json()
    
    async def get_next_unit(self, user_id: str):
        """Get next learning unit"""
        import aiohttp
        
        async with aiohttp.ClientSession() as session:
            async with session.get(f"{self.base_url}/next-unit/{user_id}") as resp:
                return await resp.json()
    
    async def submit_exercise(self, user_id: str, unit_id: str, exercise_id: str, code: str):
        """Submit exercise solution"""
        import aiohttp
        
        async with aiohttp.ClientSession() as session:
            data = {
                "user_id": user_id,
                "unit_id": unit_id,
                "exercise_id": exercise_id,
                "code": code
            }
            
            async with session.post(f"{self.base_url}/submit-exercise", json=data) as resp:
                return await resp.json()
    
    async def execute_code(self, code: str):
        """Execute code in safe environment"""
        import aiohttp
        
        async with aiohttp.ClientSession() as session:
            async with session.get(f"{self.base_url}/execute-code", params={"code": code}) as resp:
                return await resp.json()

# ============ DEPLOYMENT CONFIGURATION ============
def create_app() -> FastAPI:
    """Factory function to create the FastAPI application"""
    engine_api = PedagogicCodingEngineAPI()
    return engine_api.app

def run_server(host: str = "0.0.0.0", port: int = 8000, reload: bool = False):
    """Run the FastAPI server"""
    if not EXTERNAL_DEPS_AVAILABLE:
        print("Please install required dependencies first:")
        print("pip install fastapi uvicorn sqlalchemy numpy pandas matplotlib seaborn scipy plotly aiohttp")
        return
    
    app = create_app()
    
    print(f"""
    ============================================
    PEDAGOGIC PYTHON CODING ENGINE
    ============================================
    Server starting at: http://{host}:{port}
    
    API Documentation: http://{host}:{port}/docs
    
    Available Endpoints:
    - GET  /                    - API root
    - POST /register            - Register new user
    - GET  /next-unit/{'{user_id}'}   - Get next learning unit
    - POST /submit-exercise     - Submit exercise
    - GET  /progress/{'{user_id}'}    - View progress
    - GET  /execute-code        - Safe code execution
    
    Example Usage:
    1. Register: POST /register {{"user_id": "student1"}}
    2. Get unit: GET /next-unit/student1
    3. Submit: POST /submit-exercise {{...}}
    ============================================
    """)
    
    uvicorn.run(app, host=host, port=port, reload=reload)

# ============ QUICK START UTILITIES ============
def create_sample_data():
    """Create sample data for testing"""
    kb_builder = KnowledgeBaseBuilder()
    units = kb_builder.build_from_chat_content()
    
    print(f"Created {len(units)} learning units:")
    for unit in units:
        print(f"  - {unit.title} ({unit.skill_level.value})")
    
    return units

def quick_test():
    """Quick test of the learning engine"""
    print("Testing Pedagogic Coding Engine...")
    
    # Create knowledge base
    kb_builder = KnowledgeBaseBuilder()
    units = kb_builder.build_from_chat_content()
    
    # Create knowledge graph
    kg = KnowledgeGraph()
    for unit in units:
        kg.add_unit(unit)
    
    # Create learning engine
    engine = AdaptiveLearningEngine(kg)
    
    # Register a test user
    user = engine.register_user("test_user", SkillLevel.BEGINNER)
    print(f"Registered user: {user.user_id} at level: {user.skill_level}")
    
    # Get next unit
    unit, content = engine.get_next_learning_unit("test_user")
    if unit:
        print(f"Next unit: {unit.title}")
        print(f"Category: {unit.category.value}")
        print(f"Estimated time: {unit.estimated_time} minutes")
    else:
        print("No units available")
    
    return engine

# ============ MAIN EXECUTION ============
if __name__ == "__main__":
    import sys
    
    if len(sys.argv) > 1:
        command = sys.argv[1]
        
        if command == "run":
            run_server()
        elif command == "test":
            quick_test()
        elif command == "create-data":
            create_sample_data()
        elif command == "help":
            print("""
            Pedagogic Python Coding Engine
            ==============================
            
            Commands:
            - run          : Start the FastAPI server
            - test         : Run quick test of the engine
            - create-data  : Create sample learning data
            - help         : Show this help
            
            Example:
            python pedagogic_engine.py run
            """)
        else:
            print(f"Unknown command: {command}")
            print("Use 'help' for available commands")
    else:
        # Default: run quick test
        quick_test()

