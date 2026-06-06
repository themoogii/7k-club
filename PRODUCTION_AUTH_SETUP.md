# 7K Production Auth Setup

The current website is a local static prototype. The phone UI is ready, but real SMS verification needs a provider so private SMS keys stay off the browser.

## Recommended Provider

Use Firebase Authentication for:

- Google sign-in
- Apple sign-in
- Phone number SMS verification
- reCAPTCHA protection

Production install, after migrating to Next.js:

```bash
npm install firebase
```

## Browser Hook Used By This Prototype

The static site will call these functions when they exist:

```js
window.SevenKAuth = {
  async sendSmsCode(phone) {
    // Call Firebase phone auth, Supabase edge function, or your backend.
    return { provider: "firebase" };
  },
  async verifySmsCode(phone, code) {
    // Return true when the SMS code is valid.
    return true;
  },
};
```

Without that hook, the local demo uses prototype code `123456`.

## Production Notes

- Do not put Twilio, MessageBird, or SMS provider secret keys in `index.html` or `script.js`.
- If using Twilio, create a backend endpoint or Supabase Edge Function that sends and verifies codes.
- If using Firebase, configure Phone Auth in Firebase Console and add your real domain before launch.
- For local testing, Firebase phone auth usually needs test phone numbers configured in the Firebase Console.
