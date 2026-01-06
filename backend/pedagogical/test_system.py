#!/usr/bin/env python3
"""
Quick test script to verify pedagogical system is working
"""

import sys
from pedagogical.api import PedagogicalAPI
from pedagogical.concept_mapper import ConceptDependencyMapper

def test_basic_api():
    """Test basic API wrapping"""
    print("✓ Testing Basic API Wrapping...")
    
    class SimpleCalc:
        def add(self, a, b):
            return a + b
    
    calc = SimpleCalc()
    ped_calc = PedagogicalAPI(calc, default_verbosity='minimal')
    result = ped_calc.call('add', 10, 5)
    assert result == 15, f"Expected 15, got {result}"
    print(f"  Result: {result} ✓")

def test_verbosity_levels():
    """Test different verbosity levels"""
    print("\n✓ Testing Verbosity Levels...")
    
    class TestAPI:
        def test_method(self):
            return "test"
    
    api = TestAPI()
    ped_api = PedagogicalAPI(api)
    
    for level in ['minimal', 'normal', 'detailed']:
        ped_api.set_verbosity(level)
        print(f"  {level.capitalize()} verbosity set ✓")

def test_concept_mapping():
    """Test concept dependency mapping"""
    print("\n✓ Testing Concept Mapping...")
    
    mapper = ConceptDependencyMapper()
    
    # Test prerequisites
    prereqs = mapper.get_prerequisites('decorators')
    assert 'functions' in prereqs, "Decorators should require functions"
    print(f"  Prerequisites for decorators: {prereqs} ✓")
    
    # Test learning path
    path = mapper.get_learning_path('classes')
    assert len(path) > 0, "Should have learning path"
    print(f"  Learning path to classes has {len(path)} steps ✓")
    
    # Test suggestions
    suggestions = mapper.suggest_next_concepts(['variables', 'loops'])
    assert len(suggestions) > 0, "Should have suggestions"
    print(f"  Next concept suggestions: {suggestions[:3]} ✓")

def test_progress_tracking():
    """Test progress tracking"""
    print("\n✓ Testing Progress Tracking...")
    
    class Counter:
        def __init__(self):
            self.count = 0
        
        def increment(self):
            self.count += 1
            return self.count
    
    counter = Counter()
    ped_counter = PedagogicalAPI(counter, default_verbosity='minimal')
    
    # Make some calls
    for _ in range(3):
        ped_counter.call('increment')
    
    progress = ped_counter.get_learning_progress()
    assert progress['total_calls'] == 3, f"Expected 3 calls, got {progress['total_calls']}"
    print(f"  Total calls tracked: {progress['total_calls']} ✓")
    
    skill = ped_counter._infer_skill_level()
    print(f"  Inferred skill level: {skill} ✓")

def test_skill_inference():
    """Test skill level inference"""
    print("\n✓ Testing Skill Inference...")
    
    class DataAPI:
        def simple(self): return "simple"
        def complex(self): return "complex"
    
    api = DataAPI()
    ped_api = PedagogicalAPI(api, default_verbosity='minimal')
    
    # Simulate beginner usage
    ped_api.call('simple')
    initial_skill = ped_api._infer_skill_level()
    print(f"  Initial skill level: {initial_skill} ✓")
    
    # Simulate more usage
    for _ in range(5):
        ped_api.call('complex')
    
    new_skill = ped_api._infer_skill_level()
    print(f"  Skill after practice: {new_skill} ✓")

def main():
    """Run all tests"""
    print("=" * 60)
    print("🧪 Pedagogical API System - Verification Tests")
    print("=" * 60)
    print()
    
    try:
        test_basic_api()
        test_verbosity_levels()
        test_concept_mapping()
        test_progress_tracking()
        test_skill_inference()
        
        print("\n" + "=" * 60)
        print("✅ All Tests Passed!")
        print("=" * 60)
        print()
        print("🎓 Pedagogical system is working correctly with Python", sys.version.split()[0])
        print()
        
        return 0
    
    except Exception as e:
        print("\n" + "=" * 60)
        print("❌ Test Failed!")
        print("=" * 60)
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()
        return 1

if __name__ == '__main__':
    sys.exit(main())
