import { PlotRecord, UserProfile } from './types.ts';

type OtpEntry = { code: string; expiresAt: number };

class InMemoryStore {
  private phoneToOtp: Map<string, OtpEntry> = new Map();
  private userProfiles: Map<string, UserProfile> = new Map();
  private userPlots: Map<string, PlotRecord[]> = new Map();
  private phoneToUserId: Map<string, string> = new Map();

  setOtp(phone: string, code: string, ttlMs: number) {
    this.phoneToOtp.set(phone, { code, expiresAt: Date.now() + ttlMs });
  }

  verifyOtp(phone: string, code: string): boolean {
    const entry = this.phoneToOtp.get(phone);
    if (!entry) return false;
    const ok = entry.code === code && Date.now() < entry.expiresAt;
    if (ok) this.phoneToOtp.delete(phone);
    return ok;
  }

  getOrCreateUserIdByPhone(phone: string): string {
    let id = this.phoneToUserId.get(phone);
    if (!id) {
      id = `u_${Math.random().toString(36).slice(2, 10)}`;
      this.phoneToUserId.set(phone, id);
      const profile: UserProfile = {
        userId: id,
        phone,
        createdAt: new Date().toISOString(),
      };
      this.userProfiles.set(id, profile);
    }
    return id;
  }

  upsertProfile(profile: UserProfile) {
    this.userProfiles.set(profile.userId, profile);
  }

  getProfile(userId: string): UserProfile | undefined {
    return this.userProfiles.get(userId);
  }

  addPlot(record: PlotRecord) {
    const list = this.userPlots.get(record.userId) ?? [];
    list.push(record);
    this.userPlots.set(record.userId, list);
  }

  getPlots(userId: string): PlotRecord[] {
    return this.userPlots.get(userId) ?? [];
  }
}

export const store = new InMemoryStore();