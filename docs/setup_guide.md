# How to Run Digital Doula

Since you are using **Expo**, you have two main options to run the app. Option 1 is the easiest and recommended for quick testing.

## Option 1: Run on your Physical Phone (Recommended)
**No heavy downloads required on your PC.**

1.  **Download Expo Go:**
    *   **Android:** Download "Expo Go" from the Google Play Store.
    *   **iOS:** Download "Expo Go" from the App Store.
2.  **Connect to Wi-Fi:** Ensure your phone and your computer are connected to the **same Wi-Fi network**.
3.  **Start the App:**
    *   In your terminal (in `frontend/` directory), run: `npx expo start`
    *   You will see a QR code in the terminal.
4.  **Scan QR Code:**
    *   **Android:** Open Expo Go -> Scan QR Code.
    *   **iOS:** Open Camera app -> Scan QR Code -> Tap to open in Expo Go.

> **Important for Physical Devices:**
> You need to update the API URL in the code to point to your computer's local IP address instead of `localhost` or `10.0.2.2`.
> 1. Find your computer's IP (Run `ipconfig` in terminal, look for IPv4 Address, e.g., `192.168.1.5`).
> 2. Update `frontend/OnboardingScreen.tsx`, `TimelineScreen.tsx`, and `ChatScreen.tsx`:
>    ```javascript
>    // Change this:
>    const API_URL = 'http://10.0.2.2:8000/...';
>    // To this (example):
>    const API_URL = 'http://192.168.1.5:8000/...';
>    ```

---

## Option 2: Run on Android Emulator (Advanced)
**Requires downloading Android Studio (~1GB+).**

1.  **Download Android Studio:**
    *   Go to [developer.android.com/studio](https://developer.android.com/studio) and download "Android Studio Iguana" (or latest).
2.  **Install & Setup:**
    *   Run the installer. Ensure "Android Virtual Device" is checked.
    *   Open Android Studio.
    *   Go to **More Actions** > **Virtual Device Manager**.
3.  **Create a Device:**
    *   Click **Create device**.
    *   Choose a phone (e.g., Pixel 6).
    *   Select a System Image (e.g., "Tiramisu" or "UpsideDownCake" - API 33/34). Download it if needed.
    *   Finish and click the **Play** button to launch the emulator.
4.  **Run the App:**
    *   Once the emulator is running on your screen, run `npm run android` in your terminal.
