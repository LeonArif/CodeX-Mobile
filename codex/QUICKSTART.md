# Quick Start Guide: Building Production APK/IPA

## Prerequisites Checklist

Before you start building, ensure you have:

- [ ] Node.js 18+ installed
- [ ] EAS CLI installed: `npm install -g eas-cli`
- [ ] Expo account created at https://expo.dev
- [ ] For iOS: Apple Developer account ($99/year)
- [ ] For Android: Google Play Developer account ($25 one-time)

## First Time Setup

### 1. Install Dependencies
```bash
cd codex
npm install
```

### 2. Login to Expo
```bash
eas login
```

### 3. Configure EAS Build
```bash
eas build:configure
```

This will:
- Link your project to Expo
- Generate a project ID
- Update `app.json` with the project ID

### 4. Update Configuration

Edit `app.json` and update the `projectId`:
```json
{
  "expo": {
    "extra": {
      "eas": {
        "projectId": "YOUR_ACTUAL_PROJECT_ID"
      }
    }
  }
}
```

**Note:** After running `eas build:configure`, your actual project ID will be automatically inserted. The placeholder format is `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`.

## Building Android APK

### Option 1: Using EAS Build (Recommended)

```bash
# Development build (for testing)
npm run build:android -- --profile development

# Preview build (internal testing)
npm run build:android -- --profile preview

# Production build (for Play Store)
npm run build:android -- --profile production
```

The build will run in the cloud and you'll receive a download link when complete.

### Option 2: Local Build

```bash
# Generate native Android project
npx expo prebuild --platform android

# Build locally (requires Android Studio)
cd android
./gradlew assembleRelease

# APK will be at: android/app/build/outputs/apk/release/app-release.apk
```

## Building iOS IPA

**Note:** Requires macOS and Apple Developer account

### Using EAS Build

```bash
# Development build
npm run build:ios -- --profile development

# Production build (for App Store)
npm run build:ios -- --profile production
```

## Checking Build Status

```bash
# List all builds
eas build:list

# View specific build details
eas build:view [BUILD_ID]

# Download build
eas build:download [BUILD_ID]
```

## Testing Builds

### Android APK

1. Download APK from EAS dashboard
2. Transfer to Android device via USB, email, or cloud storage
3. Enable "Install from Unknown Sources" in Settings
4. Open APK file and install
5. Test all functionality (see TESTING.md)

### iOS IPA (TestFlight)

1. Build completes on EAS
2. Use EAS Submit to upload to App Store Connect:
```bash
eas submit --platform ios
```
3. In App Store Connect, add build to TestFlight
4. Invite testers via email
5. Testers install via TestFlight app

## Common Build Commands

```bash
# Build for specific platform
npm run build:android     # Android only
npm run build:ios         # iOS only
npm run build:all         # Both platforms

# Build with specific profile
eas build -p android --profile preview
eas build -p android --profile production       # APK for direct distribution
eas build -p android --profile production-store # AAB for Play Store
eas build -p ios --profile production

# Check build status
eas build:list
eas build:view --json

# Cancel ongoing build
eas build:cancel [BUILD_ID]
```

## Troubleshooting

### "No development team found"
- Add your Apple Developer account in Xcode
- Or add `"appleTeamId": "YOUR_TEAM_ID"` to `app.json` under `ios`

### "Build failed with Gradle error"
- Check Android SDK version compatibility
- Ensure `compileSdkVersion` and `targetSdkVersion` match in `app.json`

### "EAS project not configured"
- Run `eas build:configure`
- Ensure `projectId` is set in `app.json`

### Build takes too long
- EAS Build queue can be busy
- Priority builds available with paid Expo plan
- Consider local build for faster iteration

## Next Steps After Building

1. **Test thoroughly** - See TESTING.md checklist
2. **Update version** - Increment version in `app.json`
3. **Submit to stores**:
   - Android: Google Play Console
   - iOS: App Store Connect
4. **Monitor** - Check for crashes and user feedback

## Build Size Optimization

If build is too large:

```bash
# Analyze bundle size
npx expo export --dump-sourcemap

# Remove unused dependencies
npm prune

# Optimize images
# Use tools like ImageOptim or tinypng.com

# Enable Hermes (already enabled by default)
```

## Resources

- [Expo EAS Build Docs](https://docs.expo.dev/build/introduction/)
- [Android App Signing](https://docs.expo.dev/app-signing/app-credentials/)
- [iOS Provisioning](https://docs.expo.dev/app-signing/app-credentials/)
- [Google Play Store Submission](https://support.google.com/googleplay/android-developer/answer/9859152)
- [App Store Submission](https://developer.apple.com/app-store/submissions/)

## Support

For issues:
1. Check [Expo Forums](https://forums.expo.dev/)
2. Search [GitHub Issues](https://github.com/expo/expo/issues)
3. Expo Discord community
