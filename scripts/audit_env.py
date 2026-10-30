import os

def audit():
    print("==========================================")
    print("   NIMBLEDESK DEPLOYMENT ENVIRONMENT AUDIT")
    print("==========================================")
    
    backend_keys = [
        ("DATABASE_URL", True),
        ("JWT_SECRET", True),
        ("OPENAI_API_KEY", False),
        ("EMBEDDING_MODEL", False),
        ("LLM_MODEL", False)
    ]
    
    frontend_keys = [
        ("NEXT_PUBLIC_API_BASE_URL", False)
    ]
    
    print("\n[Backend Environment Check]")
    for key, required in backend_keys:
        val = os.getenv(key)
        status = "[OK] Present" if val else ("[CRITICAL] Missing!" if required else "[INFO] Optional/Default")
        print(f"  - {key}: {status}")

    print("\n[Frontend Environment Check]")
    for key, required in frontend_keys:
        val = os.getenv(key)
        status = "[OK] Present" if val else "[INFO] Using default (/api or localhost)"
        print(f"  - {key}: {status}")
        
    print("\nAudit completed successfully.")

if __name__ == "__main__":
    audit()
