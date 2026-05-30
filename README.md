# Password Master – Ethical Hacking Terminal

**Our Vision:** To foster a digital environment where individuals recognize the critical importance of password security and completely eliminate the use of vulnerable passwords.

**The Problem:** Currently, 70% of internet users still rely on weak passwords. Common choices like "123456", "password", or "qwerty" can be compromised in just one second. Most users remain completely unaware of the severe security risks their passwords pose.

**The Solution:** Password Master provides immediate, real-time insights by displaying:
* The exact entropy of the password.
* The estimated time required for a hacker to crack it.
* Immediate warnings if the password has been exposed in a known data breach.

**Why This Tool Stands Out:**
* **Precise Crack Time Estimation:** Goes beyond generic strength bars to provide exact timeframes.
* **Adjustable Attack Speed Slider:** Allows users to simulate threat levels ranging from standard online attacks to nation-state computing power.
* **Visual Heatmap:** Helps users easily determine the optimal combination of password length and character sets.
* **HIBP Integration:** Verifies passwords against real-world data breaches using the "Have I Been Pwned" database.
* **Live SHA-256 Hashing:** Displays the hash in real-time for educational purposes.

**How to Use:**
1. Type in a password or use the generator.
2. Review the estimated crack time to assess the vulnerability of your password.
3. Generate and adopt a robust, secure password.
4. Run a breach check—if your password has been leaked, change it immediately.

**Technical Specifications:**
* Secure random password generation utilizing the Web Crypto API.
* Privacy-focused HIBP API calls using k-anonymity (ensuring the full password is never transmitted to the server).
* Cross-Site Scripting (XSS) protection via CSP meta tags.
* DevTools detection coupled with local ban simulation to deter unauthorized inspection.

**Future Roadmap:**
* Password Vault (Secure, local encrypted storage)
* Exportable PDF security reports
* Dedicated browser extension
* Custom wordlist upload capabilities

**Disclaimer:** *This tool is designed strictly for educational and ethical purposes. IP blocking features are simulated. For maximum real-world security, always enable Two-Factor Authentication (2FA) and utilize a trusted password manager.*
