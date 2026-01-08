"""
Module metrics tracker for system monitoring
"""

import time
from typing import Dict, Any, Optional
from datetime import datetime


class ModuleMetrics:
    """Track metrics for system modules"""
    
    def __init__(self):
        self.metrics: Dict[str, Dict[str, Any]] = {}
        self.start_time = time.time()
    
    def record_request(self, module_id: str, duration_ms: float, success: bool):
        """Record a module request"""
        if module_id not in self.metrics:
            self.metrics[module_id] = {
                "total_requests": 0,
                "total_duration_ms": 0.0,
                "errors": 0,
                "last_request_time": None
            }
        
        self.metrics[module_id]["total_requests"] += 1
        self.metrics[module_id]["total_duration_ms"] += duration_ms
        self.metrics[module_id]["last_request_time"] = datetime.now().isoformat()
        
        if not success:
            self.metrics[module_id]["errors"] += 1
    
    def get_metrics(self, module_id: str) -> Dict[str, Any]:
        """Get metrics for a specific module"""
        if module_id not in self.metrics:
            return {
                "total_requests": 0,
                "avg_response_time_ms": 0.0,
                "error_rate": 0.0,
                "last_request_time": None
            }
        
        m = self.metrics[module_id]
        avg_time = m["total_duration_ms"] / m["total_requests"] if m["total_requests"] > 0 else 0
        error_rate = m["errors"] / m["total_requests"] if m["total_requests"] > 0 else 0
        
        return {
            "total_requests": m["total_requests"],
            "avg_response_time_ms": round(avg_time, 2),
            "error_rate": round(error_rate, 4),
            "last_request_time": m["last_request_time"]
        }
    
    def get_uptime(self) -> float:
        """Get system uptime in seconds"""
        return time.time() - self.start_time


# Global metrics tracker
metrics_tracker = ModuleMetrics()
