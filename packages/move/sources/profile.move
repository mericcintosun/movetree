module linktree::profile;

use std::bcs;
use std::hash;
use std::option::Option;
use std::string::String;
use std::vector;
use sui::event;
use sui::object::{Self, UID};
use sui::transfer;
use sui::tx_context::{Self, TxContext};

const E_HASH_MISMATCH: u64 = 1;

public struct LinkItem has copy, drop, store {
    label: String,
    url: String,
    icon: Option<String>,
}

public struct LinkTreeProfile has key {
    id: UID,
    owner: address,
    name: String,
    avatar_cid: String,
    bio: String,
    theme: String,
    links: vector<String>,
    links_hash: vector<u8>,
    tags: vector<String>, // NEW: user interests/categories for networking
}

/// Event: bir profil için belirli indexte link görüntülendi.
public struct LinkViewed has copy, drop {
    profile_id: address,
    index: u64,
    viewer: address,
}

/// Event: profil oluşturuldu (indexer için)
public struct ProfileCreated has copy, drop {
    profile_id: address,
    owner: address,
    name: String,
    tags: vector<String>,
}

/// Event: profil tag'leri güncellendi (indexer için)
public struct TagsUpdated has copy, drop {
    profile_id: address,
    tags: vector<String>,
}

public entry fun create_profile(
    name: String,
    avatar_cid: String,
    bio: String,
    theme: String,
    ctx: &mut TxContext,
) {
    let profile = LinkTreeProfile {
        id: object::new(ctx),
        owner: tx_context::sender(ctx),
        name,
        avatar_cid,
        bio,
        theme,
        links: vector::empty(),
        links_hash: vector::empty(),
        tags: vector::empty(), // NEW
    };
    
    // Emit event for indexer
    let profile_id = object::uid_to_address(&profile.id);
    event::emit(ProfileCreated {
        profile_id,
        owner: tx_context::sender(ctx),
        name,
        tags: vector::empty(),
    });
    
    transfer::transfer(profile, tx_context::sender(ctx));
}

public fun upsert_links(profile: &mut LinkTreeProfile, urls: vector<String>) {
    profile.links = urls;
}

/// Sahip tarafında: links + hash güncelle (hash doğrulanır).
public entry fun upsert_links_verified(
    profile: &mut LinkTreeProfile,
    urls: vector<String>,
    hash_arg: vector<u8>,
) {
    let bytes = bcs::to_bytes(&urls);
    let computed = hash::sha3_256(bytes);
    assert!(eq_bytes(&computed, &hash_arg), E_HASH_MISMATCH);

    profile.links = urls;
    profile.links_hash = computed;
}

/// Herkes çağırabilir: sadece event basar (profil okunmasına gerek yok).
public entry fun view_link(profile_id: address, index: u64, ctx: &mut TxContext) {
    let viewer = tx_context::sender(ctx);
    let ev = LinkViewed { profile_id, index, viewer };
    event::emit(ev);
}

fun eq_bytes(a: &vector<u8>, b: &vector<u8>): bool {
    let la = vector::length(a);
    let lb = vector::length(b);
    if (la != lb) { return false };
    let mut i = 0;
    while (i < la) {
        if (*vector::borrow(a, i) != *vector::borrow(b, i)) { return false };
        i = i + 1;
    };
    true
}

public fun set_theme(profile: &mut LinkTreeProfile, theme: String) {
    profile.theme = theme;
}

/// Update user's interest tags for networking
public entry fun update_tags(profile: &mut LinkTreeProfile, tags: vector<String>) {
    profile.tags = tags;
    
    // Emit event for indexer to track tag updates
    event::emit(TagsUpdated {
        profile_id: object::uid_to_address(&profile.id),
        tags,
    });
}

/// Get profile tags (read-only)
public fun get_tags(profile: &LinkTreeProfile): vector<String> {
    profile.tags
}

public entry fun delete_profile(profile: LinkTreeProfile) {
    let LinkTreeProfile {
        id,
        owner: _,
        name: _,
        avatar_cid: _,
        bio: _,
        theme: _,
        links: _,
        links_hash: _,
        tags: _, // NEW
    } = profile;
    object::delete(id);
}
