# Instagram-Style Social Media App

A modern, clean Instagram-style mobile app built with React Native (Expo) featuring all the essential social media functionalities.

## 🚀 Features

### 📱 **Five Main Screens:**

1. **Feed Screen**
   - Infinite scroll with pull-to-refresh
   - Post cards with images/videos, captions, likes, comments, and share buttons
   - Stories carousel at the top
   - Skeleton loaders for better UX
   - Real-time like functionality

2. **Chat Screen**
   - Chat list with contacts
   - Real-time messaging simulation
   - Voice & video call buttons
   - Online status indicators
   - Unread message badges
   - Typing indicators

3. **Conversation Screen** (NEW!)
   - Real-time chat interface
   - Message bubbles with sent/delivered/read status
   - Typing indicators with animated dots
   - Support for text, image, and voice messages
   - Keyboard-avoiding view
   - Auto-scroll to new messages

4. **Stories Screen**
   - Circular story bubbles for each user
   - Full-screen story view with swipe navigation
   - Progress bars for multiple stories
   - Touch areas for navigation
   - Story interaction (heart, share, message)

5. **Profile Screen**
   - User avatar, username, bio, and verification badge
   - Stats (posts/followers/following)
   - Post grid layout
   - **Embedded Settings** with toggle functionality:
     - Account settings (Edit Profile, Privacy, Private Account)
     - Notifications (Push/Email)
     - Data & Storage (Backup & Sync, Download Data)
     - Support (Help Center, About)
     - Logout functionality

6. **Post Upload Screen**
   - Image/video selector from camera or gallery
   - Permission handling
   - Client-side media preview
   - Caption input with character count
   - Filter options (expandable)
   - Additional options (Location, Tag People, Add Music)
   - Privacy settings

## 🎨 **Design System**

### **Color Palette:**
- **Primary:** #007AFF (Instagram Blue)
- **Accent:** #FF5A5F (Notification Red)
- **Background:** #FFFFFF (Clean White)
- **Surface:** #F8F9FA (Light Gray)

### **Typography:**
- **Font:** System fonts with clear hierarchy
- **H1:** 22px, Weight 700
- **H2:** 18px, Weight 600  
- **Body:** 14px, Weight 400
- Modern typography with proper line heights and letter spacing

### **UI Components:**
- Clean, modern interface with Instagram-inspired design
- Consistent spacing and border radius
- Smooth shadows and elevation
- Interactive elements with proper feedback
- Skeleton loaders for loading states

## 🛠 **Technical Stack**

- **Framework:** React Native with Expo
- **Navigation:** React Navigation (Bottom Tabs + Stack)
- **Icons:** Expo Vector Icons
- **Image Handling:** Expo Image Picker
- **Permissions:** Expo MediaLibrary & Camera
- **TypeScript:** Full type safety
- **Animations:** React Native Animated API

## 📁 **Project Structure**

```
src/
├── components/
│   └── SkeletonLoader.tsx      # Reusable skeleton components
├── navigation/
│   └── AppNavigator.tsx        # Navigation setup with stack and tabs
├── screens/
│   ├── FeedScreen.tsx          # Main feed with posts and stories
│   ├── ChatsScreen.tsx         # Chat list
│   ├── ConversationScreen.tsx  # Individual chat conversation
│   ├── StoriesScreen.tsx       # Stories grid and full-screen viewer
│   ├── ProfileScreen.tsx       # Profile with embedded settings
│   └── PostUploadScreen.tsx    # Post creation
└── theme/
    └── theme.ts                # Design system and theme config
```

## 🔥 **Key Features Implemented**

### **Performance Optimizations:**
- Skeleton loading states
- Lazy loading for images
- Infinite scroll with pagination
- Optimized FlatList rendering
- Smooth animations and transitions

### **User Experience:**
- Pull-to-refresh functionality  
- Real-time typing indicators
- Message status indicators (sent/delivered/read)
- Online status for users
- Keyboard avoiding views
- Auto-scroll for new messages
- Interactive story navigation

### **Modern UI Patterns:**
- Bottom tab navigation
- Stack navigation for chat flows
- Gesture-based interactions
- Context-aware interfaces
- Responsive design

## 🚀 **Getting Started**

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm start
   ```

3. **Run on device:**
   - Scan QR code with Expo Go app
   - Or press `i` for iOS simulator
   - Or press `a` for Android emulator

## 📱 **Demo Features**

- Tap on chat items to open conversations
- Send messages in real-time
- Experience typing indicators
- Like posts in the feed
- Navigate through stories
- Toggle between profile and settings
- Try the post upload flow
- Pull to refresh feeds

## 🔮 **Future Enhancements**

- Real backend integration
- Push notifications
- Video calling functionality  
- Story recording and filters
- Advanced image editing
- User authentication
- Cloud storage integration
- Real-time messaging with Socket.io

---

Built with ❤️ using React Native & Expo