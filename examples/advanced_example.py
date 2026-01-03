"""
Advanced Example - Wrapping an existing complex API
"""

from pedagogical.api import PedagogicalAPI
from typing import List, Dict, Any
import json


class DataProcessor:
    """
    A more complex API for data processing
    Demonstrates wrapping a real-world API
    """
    
    def __init__(self):
        self.data_store: List[Dict[str, Any]] = []
    
    def load_data(self, data: List[Dict[str, Any]]) -> int:
        """Load data into the processor"""
        self.data_store = data.copy()
        return len(self.data_store)
    
    def filter_by_key(self, key: str, value: Any) -> List[Dict[str, Any]]:
        """Filter data by key-value pair"""
        return [item for item in self.data_store if item.get(key) == value]
    
    def map_field(self, source_key: str, target_key: str, transform=None) -> List[Dict[str, Any]]:
        """Map one field to another with optional transformation"""
        result = []
        for item in self.data_store:
            new_item = item.copy()
            value = item.get(source_key)
            if transform:
                value = transform(value)
            new_item[target_key] = value
            result.append(new_item)
        return result
    
    def aggregate(self, key: str, operation: str = 'count') -> Any:
        """Aggregate data by a key"""
        values = [item.get(key) for item in self.data_store if key in item]
        
        if operation == 'count':
            return len(values)
        elif operation == 'sum':
            return sum(values)
        elif operation == 'avg':
            return sum(values) / len(values) if values else 0
        elif operation == 'min':
            return min(values) if values else None
        elif operation == 'max':
            return max(values) if values else None
        else:
            raise ValueError(f"Unknown operation: {operation}")
    
    def group_by(self, key: str) -> Dict[Any, List[Dict[str, Any]]]:
        """Group data by a key"""
        groups = {}
        for item in self.data_store:
            group_key = item.get(key)
            if group_key not in groups:
                groups[group_key] = []
            groups[group_key].append(item)
        return groups


def main():
    """Demonstrate advanced usage with verbosity control"""
    
    print("=" * 70)
    print("Pedagogical API - Advanced Example")
    print("=" * 70)
    print()
    
    # Create sample data
    sample_data = [
        {'id': 1, 'name': 'Alice', 'age': 30, 'department': 'Engineering'},
        {'id': 2, 'name': 'Bob', 'age': 25, 'department': 'Marketing'},
        {'id': 3, 'name': 'Charlie', 'age': 35, 'department': 'Engineering'},
        {'id': 4, 'name': 'Diana', 'age': 28, 'department': 'Sales'},
        {'id': 5, 'name': 'Eve', 'age': 32, 'department': 'Engineering'},
    ]
    
    # Create and wrap the processor
    processor = DataProcessor()
    pedagogical_processor = PedagogicalAPI(processor)
    
    # Start with detailed verbosity for beginners
    print("🎓 Starting with DETAILED verbosity (for beginners)...\n")
    pedagogical_processor.set_verbosity('detailed')
    
    # Example 1: Load data
    print("Example 1: Loading Data")
    print("-" * 70)
    count = pedagogical_processor.call('load_data', sample_data)
    print(f"✓ Loaded {count} records\n")
    
    # Example 2: Filter data
    print("\nExample 2: Filtering Data")
    print("-" * 70)
    engineers = pedagogical_processor.call('filter_by_key', 'department', 'Engineering')
    print(f"✓ Found {len(engineers)} engineers\n")
    
    # Switch to normal verbosity
    print("\n" + "=" * 70)
    print("🎓 Switching to NORMAL verbosity (for intermediate users)...\n")
    pedagogical_processor.set_verbosity('normal')
    
    # Example 3: Aggregate data
    print("Example 3: Aggregating Data")
    print("-" * 70)
    avg_age = pedagogical_processor.call('aggregate', 'age', 'avg')
    print(f"✓ Average age: {avg_age:.1f} years\n")
    
    # Example 4: Group data
    print("\nExample 4: Grouping Data")
    print("-" * 70)
    groups = pedagogical_processor.call('group_by', 'department')
    print(f"✓ Found {len(groups)} departments")
    for dept, members in groups.items():
        print(f"  - {dept}: {len(members)} members")
    print()
    
    # Switch to minimal verbosity
    print("\n" + "=" * 70)
    print("🎓 Switching to MINIMAL verbosity (for advanced users)...\n")
    pedagogical_processor.set_verbosity('minimal')
    
    # Example 5: Transform data
    print("Example 5: Transforming Data")
    print("-" * 70)
    transformed = pedagogical_processor.call(
        'map_field',
        'age',
        'age_category',
        lambda age: 'senior' if age > 30 else 'junior'
    )
    print(f"✓ Transformed {len(transformed)} records\n")
    
    # Show comprehensive progress
    print("\n" + "=" * 70)
    print("📊 Learning Progress Report")
    print("=" * 70)
    progress = pedagogical_processor.get_learning_progress()
    print(f"Total API calls: {progress.get('total_calls', 0)}")
    print(f"Methods used: {', '.join(progress.get('method_diversity', []))}")
    print(f"Current skill level: {pedagogical_processor._infer_skill_level()}")
    print()
    
    # Show skill trajectory
    print("📈 Skill Level Trajectory:")
    print("-" * 70)
    trajectory = pedagogical_processor.get_skill_trajectory()
    for snapshot in trajectory:
        print(f"  Call #{snapshot['call_number']}: {snapshot['skill_level']}")
    print()
    
    # Suggest next steps
    print("🎯 Suggested Next Concepts to Learn:")
    print("-" * 70)
    suggestions = pedagogical_processor.suggest_next_concepts()
    for i, concept in enumerate(suggestions[:5], 1):
        print(f"  {i}. {concept}")
    print()


if __name__ == '__main__':
    main()
