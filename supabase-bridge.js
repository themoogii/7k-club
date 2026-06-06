(function () {
  const config = window.SEVENK_SUPABASE_CONFIG || {};
  const hasConfig = Boolean(config.url && config.publishableKey);
  const hasLibrary = Boolean(window.supabase?.createClient);
  const client = hasConfig && hasLibrary
    ? window.supabase.createClient(config.url, config.publishableKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
        },
      })
    : null;

  const provider = client ? "supabase" : "local";

  function configured() {
    return Boolean(client);
  }

  function redirectUrl(hash = "profile") {
    const base = config.redirectTo || `${window.location.origin}${window.location.pathname}`;
    return `${base}#${hash}`;
  }

  function dataUrlToBlob(dataUrl) {
    const [meta, value] = String(dataUrl || "").split(",");
    if (!meta || !value) return null;
    const mime = meta.match(/data:(.*?);/)?.[1] || "image/jpeg";
    const bytes = atob(value);
    const array = new Uint8Array(bytes.length);
    for (let index = 0; index < bytes.length; index += 1) {
      array[index] = bytes.charCodeAt(index);
    }
    return new Blob([array], { type: mime });
  }

  async function getSessionUser() {
    if (!client) return null;
    const { data, error } = await client.auth.getUser();
    if (error) throw error;
    return data.user || null;
  }

  function profileFromUser(user) {
    if (!user) return null;
    return {
      id: user.id,
      method: user.app_metadata?.provider || "Supabase",
      name: user.user_metadata?.display_name || user.user_metadata?.name || user.email || user.phone || "7K Runner",
      email: user.email || "",
      phone: user.phone || "",
      avatarData: user.user_metadata?.avatar_url || "",
    };
  }

  async function uploadAvatar(userId, avatarData) {
    if (!client || !avatarData?.startsWith("data:")) return avatarData || "";
    const blob = dataUrlToBlob(avatarData);
    if (!blob) return "";
    const path = `${userId}/avatar-${Date.now()}.jpg`;
    const { error } = await client.storage.from("profile-avatars").upload(path, blob, {
      cacheControl: "3600",
      upsert: true,
      contentType: blob.type || "image/jpeg",
    });
    if (error) throw error;
    const { data } = client.storage.from("profile-avatars").getPublicUrl(path);
    return data.publicUrl;
  }

  async function ensureProfile(profile = {}) {
    if (!client) return { provider };
    const user = await getSessionUser();
    if (!user) return { provider, signedIn: false };
    const avatarUrl = await uploadAvatar(user.id, profile.avatarData || profile.avatar_url || "");
    const payload = {
      id: user.id,
      display_name: profile.displayName || profile.name || user.user_metadata?.display_name || user.user_metadata?.name || user.email || user.phone || "7K Runner",
      email: user.email || profile.email || null,
      phone: user.phone || profile.phone || null,
      avatar_url: avatarUrl || profile.avatar_url || null,
      avatar_crop: profile.avatarCrop || profile.avatar_crop || {},
      updated_at: new Date().toISOString(),
    };
    const { data, error } = await client.from("profiles").upsert(payload, { onConflict: "id" }).select().single();
    if (error) throw error;
    return { provider, profile: data, user: profileFromUser(user) };
  }

  async function saveEventRsvp(row) {
    if (!client) return { provider };
    const user = await getSessionUser();
    if (!user) return { provider, signedIn: false };
    await ensureProfile({
      displayName: row.displayName,
      avatarData: row.avatarData,
      avatarCrop: row.avatarCrop,
    });
    const payload = {
      event_id: row.eventId,
      user_id: user.id,
      status: row.status,
      registered: Boolean(row.registered),
      display_name: row.displayName || user.email || user.phone || "7K Runner",
      emergency_contact: row.emergencyContact || null,
      pace_group: row.paceGroup || null,
      notes: row.notes || null,
      form_answers: {
        initials: row.initials || "",
        avatar_url: row.avatarData?.startsWith("http") ? row.avatarData : "",
        avatar_crop: row.avatarCrop || {},
      },
      updated_at: new Date().toISOString(),
    };
    const { data, error } = await client.from("event_rsvps").upsert(payload, { onConflict: "event_id,user_id" }).select().single();
    if (error) throw error;
    return { provider, rsvp: data };
  }

  async function saveRaceFolder(folder) {
    if (!client) return { provider };
    const user = await getSessionUser();
    if (!user) return { provider, signedIn: false };
    const slug = String(folder.slug || folder.title || "race-folder")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    const payload = {
      slug,
      title: folder.title || slug,
      description: folder.description || null,
      created_by: user.id,
      updated_at: new Date().toISOString(),
    };
    const { data, error } = await client.from("race_photo_folders").upsert(payload, { onConflict: "slug" }).select().single();
    if (error) throw error;
    return { provider, folder: data };
  }

  async function uploadRacePhoto(file, folder, meta = {}) {
    if (!client) return { provider };
    const user = await getSessionUser();
    if (!user) return { provider, signedIn: false };
    const folderResult = await saveRaceFolder(folder);
    const safeName = `${Date.now()}-${file.name}`.toLowerCase().replace(/[^a-z0-9.]+/g, "-");
    const path = `${folderResult.folder.slug}/${safeName}`;
    const { error: uploadError } = await client.storage.from("race-photos").upload(path, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type || "image/jpeg",
    });
    if (uploadError) throw uploadError;
    const { data: urlData } = client.storage.from("race-photos").getPublicUrl(path);
    const payload = {
      folder_id: folderResult.folder.id,
      uploaded_by: user.id,
      title: meta.title || file.name.replace(/\.[^/.]+$/, ""),
      bib: meta.bib || null,
      zone: meta.zone || null,
      file_path: path,
      original_url: urlData.publicUrl,
      preview_url: urlData.publicUrl,
      metadata: meta,
    };
    const { data, error } = await client.from("race_photos").insert(payload).select().single();
    if (error) throw error;
    return { provider, photo: data };
  }

  async function saveKarmaEntry(entry) {
    if (!client) return { provider };
    const user = await getSessionUser();
    if (!user) return { provider, signedIn: false };
    const payload = {
      challenge_id: entry.challengeId,
      user_id: user.id,
      amount_mnt: Number(entry.amountMnt || entry.amount_mnt || 0),
      status: entry.status || "locked",
      goal_status: entry.goalStatus || "pending",
      proof: entry.proof || {},
      updated_at: new Date().toISOString(),
    };
    const { data, error } = await client.from("karma_ledger_entries").upsert(payload, { onConflict: "challenge_id,user_id" }).select().single();
    if (error) throw error;
    return { provider, entry: data };
  }

  async function saveKarmaChallenge(challenge) {
    if (!client) return { provider };
    const user = await getSessionUser();
    if (!user) return { provider, signedIn: false };
    const slug = String(challenge.slug || challenge.title || "karma-challenge")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    const payload = {
      slug,
      title: challenge.title || "Karma Challenge",
      goal: challenge.goal || "Running goal",
      commitment_amount_mnt: Number(challenge.commitmentAmountMnt || challenge.commitment_amount_mnt || 0),
      status: challenge.status || "published",
      rules: challenge.rules || {},
      created_by: user.id,
      updated_at: new Date().toISOString(),
    };
    const { data, error } = await client.from("karma_challenges").upsert(payload, { onConflict: "slug" }).select().single();
    if (error) throw error;
    return { provider, challenge: data };
  }

  window.SevenKSupabase = {
    provider,
    configured,
    client,
    getSessionUser,
    ensureProfile,
    saveProfile: ensureProfile,
    saveEventRsvp,
    saveRaceFolder,
    uploadRacePhoto,
    saveKarmaEntry,
    saveKarmaChallenge,
  };

  window.SevenKAuth = {
    provider,
    configured,
    async currentUser() {
      if (!client) return null;
      return profileFromUser(await getSessionUser());
    },
    async signInWithGoogle() {
      if (!client) return { provider };
      const { data, error } = await client.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: redirectUrl("profile") },
      });
      if (error) throw error;
      return { provider, data };
    },
    async signInWithApple() {
      if (!client) return { provider };
      const { data, error } = await client.auth.signInWithOAuth({
        provider: "apple",
        options: { redirectTo: redirectUrl("profile") },
      });
      if (error) throw error;
      return { provider, data };
    },
    async signInWithEmail(email, name) {
      if (!client) return { provider };
      const { data, error } = await client.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: redirectUrl("profile"),
          data: { display_name: name || "7K Runner" },
        },
      });
      if (error) throw error;
      return { provider, data };
    },
    async sendSmsCode(phone) {
      if (!client) return { provider: "prototype", code: "123456" };
      const { data, error } = await client.auth.signInWithOtp({ phone });
      if (error) throw error;
      return { provider, data };
    },
    async verifySmsCode(phone, token) {
      if (!client) return token === "123456";
      const { data, error } = await client.auth.verifyOtp({ phone, token, type: "sms" });
      if (error) throw error;
      await ensureProfile({ displayName: data.user?.phone || "Phone Runner" });
      return true;
    },
    async signOut() {
      if (!client) return { provider };
      const { error } = await client.auth.signOut();
      if (error) throw error;
      return { provider };
    },
  };
})();
