"""
Demo API for testing pedagogical features
Provides simple methods to demonstrate teaching capabilities
"""


class DemoAPI:
    """A simple demo API for testing pedagogical features"""
    
    def list_append(self, lst, item):
        """Append an item to a list"""
        result = lst.copy() if isinstance(lst, list) else list(lst)
        result.append(item)
        return result
    
    def dict_update(self, dictionary, **kwargs):
        """Update a dictionary with new key-value pairs"""
        result = dictionary.copy()
        result.update(kwargs)
        return result
    
    def string_split(self, text, separator=" "):
        """Split a string by separator"""
        return text.split(separator)
    
    def file_read(self, filename):
        """Simulate file reading (demo only)"""
        return f"[Demo] Content of {filename}"
    
    def list_filter(self, lst, condition):
        """Filter a list based on a condition"""
        return [item for item in lst if condition(item)]
    
    def math_aggregate(self, numbers, operation='sum'):
        """Perform aggregation on numbers"""
        if operation == 'sum':
            return sum(numbers)
        elif operation == 'average':
            return sum(numbers) / len(numbers) if numbers else 0
        elif operation == 'max':
            return max(numbers) if numbers else None
        elif operation == 'min':
            return min(numbers) if numbers else None
        return None
