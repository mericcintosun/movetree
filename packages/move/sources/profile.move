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
    tags: vector<String>, // user interests/categories for networking
    profile_views: u64, // total profile view count
    link_clicks: vector<u64>, // click count for each link (same index as links)
}

/// Event: bir profil için belirli indexte link görüntülendi.
public struct LinkViewed has copy, drop {
    profile_id: address,
    index: u64,
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
        tags: vector::empty(),
        profile_views: 0, // NEW: initialize view count
        link_clicks: vector::empty(), // NEW: initialize click counts
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
    
    // Sync link_clicks vector size with links
    let new_len = vector::length(&urls);
    let old_len = vector::length(&profile.link_clicks);
    
    // If adding new links, initialize their click counts to 0
    if (new_len > old_len) {
        let mut i = old_len;
        while (i < new_len) {
            vector::push_back(&mut profile.link_clicks, 0);
            i = i + 1;
        };
    } else if (new_len < old_len) {
        // If removing links, trim the click counts
        while (vector::length(&profile.link_clicks) > new_len) {
            vector::pop_back(&mut profile.link_clicks);
        };
    };
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
    
    // Sync link_clicks vector size with links
    let new_len = vector::length(&urls);
    let old_len = vector::length(&profile.link_clicks);
    
    if (new_len > old_len) {
        let mut i = old_len;
        while (i < new_len) {
            vector::push_back(&mut profile.link_clicks, 0);
            i = i + 1;
        };
    } else if (new_len < old_len) {
        while (vector::length(&profile.link_clicks) > new_len) {
            vector::pop_back(&mut profile.link_clicks);
        };
    };
}

/// Herkes çağırabilir: link tıklandığında event basar ve sayacı artırır
public entry fun view_link(profile: &mut LinkTreeProfile, index: u64, _ctx: &mut TxContext) {
    let profile_id = object::uid_to_address(&profile.id);
    
    // Increment click count for this link
    if (index < vector::length(&profile.link_clicks)) {
        let clicks = vector::borrow_mut(&mut profile.link_clicks, index);
        *clicks = *clicks + 1;
    };
    
    // Emit event
    let ev = LinkViewed { profile_id, index };
    event::emit(ev);
}

/// Profil görüntülendiğinde çağrılır (herkes çağırabilir)
public entry fun increment_profile_view(profile: &mut LinkTreeProfile, _ctx: &mut TxContext) {
    profile.profile_views = profile.profile_views + 1;
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

/// Get profile view count (read-only)
public fun get_profile_views(profile: &LinkTreeProfile): u64 {
    profile.profile_views
}

/// Get link click counts (read-only)
public fun get_link_clicks(profile: &LinkTreeProfile): vector<u64> {
    profile.link_clicks
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
        tags: _,
        profile_views: _, // NEW
        link_clicks: _, // NEW
    } = profile;
    object::delete(id);
}
