# How Companies Store Your Passwords (And How They Lose Them)

## Introduction

Every time you create an account, you trust a company with one of your most sensitive pieces of information: your password. But what actually happens to that password after you hit "submit"? How do companies store it, and perhaps more importantly, how do they lose it? Understanding the behind-the-scenes reality of password storage reveals why some breaches result in minor inconveniences while others lead to catastrophic identity theft. This knowledge empowers you to identify which companies deserve your trust and which are ticking time bombs.

## The Right Way: How Passwords SHOULD Be Stored

### Password Hashing: The Foundation

When done correctly, companies **never store your actual password**. Instead, they store a cryptographic hash—a one-way mathematical transformation that looks like gibberish:

```
Your Password: "CorrectHorseBatteryStaple123!"
Stored Hash: "$argon2id$v=19$m=65536,t=3,p=4$xyz123...abc789"
```

**Key properties of proper hashing:**

- **One-way function**: Easy to compute hash from password, impossible to reverse
- **Deterministic**: Same password always produces same hash
- **Unique**: Even tiny password changes create completely different hashes
- **Fixed length**: Output is consistent regardless of input size

### Salting: Adding Randomness

A salt is random data added to each password before hashing:

```
Password: "MyPassword123"
Salt: "x7k9m2p4" (unique per user)
Combined: "MyPassword123x7k9m2p4"
Hash: "$bcrypt$12$abcd1234..."
```

**Why salting matters:**

- Prevents rainbow table attacks (pre-computed hash databases)
- Ensures identical passwords have different hashes
- Forces attackers to crack each password individually
- Makes bulk cracking computationally expensive

### Modern Hashing Algorithms

Not all hashing algorithms are created equal. Here's the evolution:

| Algorithm | Year | Status | Notes |
|-----------|------|--------|-------|
| MD5 | 1991 | ❌ Broken | Cracked in seconds, never use |
| SHA-1 | 1995 | ❌ Deprecated | Vulnerable to collision attacks |
| SHA-256 | 2001 | ⚠️ Insufficient | Too fast for password storage |
| bcrypt | 1999 | ✅ Good | Adaptive, widely adopted |
| scrypt | 2009 | ✅ Better | Memory-hard, resists GPU attacks |
| Argon2 | 2015 | ✅ Best | Winner of Password Hashing Competition |
| PBKDF2 | 2000 | ✅ Acceptable | NIST recommended, but slower adoption |

### Key Stretching: Making Attacks Expensive

Modern algorithms intentionally slow down hash computation:

- **Iteration counts**: Repeat hashing thousands of times
- **Memory requirements**: Force high RAM usage (defeats GPUs)
- **Parallelism limits**: Prevent massive parallelization
- **Tunable difficulty**: Increase as hardware improves

Example: bcrypt with cost factor 12 takes ~300ms per hash attempt. For a legitimate login? Imperceptible. For an attacker trying billions of passwords? Prohibitively expensive.

## The Wrong Way: How Companies Actually Store Passwords (Sometimes)

### Plain Text Storage: The Unforgivable Sin

Shockingly, some companies still store passwords in plain text:

```
Database Entry:
username: john.doe@email.com
password: MySecretPassword123!
```

**Why this happens:**

- Lazy development practices
- Legacy systems never updated
- Desire to email users their passwords (huge red flag!)
- Ignorance of security best practices
- Cost-cutting on security infrastructure

**Real-world examples:**

- **Facebook (2019)**: Hundreds of millions of passwords stored in plain text, accessible to employees
- **LinkedIn (2012)**: 6.5 million passwords hashed without salts (all cracked quickly)
- **Yahoo (2014)**: Used MD5 hashing without salts (effectively plain text)

### Weak Hashing: Almost as Bad

Some companies hash, but do it wrong:

**Unsalted hashes:**
```
Password: "password123"
Hash: "ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f"
```
Problem: Identical passwords = identical hashes. Attackers crack one, crack them all.

**Fast hashes (SHA-256 without stretching):**
```
Password: "SecurePass!"
Hash: "7d38b5cd25a2baf85ad3bb5b93c3e62179a5d0ca3b6d0f07f3dc4a2ef3b2e9a1"
```
Problem: Can compute billions per second on modern GPUs.

**Deprecated algorithms (MD5, SHA-1):**
```
Password: "MyP@ssw0rd"
MD5 Hash: "5f4dcc3b5aa765d61d8327deb882cf99"
```
Problem: Rainbow tables exist for common passwords. Instant lookup.

### Hybrid Disasters: Partially Protected

Some implementations are bafflingly bad:

**Encrypted but reversible:**
- Passwords encrypted (not hashed)
- Encryption key stored nearby
- Breach = all passwords recovered instantly

**Client-side hashing only:**
- Password hashed in browser
- Hash sent to server and stored as-is
- Attacker just needs the hash (becomes the password)

**Hardcoded salts:**
- Same salt used for ALL users
- Defeats the purpose of salting
- Still vulnerable to targeted rainbow tables

## How Companies Lose Your Passwords

### Data Breaches: The Obvious Route

**External Attacks:**

1. **SQL Injection**: Attacker tricks database into revealing contents
   ```sql
   -- Malicious input bypasses authentication
   ' OR '1'='1
   ```

2. **API Exploitation**: Poorly secured endpoints leak data
   - Missing authentication
   - Excessive data return
   - No rate limiting

3. **Server Compromise**: Direct access to databases
   - Unpatched vulnerabilities
   - Stolen credentials
   - Insider threats

4. **Third-Party Vendor Breaches**: Supply chain attacks
   - Cloud provider compromised
   - Payment processor breached
   - Analytics service leaking data

**Real-World Scale:**

| Company | Year | Records Lost | Storage Method | Outcome |
|---------|------|--------------|----------------|---------|
| Yahoo | 2013-14 | 3 billion | MD5 unsalted | Catastrophic |
| Equifax | 2017 | 147 million | Some encrypted | Identity theft |
| Facebook | 2019 | Hundreds of millions | Plain text (internal) | Trust destroyed |
| LinkedIn | 2012 | 164 million | SHA-1 unsalted | All cracked |
| Adobe | 2013 | 153 million | Encrypted (reversible) + hints | Mostly recovered |

### Insider Threats: The Betrayal From Within

Employees with database access can:

- **Copy entire user tables**: Sell on dark web
- **Query specific accounts**: Targeted theft (celebrities, executives)
- **Disable security logging**: Cover their tracks
- **Create backdoors**: Maintain access after leaving

**Why insiders succeed:**

- Overprivileged access (more than needed for job)
- Lack of monitoring on database queries
- No separation of duties
- Inadequate background checks
- Poor offboarding procedures

### Accidental Exposure: Oops Moments

Companies lose passwords through embarrassing mistakes:

**Public repositories:**
- Code uploaded to GitHub with hardcoded credentials
- Database dumps accidentally made public
- Configuration files with connection strings

**Misconfigured servers:**
- Elasticsearch databases left open to internet
- S3 buckets with public access
- Development environments exposed

**Lost devices:**
- Laptops with local database copies
- Backup tapes lost in transit
- Unencrypted hard drives discarded

### Legacy System Liabilities

Old systems create ongoing risks:

**Abandoned but running:**
- Forgotten servers still accessible
- No security updates for years
- Original developers long gone

**Merged acquisitions:**
- Inherited insecure systems
- Integration creates new vulnerabilities
- Inconsistent security standards

**Compliance theater:**
- Systems "updated" to meet minimum requirements
- Checkbox security vs. actual protection
- Audits miss technical debt

## What Happens After a Breach

### The Cracking Process

When hackers obtain password databases:

**Step 1: Identify hashing method**
- Examine hash format/length
- Check for salt storage
- Research company's known practices

**Step 2: Choose attack strategy**

| Hash Quality | Attack Method | Time to Crack Common Passwords |
|--------------|---------------|-------------------------------|
| Plain text | Read directly | Instant |
| MD5/SHA-1 unsalted | Rainbow table lookup | Seconds |
| MD5/SHA-1 salted | Brute force with GPU | Minutes-hours |
| bcrypt/scrypt weak settings | Distributed brute force | Days-weeks |
| Argon2/bcrypt strong settings | Mostly impractical | Years-centuries |

**Step 3: Prioritize targets**
- Common passwords first (top 10,000)
- Executive/administrator accounts
- Patterns matching company culture
- Previously breached passwords

**Step 4: Monetize results**
- Sell on dark web marketplaces
- Use for credential stuffing
- Target high-value accounts specifically
- Combine with other breached data

### The Domino Effect

One company's poor password storage affects you everywhere:

```
Company A (weak hashing) → Breach → Passwords cracked → 
Credential stuffing → Company B (your bank) → Account takeover → 
Financial theft + Identity fraud
```

You did everything right at Company B, but Company A's negligence compromised you both.

## How to Identify Companies That Store Passwords Properly

### Red Flags 🚩

**Immediate dealbreakers:**

- ✅ **Can email you your password** (they store it in plain text)
- ✅ **Password recovery shows your old password** (not reset, reveals original)
- ✅ **Maximum password length under 20 characters** (indicates old systems)
- ✅ **No special characters allowed** (terrible security practices)
- ✅ **Password hints displayed during login** (why would they need hints?)

**Concerning signs:**

- No mention of security practices
- Never had a breach (probably haven't been caught)
- Vague answers to security questions
- No bug bounty program
- Slow to patch known vulnerabilities

### Green Flags ✅

**Signs of proper password handling:**

- Offers multi-factor authentication
- Uses password managers' paste functionality
- Allows long passwords (100+ characters)
- Supports special characters throughout
- Clear privacy policy about data handling
- Regular security audits mentioned
- Bug bounty program active
- Transparent about past breaches and fixes

### Questions to Ask

Before trusting a company with important accounts:

1. "Do you store passwords in plain text?" (should be no)
2. "What hashing algorithm do you use?" (bcrypt, scrypt, Argon2)
3. "Do you salt passwords?" (must be yes, uniquely per user)
4. "Have you had breaches? How did you respond?" (transparency matters)
5. "Do you support MFA?" (shows security commitment)

## Protecting Yourself Despite Corporate Negligence

### Assume Breaches Will Happen

Operate under these assumptions:

- Every company will eventually be breached
- Some store passwords poorly
- Your password WILL appear in breach databases
- Plan accordingly

### Practical Defense Strategies

**1. Unique Passwords Everywhere**
- Never reuse passwords across sites
- One breach doesn't become many
- Password manager essential

**2. Multi-Factor Authentication**
- Even if password is compromised, account stays safe
- Prefer authenticator apps or hardware keys
- Avoid SMS when possible

**3. Monitor for Breaches**
- Use Have I Been Pwned regularly
- Set up breach notifications
- Act immediately when notified

**4. Limit Damage Potential**
- Don't use primary email for low-security sites
- Use alias emails for shopping, forums
- Separate financial accounts from casual browsing

**5. Vote With Your Accounts**
- Delete accounts at companies with poor security
- Choose competitors with better practices
- Let companies know why you're leaving

## The Regulatory Landscape

### Current Requirements

**GDPR (Europe):**
- Requires "appropriate technical measures"
- Fines up to 4% of global revenue
- Implicitly requires proper password storage

**CCPA (California):**
- Requires "reasonable security procedures"
- Private right of action for breaches
- Influencing other state laws

**Industry Standards:**
- PCI-DSS for payment processors
- HIPAA for healthcare
- SOX for financial reporting
- Each has password/storage requirements

### Proposed Changes

Legislation increasingly targeting password storage:

- Mandatory breach notification timelines
- Specific technical requirement lists
- Personal liability for executives
- Higher fines for repeat offenders

## The Future of Password Storage

### Emerging Technologies

**Zero-Knowledge Architecture:**
- Server never sees password at all
- All verification happens client-side
- Breach reveals nothing useful

**Passwordless Authentication:**
- Biometrics, hardware keys, magic links
- Eliminates password storage problem entirely
- Gradual industry adoption

**Homomorphic Encryption:**
- Compute on encrypted data
- Verify passwords without decrypting
- Still experimental but promising

### Industry Trends

Moving toward:

- Default MFA enforcement
- Breach simulation testing
- Third-party security audits
- Public security scorecards
- Insurance requirements driving improvements

## Conclusion: Trust But Verify

Companies hold your passwords in trust. Some honor that responsibility with state-of-the-art security. Others treat it as an afterthought, storing your secrets in digital equivalent of unlocked filing cabinets.

**Remember:**

- Proper password storage is solvable technology (bcrypt, salts, stretching)
- Poor storage is negligence, not inevitability
- You can identify risky companies before trusting them
- Your defense (unique passwords + MFA) works even when they fail
- Regulatory pressure is slowly improving practices

The next time you create an account, ask yourself: "Do I trust this company with my password?" If you can't answer confidently, consider whether that account is worth creating—or at least ensure you're using a password you don't use anywhere else.

Your passwords are only as secure as the weakest company storing them. Choose wisely, defend aggressively, and never assume good intentions equal good security.

---

*In cybersecurity, trust is earned through transparency and proven through practice. Demand both.*
