"""
Test CORS configuration in the API
"""
import os
import sys

# Add parent directory to path so we can import api
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))


def test_cors_default_all_origins():
    """Test that CORS defaults to allowing all origins"""
    # Clear any existing CORS_ORIGINS env var
    if "CORS_ORIGINS" in os.environ:
        del os.environ["CORS_ORIGINS"]
    
    # Re-import to get fresh config
    import importlib
    import api
    importlib.reload(api)
    
    assert api.allowed_origins == ["*"]


def test_cors_single_origin():
    """Test CORS with a single specific origin"""
    os.environ["CORS_ORIGINS"] = "https://test.railway.app"
    
    # Re-import to get fresh config
    import importlib
    import api
    importlib.reload(api)
    
    assert api.allowed_origins == ["https://test.railway.app"]
    
    # Clean up
    del os.environ["CORS_ORIGINS"]


def test_cors_multiple_origins():
    """Test CORS with multiple comma-separated origins"""
    os.environ["CORS_ORIGINS"] = "https://test1.railway.app,https://test2.railway.app,https://test3.com"
    
    # Re-import to get fresh config
    import importlib
    import api
    importlib.reload(api)
    
    assert api.allowed_origins == [
        "https://test1.railway.app",
        "https://test2.railway.app",
        "https://test3.com"
    ]
    
    # Clean up
    del os.environ["CORS_ORIGINS"]


def test_cors_with_spaces():
    """Test CORS handles spaces in comma-separated list"""
    os.environ["CORS_ORIGINS"] = "https://test1.railway.app, https://test2.railway.app"
    
    # Re-import to get fresh config
    import importlib
    import api
    importlib.reload(api)
    
    # Spaces should be stripped
    assert api.allowed_origins == [
        "https://test1.railway.app",
        "https://test2.railway.app"
    ]
    
    # Clean up
    del os.environ["CORS_ORIGINS"]


if __name__ == "__main__":
    print("Testing CORS configuration...")
    test_cors_default_all_origins()
    print("✓ Default all origins test passed")
    
    test_cors_single_origin()
    print("✓ Single origin test passed")
    
    test_cors_multiple_origins()
    print("✓ Multiple origins test passed")
    
    test_cors_with_spaces()
    print("✓ Spaces handling test passed")
    
    print("\n✅ All CORS configuration tests passed!")
