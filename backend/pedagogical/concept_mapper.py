"""
Concept Dependency Mapper for understanding relationships between concepts
"""

from typing import Dict, List, Set, Optional, Tuple
from collections import defaultdict


class ConceptDependencyMapper:
    """
    Maps and analyzes dependencies between programming concepts
    """
    
    def __init__(self):
        self.concept_graph = self._build_concept_graph()
        self.concept_metadata = self._initialize_metadata()
    
    def _build_concept_graph(self) -> Dict[str, Set[str]]:
        """
        Build a directed graph of concept dependencies
        
        Returns:
            Graph where keys are concepts and values are prerequisite concepts
        """
        graph = defaultdict(set)
        
        # Example concept relationships
        graph['functions'].add('variables')
        graph['classes'].add('functions')
        graph['inheritance'].add('classes')
        graph['polymorphism'].add('inheritance')
        graph['decorators'].add('functions')
        graph['context_managers'].add('classes')
        graph['generators'].add('functions')
        graph['async_programming'].add('generators')
        graph['list_comprehensions'].add('loops')
        graph['dictionary_comprehensions'].add('list_comprehensions')
        
        return dict(graph)
    
    def _initialize_metadata(self) -> Dict[str, Dict]:
        """
        Initialize metadata for each concept
        
        Returns:
            Dictionary of concept metadata
        """
        return {
            'variables': {
                'difficulty': 'beginner',
                'category': 'fundamentals',
                'description': 'Basic data storage and naming'
            },
            'functions': {
                'difficulty': 'beginner',
                'category': 'fundamentals',
                'description': 'Reusable blocks of code'
            },
            'classes': {
                'difficulty': 'intermediate',
                'category': 'oop',
                'description': 'Object-oriented programming basics'
            },
            'inheritance': {
                'difficulty': 'intermediate',
                'category': 'oop',
                'description': 'Code reuse through class hierarchies'
            },
            'decorators': {
                'difficulty': 'advanced',
                'category': 'metaprogramming',
                'description': 'Function and class modification'
            },
            'async_programming': {
                'difficulty': 'advanced',
                'category': 'concurrency',
                'description': 'Asynchronous and concurrent execution'
            }
        }
    
    def get_prerequisites(self, concept: str) -> List[str]:
        """
        Get all prerequisites for a concept
        
        Args:
            concept: The concept to analyze
            
        Returns:
            List of prerequisite concepts in learning order
        """
        prerequisites = set()
        self._collect_prerequisites(concept, prerequisites)
        return self._topological_sort(prerequisites)
    
    def _collect_prerequisites(self, concept: str, collected: Set[str]):
        """
        Recursively collect all prerequisites
        
        Args:
            concept: Current concept
            collected: Set of collected prerequisites
        """
        if concept not in self.concept_graph:
            return
        
        for prereq in self.concept_graph[concept]:
            if prereq not in collected:
                collected.add(prereq)
                self._collect_prerequisites(prereq, collected)
    
    def _topological_sort(self, concepts: Set[str]) -> List[str]:
        """
        Sort concepts in learning order using topological sort
        
        Args:
            concepts: Set of concepts to sort
            
        Returns:
            Ordered list of concepts
        """
        # Simplified implementation - in reality would do proper topological sort
        difficulty_order = {'beginner': 0, 'intermediate': 1, 'advanced': 2, 'expert': 3}
        
        return sorted(
            concepts,
            key=lambda c: difficulty_order.get(
                self.concept_metadata.get(c, {}).get('difficulty', 'intermediate'),
                1
            )
        )
    
    def get_learning_path(self, target_concept: str) -> List[Dict[str, any]]:
        """
        Generate a complete learning path to a target concept
        
        Args:
            target_concept: The concept to learn
            
        Returns:
            Ordered list of concepts with metadata
        """
        prerequisites = self.get_prerequisites(target_concept)
        path = []
        
        for i, concept in enumerate(prerequisites, 1):
            metadata = self.concept_metadata.get(concept, {})
            path.append({
                'step': i,
                'concept': concept,
                'description': metadata.get('description', ''),
                'difficulty': metadata.get('difficulty', 'intermediate'),
                'metadata': metadata,
                'next_concepts': list(self._get_dependent_concepts(concept))
            })
        
        # Add target concept
        metadata = self.concept_metadata.get(target_concept, {})
        path.append({
            'step': len(path) + 1,
            'concept': target_concept,
            'description': metadata.get('description', ''),
            'difficulty': metadata.get('difficulty', 'intermediate'),
            'metadata': metadata,
            'next_concepts': list(self._get_dependent_concepts(target_concept))
        })
        
        return path
    
    def _get_dependent_concepts(self, concept: str) -> Set[str]:
        """
        Get concepts that depend on this concept
        
        Args:
            concept: The prerequisite concept
            
        Returns:
            Set of dependent concepts
        """
        dependents = set()
        for c, prereqs in self.concept_graph.items():
            if concept in prereqs:
                dependents.add(c)
        return dependents
    
    def find_related_concepts(self, concept: str, max_distance: int = 2) -> List[str]:
        """
        Find concepts related to the given concept
        
        Args:
            concept: The concept to find relations for
            max_distance: Maximum graph distance to search
            
        Returns:
            List of related concepts
        """
        related = set()
        
        # Add prerequisites
        related.update(self.concept_graph.get(concept, set()))
        
        # Add dependents
        related.update(self._get_dependent_concepts(concept))
        
        # Add siblings (concepts with same prerequisites)
        if concept in self.concept_graph:
            for c, prereqs in self.concept_graph.items():
                if prereqs == self.concept_graph[concept] and c != concept:
                    related.add(c)
        
        return list(related)
    
    def suggest_next_concepts(self, mastered_concepts: List[str]) -> List[str]:
        """
        Suggest next concepts to learn based on what's been mastered
        
        Args:
            mastered_concepts: List of concepts already mastered
            
        Returns:
            Suggested next concepts
        """
        mastered_set = set(mastered_concepts)
        suggestions = []
        
        for concept, prereqs in self.concept_graph.items():
            if concept not in mastered_set:
                # Check if all prerequisites are mastered
                if prereqs.issubset(mastered_set):
                    suggestions.append(concept)
        
        return suggestions
    
    def get_concept_difficulty(self, concept: str) -> str:
        """
        Get the difficulty level of a concept
        
        Args:
            concept: The concept to check
            
        Returns:
            Difficulty level string
        """
        return self.concept_metadata.get(concept, {}).get('difficulty', 'intermediate')
    
    def visualize_path(self, target_concept: str) -> str:
        """
        Create a text visualization of a learning path
        
        Args:
            target_concept: Target concept to visualize path to
            
        Returns:
            ASCII visualization of the path
        """
        path = self.get_learning_path(target_concept)
        
        visualization = "Learning Path:\n"
        visualization += "=" * 50 + "\n\n"
        
        for i, step in enumerate(path, 1):
            concept = step['concept']
            difficulty = step.get('difficulty', 'unknown')
            description = step.get('description', 'No description')
            
            visualization += f"{i}. {concept.replace('_', ' ').title()}\n"
            visualization += f"   Difficulty: {difficulty}\n"
            visualization += f"   {description}\n"
            
            if i < len(path):
                visualization += "   ↓\n"
        
        return visualization
