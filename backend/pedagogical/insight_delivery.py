"""
Insight Delivery system for presenting teaching moments to users
"""

from typing import Dict, Any
import textwrap


class InsightDelivery:
    """
    Delivers educational insights in an appropriate format and verbosity
    """
    
    def __init__(self, verbosity: str = 'normal'):
        """
        Initialize insight delivery
        
        Args:
            verbosity: 'minimal', 'normal', or 'detailed'
        """
        self.verbosity = verbosity
        self.delivery_methods = {
            'minimal': self._minimal_delivery,
            'normal': self._normal_delivery,
            'detailed': self._detailed_delivery
        }
    
    def deliver(self, teaching_moment: Dict[str, Any], result: Any):
        """
        Deliver a teaching moment to the user
        
        Args:
            teaching_moment: Dictionary containing teaching content
            result: The result of the method call
        """
        delivery_method = self.delivery_methods.get(
            self.verbosity,
            self._normal_delivery
        )
        
        delivery_method(teaching_moment, result)
    
    def _minimal_delivery(self, teaching_moment: Dict[str, Any], result: Any):
        """Minimal delivery - just key insights"""
        level = teaching_moment.get('level', 'intermediate')
        focus = teaching_moment.get('focus', 'general')
        
        print(f"\n💡 [{level.upper()}] {focus.replace('_', ' ').title()}")
        
        # Show only the most important insight
        if 'explanation' in teaching_moment:
            brief = teaching_moment['explanation'][:100] + "..."
            print(f"   {brief}")
    
    def _normal_delivery(self, teaching_moment: Dict[str, Any], result: Any):
        """Normal delivery - balanced insights"""
        self._print_header(teaching_moment)
        
        # Main explanation
        if 'explanation' in teaching_moment:
            self._print_section("Explanation", teaching_moment['explanation'])
        
        # Key concepts based on level
        level = teaching_moment.get('level', 'intermediate')
        
        if level == 'beginner':
            if 'why_it_exists' in teaching_moment:
                self._print_section("Why This Matters", teaching_moment['why_it_exists'])
            if 'simple_analogy' in teaching_moment:
                self._print_section("Think of It Like", teaching_moment['simple_analogy'])
        
        elif level == 'intermediate':
            if 'common_patterns' in teaching_moment:
                self._print_list("Common Patterns", teaching_moment['common_patterns'])
            if 'when_to_use' in teaching_moment:
                self._print_section("When to Use", teaching_moment['when_to_use'])
        
        elif level == 'advanced':
            if 'performance_tips' in teaching_moment:
                self._print_list("Performance Tips", teaching_moment['performance_tips'])
            if 'theory' in teaching_moment:
                self._print_section("Theory", teaching_moment['theory'])
        
        # Common elements
        if 'pitfalls' in teaching_moment and teaching_moment['pitfalls']:
            self._print_list("⚠️  Common Pitfalls", teaching_moment['pitfalls'])
        
        print()  # Empty line at end
    
    def _detailed_delivery(self, teaching_moment: Dict[str, Any], result: Any):
        """Detailed delivery - comprehensive insights"""
        self._print_header(teaching_moment, detailed=True)
        
        # Include everything
        sections = [
            ('explanation', 'Explanation'),
            ('why_it_exists', 'Why This Exists'),
            ('simple_analogy', 'Analogy'),
            ('when_to_use', 'When to Use'),
            ('theory', 'Underlying Theory')
        ]
        
        for key, title in sections:
            if key in teaching_moment:
                self._print_section(title, teaching_moment[key])
        
        # Lists
        list_sections = [
            ('prerequisites', '📚 Prerequisites'),
            ('common_patterns', '🔄 Common Patterns'),
            ('alternatives', '↔️  Alternatives'),
            ('performance_tips', '⚡ Performance Tips'),
            ('advanced_patterns', '🎯 Advanced Patterns'),
            ('pitfalls', '⚠️  Common Pitfalls'),
            ('best_practices', '✅ Best Practices'),
            ('edge_cases', '🔍 Edge Cases'),
            ('related_concepts', '🔗 Related Concepts')
        ]
        
        for key, title in list_sections:
            if key in teaching_moment and teaching_moment[key]:
                self._print_list(title, teaching_moment[key])
        
        # Special sections
        if 'implementation_details' in teaching_moment:
            self._print_section("🔧 Implementation Details", teaching_moment['implementation_details'])
        
        if 'research_references' in teaching_moment:
            self._print_list("📖 Research References", teaching_moment['research_references'])
        
        print()  # Empty line at end
    
    def _print_header(self, teaching_moment: Dict[str, Any], detailed: bool = False):
        """Print the header for a teaching moment"""
        level = teaching_moment.get('level', 'intermediate')
        focus = teaching_moment.get('focus', 'general')
        
        icons = {
            'beginner': '🌱',
            'intermediate': '🌿',
            'advanced': '🌳',
            'expert': '🏆'
        }
        
        icon = icons.get(level, '💡')
        
        print(f"\n{'=' * 60}")
        print(f"{icon} LEARNING MOMENT [{level.upper()}]")
        if detailed:
            print(f"Focus: {focus.replace('_', ' ').title()}")
        print('=' * 60)
    
    def _print_section(self, title: str, content: str):
        """Print a section with title and content"""
        print(f"\n{title}:")
        print(self._wrap_text(content))
    
    def _print_list(self, title: str, items: list):
        """Print a list of items"""
        if not items:
            return
        
        print(f"\n{title}:")
        for item in items:
            print(f"  • {item}")
    
    def _wrap_text(self, text: str, width: int = 58) -> str:
        """Wrap text to specified width"""
        wrapped = textwrap.fill(text, width=width, initial_indent='  ', subsequent_indent='  ')
        return wrapped
    
    def set_verbosity(self, level: str):
        """
        Set the verbosity level
        
        Args:
            level: 'minimal', 'normal', or 'detailed'
        """
        if level in self.delivery_methods:
            self.verbosity = level
        else:
            raise ValueError(f"Invalid verbosity level: {level}. Use 'minimal', 'normal', or 'detailed'")
    
    def deliver_progress_report(self, progress: Dict[str, Any]):
        """
        Deliver a learning progress report
        
        Args:
            progress: Progress dictionary from learning engine
        """
        print("\n" + "=" * 60)
        print("📊 YOUR LEARNING PROGRESS")
        print("=" * 60)
        
        print(f"\nTotal Methods Used: {progress.get('total_methods_used', 0)}")
        print(f"Total API Calls: {progress.get('total_calls', 0)}")
        
        if 'skill_trajectory' in progress:
            trajectory = progress['skill_trajectory']
            print(f"\nSkill Progression: {' → '.join(trajectory)}")
        
        if 'mastered_concepts' in progress:
            concepts = progress['mastered_concepts']
            if concepts:
                print("\n✅ Mastered Concepts:")
                for concept in concepts:
                    print(f"  • {concept.replace('_', ' ').title()}")
        
        print("\n" + "=" * 60 + "\n")
    
    def deliver_suggestion(self, suggestions: list):
        """
        Deliver improvement suggestions
        
        Args:
            suggestions: List of suggestions
        """
        if not suggestions:
            return
        
        print("\n💡 SUGGESTIONS FOR IMPROVEMENT")
        print("-" * 60)
        for suggestion in suggestions:
            print(f"  • {suggestion}")
        print()
