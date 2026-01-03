"""
Concepts Example - Exploring concept dependencies and learning paths
"""

from pedagogical.concept_mapper import ConceptDependencyMapper


def main():
    """Demonstrate concept mapping and learning paths"""
    
    print("=" * 70)
    print("Concept Dependency Mapper - Visualization")
    print("=" * 70)
    print()
    
    # Create the concept mapper
    mapper = ConceptDependencyMapper()
    
    # Example 1: Show prerequisites for a concept
    print("Example 1: Understanding Prerequisites")
    print("-" * 70)
    concept = 'list_comprehensions'
    prereqs = mapper.get_prerequisites(concept)
    print(f"To learn '{concept}', you should first understand:\n")
    for i, prereq in enumerate(prereqs, 1):
        print(f"  {i}. {prereq}")
    print()
    
    # Example 2: Get learning path
    print("\nExample 2: Learning Path to Advanced Concepts")
    print("-" * 70)
    target = 'decorators'
    path = mapper.get_learning_path(target)
    print(f"Learning path to '{target}':\n")
    for step in path:
        print(f"  {step['step']}. {step['concept']}")
        if step['description']:
            print(f"     → {step['description']}")
    print()
    
    # Example 3: Suggest next concepts
    print("\nExample 3: Suggested Learning Path")
    print("-" * 70)
    mastered = ['variables', 'data_types', 'conditionals', 'loops']
    print(f"Based on mastering: {', '.join(mastered)}\n")
    suggestions = mapper.suggest_next_concepts(mastered)
    print("You can now learn:")
    for i, concept in enumerate(suggestions[:8], 1):
        print(f"  {i}. {concept}")
    print()
    
    # Example 4: Visualize learning path
    print("\nExample 4: Visual Learning Path")
    print("-" * 70)
    target = 'classes'
    visualization = mapper.visualize_path(target)
    print(f"Visual path to '{target}':\n")
    print(visualization)
    print()
    
    # Example 5: Multiple learning paths
    print("\nExample 5: Comparing Different Learning Paths")
    print("-" * 70)
    concepts_to_compare = ['lambda_functions', 'generators', 'context_managers']
    
    for concept in concepts_to_compare:
        path = mapper.get_learning_path(concept)
        print(f"\n{concept}:")
        print(f"  Steps required: {len(path)}")
        print(f"  Prerequisites: {', '.join(mapper.get_prerequisites(concept))}")
    print()
    
    # Example 6: Build custom learning curriculum
    print("\nExample 6: Building a Custom Curriculum")
    print("-" * 70)
    
    # Simulate a learner's progress
    current_knowledge = []
    total_concepts = ['classes', 'list_comprehensions', 'error_handling', 
                     'file_io', 'modules']
    
    print("Building a learning curriculum...\n")
    
    for target_concept in total_concepts:
        # Get what's needed
        path = mapper.get_learning_path(target_concept)
        
        # Filter out what's already known
        new_steps = [
            step for step in path 
            if step['concept'] not in current_knowledge
        ]
        
        if new_steps:
            print(f"To learn '{target_concept}':")
            for step in new_steps:
                print(f"  → {step['concept']}")
                current_knowledge.append(step['concept'])
            print()
    
    print(f"Final knowledge base: {len(set(current_knowledge))} concepts mastered")
    print()
    
    # Example 7: Finding concept relationships
    print("\nExample 7: Understanding Concept Relationships")
    print("-" * 70)
    
    # Check if one concept depends on another
    concept_pairs = [
        ('decorators', 'functions'),
        ('list_comprehensions', 'loops'),
        ('generators', 'functions'),
        ('classes', 'variables')
    ]
    
    for advanced, basic in concept_pairs:
        prereqs = mapper.get_prerequisites(advanced)
        depends = basic in prereqs
        print(f"  '{advanced}' depends on '{basic}': {depends}")
    print()


if __name__ == '__main__':
    main()
