from urllib.parse import urlparse
import re

def check_url(url: str) -> dict:
    reasons = []

    parsed = urlparse(url)

    # 1. Check for HTTPS
    if parsed.scheme != "https":
        reasons.append("URL does not use HTTPS")

    # 2. Check if the domain is a raw IP address
    if re.match(r"^\d+\.\d+\.\d+\.\d+$", parsed.netloc):
        reasons.append("Domain is a raw IP address, not a normal website name")

    # 3. Check for suspicious domain endings
    suspicious_tlds = [".xyz", ".top", ".tk", ".click", ".loan"]
    if any(parsed.netloc.endswith(tld) for tld in suspicious_tlds):
        reasons.append("Domain uses a suspicious ending")

    # 4. Check for unusually long domains
    if len(parsed.netloc) > 40:
        reasons.append("Domain name is unusually long")

    is_suspicious = len(reasons) > 0

    return {
        "url": url,
        "suspicious": is_suspicious,
        "reasons": reasons
    }


