// Shared OTP store for development
// In production, replace this with Redis or database storage

export interface OTPData {
  code: string;
  expiresAt: number;
  attempts: number;
}

class OTPStore {
  private store = new Map<string, OTPData>();

  set(mobile: string, data: OTPData): void {
    this.store.set(mobile, data);
  }

  get(mobile: string): OTPData | undefined {
    return this.store.get(mobile);
  }

  delete(mobile: string): boolean {
    return this.store.delete(mobile);
  }

  entries() {
    return this.store.entries();
  }

  // Cleanup expired OTPs
  cleanup(): void {
    const now = Date.now();
    for (const [mobile, data] of this.store.entries()) {
      if (data.expiresAt < now) {
        this.store.delete(mobile);
      }
    }
  }
}

// Singleton instance
export const otpStore = new OTPStore();

// Cleanup expired OTPs periodically
if (typeof window === "undefined") {
  // Only run on server side
  setInterval(() => {
    otpStore.cleanup();
  }, 60 * 1000); // Run every minute
}
