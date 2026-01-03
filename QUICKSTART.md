# 🚀 Cubit Quick Start Guide

## Get Running in 2 Minutes

### 1. Start Backend (Terminal 1)
```bash
cd /Users/imac/app/Cubit
source .venv/bin/activate
python api.py
```
**Expected:** Server running on http://localhost:8080

### 2. Start Frontend (Terminal 2)
```bash
cd /Users/imac/app/Cubit/frontend
npm run dev
```
**Expected:** App running on http://localhost:3000

### 3. Open Browser
Navigate to: **http://localhost:3000**

---

## Quick Feature Tour

### Enable Teaching (30 seconds)
1. Find "Teaching Mode" section
2. Click toggle switch → ON
3. Select verbosity: "Normal"
4. Run any example code
5. See skill level, progress, and suggestions!

### View Progress (15 seconds)
1. Click "Show Progress" button
2. Explore concept browser
3. Click difficulty tabs (Beginner/Intermediate/Advanced)
4. See prerequisites for each concept

### Try Commands (20 seconds)
1. Click "Show Creative Commands"
2. Navigate to "Code Intelligence"
3. Click "Learning Progress" → view summary
4. Click "Concept Explorer" → browse concepts

---

## Example Code to Try

### Beginner
```cubit
set x = 10
print(x)
```

### Intermediate
```cubit
fibonacci(8)
```

### Advanced
```cubit
set i = 0
while i < 5 {
    fibonacci(i)
    set i = i + 1
}
```

---

## Key Features

✨ **Teaching Mode** - Toggle ON for learning insights  
🎯 **Skill Detection** - Automatic level detection  
📊 **Progress Tracking** - See calls, methods, concepts  
💡 **Suggestions** - Personalized next steps  
📚 **Concept Browser** - 30+ programming concepts  
🎨 **3 Verbosity Levels** - Minimal/Normal/Detailed  

---

## Keyboard Shortcuts

- Run code: Click "Run Code" button
- Clear output: Reload page
- Toggle teaching: Click toggle switch
- Change verbosity: Use dropdown

---

## Quick Debug

**Backend not connecting?**
```bash
curl http://localhost:8080/health
```

**Frontend not loading?**
```bash
cd frontend && npm install
```

**Teaching not working?**
- Check Teaching Mode is ON
- Verify backend console shows teaching_enabled=True
- Try refreshing page

---

## File Locations

**Backend:** `/Users/imac/app/Cubit/api.py`  
**Frontend:** `/Users/imac/app/Cubit/frontend/src/app/page.tsx`  
**Pedagogical:** `/Users/imac/app/Cubit/pedagogical/`  
**Docs:** `/Users/imac/app/Cubit/*.md`  

---

## Documentation Quick Links

📖 **Full Integration:** `FRONTEND_INTEGRATION.md`  
🧪 **Testing Guide:** `FRONTEND_TESTING.md`  
📊 **Features List:** `NEW_FEATURES.md`  
🔧 **Functions Catalog:** `PEDAGOGICAL_FUNCTIONS.md`  
📝 **Summary:** `COMPLETE_INTEGRATION_SUMMARY.md`  

---

## Support

**Need help?** Check documentation files  
**Found a bug?** Check browser console  
**Backend issues?** Check terminal output  

---

**That's it! Start learning with Cubit! 🎓**
