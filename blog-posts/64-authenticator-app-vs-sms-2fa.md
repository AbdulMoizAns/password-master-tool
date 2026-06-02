# Authenticator Apps vs. SMS 2FA: Which is Safer?

## The Two Most Common 2FA Methods
When enabling two-factor authentication, most services offer two primary options: receiving a code via SMS text message or using an authenticator app that generates codes on your device. While both are significantly more secure than using passwords alone, there are important security differences between these two methods that affect your overall protection level.

## How SMS 2FA Works and Its Vulnerabilities
SMS 2FA works by sending a one-time code to your mobile phone number via text message. When you attempt to log in, the service texts you a code that you enter to complete authentication. The primary vulnerability of SMS 2FA is SIM swapping—a technique where attackers convince your mobile carrier to transfer your phone number to a SIM card in their possession. Once they control your number, they receive all your 2FA codes. Social engineering of customer support representatives, insider threats at mobile carriers, and port-out fraud are common SIM swapping methods. SMS messages can also be intercepted through SS7 protocol vulnerabilities in the cellular network infrastructure.

## How Authenticator Apps Work
Authenticator apps like Google Authenticator, Microsoft Authenticator, and Authy generate time-based one-time passwords (TOTP) directly on your device. When you set up 2FA, the service provides a shared secret key, usually as a QR code. Your authenticator app stores this secret and uses it with the current time to generate a new six-digit code every 30 seconds. The same calculation happens on the server, so the codes match without any data transmission. This means there is no code sent over a network that could be intercepted.

## The Security Advantage of Authenticator Apps
Authenticator apps are significantly more secure than SMS for several reasons. They do not rely on your mobile network provider, eliminating the risk of SIM swapping. The TOTP codes are generated locally and cannot be intercepted in transit. There is no SMS message that could be read by someone with physical access to your phone or by malware that intercepts text messages. Authenticator apps can be backed up and migrated to new devices using encrypted export features, reducing the risk of lockout.

## When SMS is Better Than Nothing
Despite its vulnerabilities, SMS 2FA is still far better than having no 2FA at all. For users who do not have smartphones or find authenticator apps confusing, SMS provides essential protection against the most common threats like automated credential-stuffing attacks. If given the choice between SMS 2FA and no 2FA, always choose SMS. However, for the strongest protection, authenticator apps are always the recommended option.

## Conclusion
Authenticator apps provide superior security compared to SMS 2FA due to their immunity to SIM swapping and network interception. Use authenticator apps for all services that support them. For services that only offer SMS, enable it as a backup but consider migrating to authenticator-based or hardware-key-based authentication when available.
