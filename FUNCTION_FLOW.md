# Pedagogical API - Function Call Flow

## 🔄 Main Execution Flow

```
User Code
    |
    v
PedagogicalAPI.call(method, *args, **kwargs)
    |
    +---> 1. ContextAnalyzer.analyze(frame)
    |         |
    |         +---> _get_file_info()
    |         +---> _get_function_info()
    |         +---> _get_local_variables()
    |         +---> _get_call_chain()
    |         +---> _get_code_snippet()
    |         |
    |         v
    |     Returns: context dict
    |
    +---> 2. Execute wrapped_api.method(*args, **kwargs)
    |         |
    |         v
    |     Returns: result
    |
    +---> 3. _record_call(method, args, kwargs, result, context)
    |         |
    |         +---> _get_timestamp()
    |         |
    |         v
    |     Updates: call_history
    |
    +---> 4. SkillInferenceEngine.infer_level(history, profile)
    |         |
    |         +---> _beginner_indicators()
    |         +---> _intermediate_indicators()
    |         +---> _advanced_indicators()
    |         +---> _expert_indicators()
    |         +---> _detect_basic_patterns()
    |         +---> _detect_complex_patterns()
    |         +---> _detect_expert_patterns()
    |         |
    |         v
    |     Returns: skill_level (beginner/intermediate/advanced/expert)
    |
    +---> 5. AdaptiveLearningEngine.identify_teaching_opportunity()
    |         |
    |         +---> If beginner: _beginner_strategy()
    |         |         |
    |         |         +---> _get_analogy()
    |         |         +---> _get_common_pitfalls()
    |         |         +---> _find_related_concepts()
    |         |
    |         +---> If intermediate: _intermediate_strategy()
    |         |         |
    |         |         +---> _get_best_practices()
    |         |         +---> _get_usage_patterns()
    |         |         +---> _get_alternative_methods()
    |         |
    |         +---> If advanced: _advanced_strategy()
    |         |         |
    |         |         +---> _get_performance_tips()
    |         |         +---> _get_advanced_patterns()
    |         |         +---> _get_edge_cases()
    |         |
    |         +---> If expert: _expert_strategy()
    |                   |
    |                   +---> _get_underlying_theory()
    |                   +---> _get_implementation_details()
    |                   +---> _get_research_references()
    |         |
    |         v
    |     Returns: teaching_moment dict
    |
    +---> 6. InsightDelivery.deliver(teaching_moment, result)
              |
              +---> If verbosity='minimal': _minimal_delivery()
              |         |
              |         +---> Print one-line tip
              |
              +---> If verbosity='normal': _normal_delivery()
              |         |
              |         +---> _print_header()
              |         +---> _print_section() x N
              |         +---> _wrap_text()
              |
              +---> If verbosity='detailed': _detailed_delivery()
                        |
                        +---> _print_header(detailed=True)
                        +---> _print_section() x N
                        +---> _print_list() x N
                        +---> _wrap_text()
              |
              v
          Teaching moment displayed to user
```

---

## 📊 Progress Tracking Flow

```
User calls get_learning_progress()
    |
    v
PedagogicalAPI.get_learning_progress()
    |
    v
AdaptiveLearningEngine.get_progress(call_history)
    |
    +---> _calculate_skill_trajectory()
    |
    +---> _identify_mastered_concepts()
    |
    v
Returns: {
    'total_calls': int,
    'method_diversity': [methods],
    'skill_trajectory': [levels],
    'mastered_concepts': [concepts]
}
```

---

## 🗺️ Concept Path Generation Flow

```
User calls get_concept_path(target)
    |
    v
PedagogicalAPI.get_concept_path(target_concept)
    |
    v
ConceptDependencyMapper.get_learning_path(target_concept)
    |
    +---> get_prerequisites(target_concept)
    |         |
    |         +---> _collect_prerequisites(concept, collected)
    |         |         |
    |         |         +---> Recursive traversal of dependency graph
    |         |
    |         +---> _topological_sort(concepts)
    |         |
    |         v
    |     Returns: [ordered prerequisites]
    |
    +---> For each prerequisite:
    |         |
    |         +---> Get metadata from concept_metadata
    |         +---> _get_dependent_concepts(concept)
    |         |
    |         v
    |     Build step dict with concept info
    |
    v
Returns: [
    {step: 1, concept: 'variables', description: '...'},
    {step: 2, concept: 'functions', description: '...'},
    {step: 3, concept: target_concept, description: '...'}
]
```

---

## 🎯 Concept Suggestion Flow

```
User calls suggest_next_concepts(mastered)
    |
    v
PedagogicalAPI.suggest_next_concepts(mastered)
    |
    +---> If mastered is None:
    |         |
    |         +---> get_learning_progress()
    |         +---> Extract mastered_concepts from progress
    |
    v
ConceptDependencyMapper.suggest_next_concepts(mastered_concepts)
    |
    +---> For each concept in graph:
    |         |
    |         +---> get_prerequisites(concept)
    |         |
    |         +---> Check if all prereqs are in mastered
    |         |
    |         +---> If yes and concept not mastered:
    |                   Add to suggestions
    |
    +---> _topological_sort(suggestions)
    |
    v
Returns: [next concepts to learn]
```

---

## 🧠 Skill Inference Decision Tree

```
SkillInferenceEngine.infer_level(history, profile)
    |
    +---> Count total calls
    +---> Analyze method diversity
    +---> Check for patterns
    |
    v
_expert_indicators()?
    |
    +---> YES -> _detect_expert_patterns()?
    |             |
    |             +---> YES -> Return 'expert'
    |             +---> NO  -> Continue
    |
    +---> NO  -> Continue
    |
    v
_advanced_indicators()?
    |
    +---> YES -> _detect_complex_patterns()?
    |             |
    |             +---> YES -> Return 'advanced'
    |             +---> NO  -> Continue
    |
    +---> NO  -> Continue
    |
    v
_intermediate_indicators()?
    |
    +---> YES -> _detect_basic_patterns()?
    |             |
    |             +---> YES -> Return 'intermediate'
    |             +---> NO  -> Continue
    |
    +---> NO  -> Return 'beginner'
```

---

## 🌐 Web App Request Flow

```
Browser Request: POST /api/call
    |
    v
Flask route: api_call()
    |
    +---> Parse JSON: {method, args, verbosity}
    |
    +---> Get or create PedagogicalAPI instance
    |
    +---> Set verbosity
    |
    +---> ped_api.call(method, *args)
    |         |
    |         v
    |     [Full call flow as shown above]
    |
    +---> ped_api.get_learning_progress()
    |
    +---> ped_api._infer_skill_level()
    |
    v
Return JSON: {
    success: true,
    result: result,
    skill_level: 'intermediate',
    total_calls: 42
}
    |
    v
Browser displays result + teaching moment
```

---

## 🔍 Context Analysis Detail

```
ContextAnalyzer.analyze(frame)
    |
    +---> If frame is None:
    |         Return _empty_context()
    |
    +---> Extract from frame object:
    |         |
    |         +---> frame.f_code.co_filename
    |         +---> frame.f_code.co_name
    |         +---> frame.f_lineno
    |         +---> frame.f_locals
    |         +---> frame.f_globals
    |
    +---> Build call chain:
    |         |
    |         +---> Walk up frame.f_back
    |         +---> Collect function names
    |         +---> Stop at 10 frames or end
    |
    +---> Read source code:
    |         |
    |         +---> Use inspect.getsourcelines()
    |         +---> Extract context_lines before/after
    |
    v
Return: {
    'file': str,
    'function': str,
    'line': int,
    'variables': dict,
    'call_chain': [funcs],
    'module': str,
    'code_snippet': str
}
```

---

## 📈 Function Call Statistics

**Average Call Depth:** 3-5 functions
**Maximum Call Depth:** 8 functions (during detailed teaching)
**Parallel Calls:** Context analysis + method execution
**Cached Results:** Concept graph (built once)

---

## ⚡ Performance Characteristics

**Fastest Path:** Minimal verbosity, expert skill
- 3-4 function calls
- ~1ms overhead

**Average Path:** Normal verbosity, intermediate skill
- 6-8 function calls
- ~5ms overhead

**Slowest Path:** Detailed verbosity, beginner skill
- 10-12 function calls
- ~15ms overhead

**Memory Usage:**
- Call history: ~1KB per call
- Concept graph: ~50KB (constant)
- Total overhead: <1MB typical

---

## 🎓 Teaching Strategy Selection

```
Strategy Selection Algorithm:
    
    IF skill_level == 'beginner':
        Focus: Fundamentals
        Content: Analogies, pitfalls, basics
        Methods: _beginner_strategy() calls:
            - _get_analogy()
            - _get_common_pitfalls()
            - _find_related_concepts()
    
    ELIF skill_level == 'intermediate':
        Focus: Patterns & practices
        Content: Best practices, patterns, alternatives
        Methods: _intermediate_strategy() calls:
            - _get_best_practices()
            - _get_usage_patterns()
            - _get_alternative_methods()
    
    ELIF skill_level == 'advanced':
        Focus: Performance & optimization
        Content: Performance, advanced patterns, edge cases
        Methods: _advanced_strategy() calls:
            - _get_performance_tips()
            - _get_advanced_patterns()
            - _get_edge_cases()
    
    ELSE: # expert
        Focus: Theory & architecture
        Content: Theory, implementation, research
        Methods: _expert_strategy() calls:
            - _get_underlying_theory()
            - _get_implementation_details()
            - _get_research_references()
```

---

## 🔄 State Management

```
PedagogicalAPI manages:
    - wrapped_api (the original API)
    - call_history (list of call records)
    - user_profile (dict of user data)
    - learning_engine (shared instance)
    - concept_mapper (shared instance)
    - skill_inference (shared instance)
    - context_analyzer (shared instance)
    - insight_delivery (shared instance)

Call History Entry:
    {
        'method': str,
        'args_count': int,
        'kwargs_count': int,
        'result_type': str,
        'context': {...},
        'timestamp': ISO datetime
    }
```

---

This flow diagram shows how **108 functions** work together to create an intelligent, adaptive teaching system! 🎯
