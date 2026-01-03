# Frontend Integration Testing Guide

## Quick Start Testing

### Prerequisites
1. Backend API running on port 8080
2. Frontend dev server running on port 3000

### Start the Stack

**Terminal 1 - Backend:**
```bash
cd /Users/imac/app/Cubit
source .venv/bin/activate
python api.py
```
Expected output:
```
INFO:     Started server process [XXXX]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:8080 (Press CTRL+C to quit)
```

**Terminal 2 - Frontend:**
```bash
cd /Users/imac/app/Cubit/frontend
npm run dev
```
Expected output:
```
  ▲ Next.js 16.1.1
  - Local:        http://localhost:3000
  - Turbopack (HMR): enabled

 ✓ Starting...
 ✓ Ready in XXXms
```

---

## Test Scenarios

### Test 1: Basic Teaching Mode
**Objective:** Verify teaching mode toggle and verbosity control

1. Open http://localhost:3000
2. Find "Teaching Mode" section with toggle switch
3. Click toggle - should turn ON (accent color)
4. Verbosity dropdown should appear
5. Change verbosity: Minimal → Normal → Detailed
6. Click toggle again - should turn OFF (gray)
7. Verbosity dropdown should disappear

**Expected:** Smooth toggle animation, dropdown shows/hides correctly

---

### Test 2: Execute Code with Teaching OFF
**Objective:** Verify standard execution without teaching

1. Ensure Teaching Mode is OFF
2. Select "Hello World" example
3. Click "Run Code"
4. Wait for response

**Expected Output:**
- ✅ Standard output shows "Hello, World!"
- ✅ Result shows null
- ❌ No skill level badge
- ❌ No progress panel
- ❌ No suggestions panel

---

### Test 3: Execute Code with Teaching ON (Normal)
**Objective:** Verify full teaching integration

1. Turn Teaching Mode ON
2. Set verbosity to "Normal"
3. Select "Fibonacci" example
4. Click "Run Code"
5. Wait for response

**Expected Output:**
- ✅ Standard output shows Fibonacci sequence teaching moments
- ✅ Skill level badge appears (e.g., "Intermediate" in blue)
- ✅ Progress panel shows:
  - Total calls (e.g., "5")
  - Methods used (e.g., "fibonacci", "while", "print")
  - Mastered concepts (if any)
- ✅ Suggestions panel shows next learning steps in blue

---

### Test 4: Verbosity Levels
**Objective:** Verify different verbosity outputs

**Test 4a: Minimal Verbosity**
1. Teaching Mode ON, Verbosity = "Minimal"
2. Run: `sum(5, 10)`
3. Expected: Brief teaching tips in output

**Test 4b: Normal Verbosity**
1. Teaching Mode ON, Verbosity = "Normal"
2. Run: `sum(5, 10)`
3. Expected: Balanced explanations

**Test 4c: Detailed Verbosity**
1. Teaching Mode ON, Verbosity = "Detailed"
2. Run: `sum(5, 10)`
3. Expected: In-depth teaching with examples and context

---

### Test 5: Progress Dashboard
**Objective:** Verify progress tracking and concept browser

1. Click "Show Progress" button
2. Dashboard should slide in smoothly
3. Verify sections:
   - **Learning Dashboard** header with "Refresh Progress" button
   - **Your Progress** panel (may show "no progress yet" if fresh)
   - **Programming Concepts** panel with difficulty tabs
4. Click "Beginner" tab
   - Should show green-themed concepts
   - Each concept card shows prerequisites and difficulty
5. Click "Intermediate" tab
   - Should show blue-themed concepts
6. Click "Advanced" tab
   - Should show purple-themed concepts
7. Click "Refresh Progress" button
   - Should show loading state briefly
   - Should fetch latest progress from API
8. Click "Show Progress" again to hide
   - Should slide out smoothly

**Expected:** Smooth animations, accurate concept data, working tabs

---

### Test 6: Creative Commands Integration
**Objective:** Verify new pedagogical commands

1. Click "Show Creative Commands" button
2. Navigate to "Code Intelligence" category
3. Find and click "Learning Progress" command
   - Should show toast: "Fetching learning progress..."
   - Should open modal with progress message
   - Modal should display current progress or message about needing to use teaching mode
4. Click "Concept Explorer" command
   - Should show toast: "Loading concept graph..."
   - Should open modal with concept summary
   - Should show counts: Beginner (X), Intermediate (Y), Advanced (Z)
   - Should list sample concepts from each category

**Expected:** Commands execute, modals display correct data

---

### Test 7: Error Handling
**Objective:** Verify graceful error handling

**Test 7a: Backend Offline**
1. Stop backend server (Ctrl+C in Terminal 1)
2. Try to run code in frontend
3. Expected: Error message in red panel: "Unable to connect to the backend API..."

**Test 7b: Invalid Code**
1. Start backend again
2. Enter invalid code: `this is not valid cubit code`
3. Click "Run Code"
4. Expected: Error panel shows syntax error from interpreter

**Test 7c: Network Timeout**
1. Disconnect from network
2. Try to run code
3. Expected: Retry logic activates, eventually shows connection error

---

### Test 8: Multi-Run Progress Tracking
**Objective:** Verify progress accumulates across runs

1. Teaching Mode ON, Verbosity "Normal"
2. Run: `sum(5, 10)`
   - Note progress: total_calls = 1, methods = ['sum']
3. Run: `multiply(3, 7)`
   - Progress should update: total_calls = 2, methods = ['sum', 'multiply']
4. Run: `sum(1, 2)` again
   - Progress: total_calls = 3, methods still ['sum', 'multiply']
5. Open Progress Dashboard
6. Click "Refresh Progress"
7. Verify progress matches accumulated data

**Expected:** Progress accumulates correctly, dashboard shows latest data

---

### Test 9: Skill Level Detection
**Objective:** Verify automatic skill detection

**Test 9a: Beginner Code**
```cubit
set x = 10
print(x)
```
Expected skill level: "Beginner" (green badge)

**Test 9b: Intermediate Code**
```cubit
fibonacci(10)
set i = 0
while i < 5 {
    print(i)
    set i = i + 1
}
```
Expected skill level: "Intermediate" (blue badge)

**Test 9c: Advanced Code**
```cubit
// Run multiple functions with loops
set i = 0
while i < 3 {
    fibonacci(i)
    sum(i, i + 1)
    set i = i + 1
}
```
Expected skill level: "Advanced" or "Expert" (purple/yellow badge)

---

### Test 10: Responsive Design
**Objective:** Verify mobile/tablet compatibility

1. Open browser DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Test different viewports:
   - Mobile (375px)
   - Tablet (768px)
   - Desktop (1920px)
4. Verify:
   - Teaching controls stack properly
   - Progress dashboard is readable
   - Concept cards adapt to width
   - Buttons are accessible
   - Text doesn't overflow

**Expected:** All features work on all screen sizes

---

## Visual Checklist

### Teaching Mode Panel
```
┌─────────────────────────────────────┐
│ Teaching Mode          [●──────]    │  ← Toggle switch
│ Verbosity: [Normal         ▼]       │  ← Dropdown (when ON)
└─────────────────────────────────────┘
```
- [ ] Toggle animates smoothly
- [ ] Accent color when ON, gray when OFF
- [ ] Dropdown appears/disappears based on toggle

### Output Panels
```
┌─────────────────────────────────────┐
│ Output:                             │
│                                     │
│ Detected Skill Level: [Intermediate]│  ← Badge with color
│                                     │
│ Standard Output:                    │
│ [Teaching moments and results]      │
│                                     │
│ Result:                             │
│ [JSON formatted result]             │
│                                     │
│ Learning Progress:                  │
│ Total Function Calls: 5             │
│ Methods Used: [sum] [multiply]      │
│ Mastered: [variables] [functions]   │
│                                     │
│ Next Learning Steps:                │
│ • Try using conditionals            │
│ • Practice with loops               │
└─────────────────────────────────────┘
```
- [ ] Skill badge has correct color
- [ ] Progress shows numeric data
- [ ] Method badges are styled
- [ ] Mastered concepts are green
- [ ] Suggestions are in blue panel

### Progress Dashboard
```
┌─────────────────────────────────────┐
│ Learning Dashboard  [Refresh ⟳]    │
├─────────────────────────────────────┤
│ Your Progress                       │
│ Great progress! You've used 5...    │
├─────────────────────────────────────┤
│ Programming Concepts                │
│ [Beginner] [Intermediate] [Advanced]│
│                                     │
│ Variables               [beginner]  │
│ Prerequisites: none                 │
│                                     │
│ Functions               [beginner]  │
│ Prerequisites: variables            │
└─────────────────────────────────────┘
```
- [ ] Tabs switch correctly
- [ ] Concepts show prerequisites
- [ ] Color coding matches difficulty
- [ ] Refresh button works

---

## Common Issues & Solutions

### Issue: "Unable to connect to backend"
**Solution:** 
- Check backend is running: `curl http://localhost:8080/health`
- Verify .env.local has correct NEXT_PUBLIC_API_URL
- Check no firewall blocking port 8080

### Issue: No teaching data appears
**Solution:**
- Ensure Teaching Mode toggle is ON
- Verify backend logs show teaching_enabled=True in request
- Check browser console for API errors

### Issue: Concepts don't load
**Solution:**
- Check /concepts endpoint: `curl http://localhost:8080/concepts`
- Verify backend has concept_mapper module
- Check browser console for fetch errors

### Issue: Progress doesn't update
**Solution:**
- Click "Refresh Progress" button
- Verify you've run code with teaching enabled
- Check /progress endpoint returns data

---

## Performance Benchmarks

### Expected Response Times
- Code execution: < 500ms
- Progress fetch: < 100ms
- Concept fetch: < 100ms
- Teaching overhead: ~50-100ms extra per execution

### Bundle Size (After Integration)
- Main bundle: ~200-250 KB
- Vendor bundle: ~150-200 KB
- Total initial load: ~350-450 KB

Use Creative Commands → Bundle Analyzer to verify

---

## Success Criteria

✅ All 10 test scenarios pass  
✅ No TypeScript errors in frontend  
✅ No console errors during normal use  
✅ Teaching mode toggles smoothly  
✅ All verbosity levels work  
✅ Progress accumulates correctly  
✅ Skill detection is accurate  
✅ Dashboard loads and displays concepts  
✅ Creative commands fetch real data  
✅ Error handling is graceful  
✅ Responsive on mobile/tablet/desktop  

---

## Next Steps After Testing

1. **Report Issues:** Document any bugs found
2. **Performance:** Run Lighthouse audit
3. **Accessibility:** Test with screen reader
4. **Edge Cases:** Test unusual inputs
5. **Load Testing:** Multiple concurrent users
6. **Documentation:** Update user guide

---

## Quick Debug Commands

**Check Backend Health:**
```bash
curl http://localhost:8080/health
```

**Test Progress Endpoint:**
```bash
curl http://localhost:8080/progress
```

**Test Concepts Endpoint:**
```bash
curl http://localhost:8080/concepts
```

**Test Execute with Teaching:**
```bash
curl -X POST http://localhost:8080/execute \
  -H "Content-Type: application/json" \
  -d '{"code":"sum(5, 10)","teaching_enabled":true,"verbosity":"normal"}'
```

**Check Frontend Env:**
```bash
cat frontend/.env.local
```

---

## Automated Testing (Future)

Consider implementing:
- E2E tests with Playwright/Cypress
- Component tests with React Testing Library
- API integration tests
- Visual regression tests

---

**Testing Time Estimate:** ~30-45 minutes for complete test suite

**Good luck! 🚀**
