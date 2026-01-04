# CodeX Mobile Testing Checklist

This checklist helps ensure all features work correctly on mobile devices before releasing APK/IPA builds.

## Pre-Build Testing (Development Environment)

### Basic Functionality
- [ ] App launches successfully on Android emulator
- [ ] App launches successfully on iOS simulator
- [ ] App launches successfully in web browser
- [ ] No console errors on app start
- [ ] Dark mode toggle works
- [ ] Theme persists after app restart

### Authentication
- [ ] Login with Google button appears
- [ ] Google OAuth flow initiates correctly
- [ ] OAuth completes and returns to app (not stuck in browser)
- [ ] User profile loads after login
- [ ] JWT token is stored correctly
- [ ] App remembers logged-in state after restart
- [ ] Logout clears session properly

### Navigation
- [ ] Tab navigation works (Home, Profile)
- [ ] Can navigate to Python tutorials
- [ ] Back button works correctly
- [ ] Deep links work with app scheme (codex://)
- [ ] Stack navigation maintains state

### Python Code Runner
- [ ] Python code editor accepts input
- [ ] Multiline code entry works
- [ ] Run button executes code
- [ ] Output displays correctly
- [ ] Print statements work
- [ ] Variables and basic operations work
- [ ] Error messages display properly
- [ ] Clear button resets editor
- [ ] Code persists between navigation

### Python Tutorials
- [ ] Introduction tutorial loads
- [ ] All code examples are runnable
- [ ] Scrolling works smoothly
- [ ] Progress tracking updates on scroll to bottom
- [ ] If-Else tutorial works
- [ ] Loops tutorial works
- [ ] Arrays tutorial works
- [ ] Functions tutorial works

### Python Exercises
- [ ] Exercise screen loads
- [ ] Code editor works
- [ ] Test cases run correctly
- [ ] Pass/fail indicators show properly
- [ ] Solved status persists
- [ ] Progress updates on completion

### Progress Tracking
- [ ] Home screen shows correct progress
- [ ] Progress bar updates after completing modules
- [ ] Profile screen shows progress
- [ ] Progress syncs with backend
- [ ] Progress persists after app restart

## Post-Build Testing (APK/IPA)

### Android APK Testing
- [ ] APK installs on device without errors
- [ ] App icon displays correctly on home screen
- [ ] Splash screen shows during launch
- [ ] App doesn't crash on first launch
- [ ] Permissions are requested correctly (INTERNET)
- [ ] Google OAuth works in production APK
- [ ] Python code execution works
- [ ] All navigation works
- [ ] Back button behavior is correct
- [ ] App resumes correctly from background

### iOS IPA Testing
- [ ] IPA installs on device (TestFlight or direct)
- [ ] App icon displays correctly
- [ ] Splash screen shows during launch
- [ ] App doesn't crash on first launch
- [ ] Permissions are requested correctly
- [ ] Google OAuth works in production IPA
- [ ] Python code execution works
- [ ] All navigation works
- [ ] App resumes correctly from background

## Performance Testing

### Responsiveness
- [ ] UI responds within 100ms to user input
- [ ] Scrolling is smooth (60 FPS)
- [ ] No lag when typing code
- [ ] Navigation transitions are smooth

### Memory
- [ ] No memory leaks during extended use
- [ ] App doesn't crash after running multiple Python scripts
- [ ] App handles large code inputs (1000+ lines)

### Network
- [ ] App handles slow network gracefully
- [ ] Offline mode doesn't crash app
- [ ] Error messages show for network failures
- [ ] Progress syncs when network returns

## Edge Cases

### Input Validation
- [ ] Empty code submission shows appropriate message
- [ ] Very long code executes or shows size limit
- [ ] Special characters in code don't break parser
- [ ] Unicode characters are handled correctly

### State Management
- [ ] Token expiry is handled gracefully
- [ ] App state persists during interruptions (calls, notifications)
- [ ] Multiple rapid navigation clicks don't break app
- [ ] Orientation changes don't lose state (if supported)

### Error Handling
- [ ] Backend unavailable shows error message
- [ ] Invalid OAuth response doesn't crash app
- [ ] Malformed Python code shows proper error
- [ ] Storage errors are handled

## Accessibility

- [ ] Text is readable on small screens
- [ ] Touch targets are at least 44x44 points
- [ ] Color contrast meets WCAG guidelines
- [ ] Works in both light and dark mode
- [ ] Screen readers can navigate app (optional)

## Security

- [ ] JWT tokens are stored securely
- [ ] No sensitive data in logs
- [ ] HTTPS is used for all API calls
- [ ] OAuth redirect URIs are whitelisted
- [ ] Code execution is sandboxed (Skulpt)

## Build Validation

### Configuration
- [ ] app.json has correct bundle IDs
- [ ] Version numbers are correct
- [ ] All required assets are included
- [ ] Splash screen configuration is correct
- [ ] Build completes without errors

### Distribution
- [ ] APK is under 100MB (reasonable size)
- [ ] IPA is under 100MB (reasonable size)
- [ ] Build includes all necessary permissions
- [ ] No development/debug code in production build

## Sign-off

Once all items are checked:
- [ ] Document any known issues
- [ ] Update version number
- [ ] Tag release in git
- [ ] Upload builds to distribution channels
- [ ] Update documentation with build date/version

## Notes

Record any issues found during testing:

```
Date: _____________
Tester: _____________
Device: _____________
OS Version: _____________

Issues Found:
1. 
2. 
3. 

```
