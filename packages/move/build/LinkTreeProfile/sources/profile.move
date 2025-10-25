module linktree::profile {

use std::option::Option;
use std::string::String;
use std::vector;
use sui::object::{Self, UID};
use sui::transfer;
use sui::tx_context::{Self, TxContext};

struct LinkItem has copy, drop, store {
    label: String,
    url: String,
    icon: Option<String>,
}

struct LinkTreeProfile has key {
    id: UID,
    owner: address,
    name: String,
    avatar_cid: String,
    bio: String,
    theme: String,
    links: vector<String>,
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
    };
    transfer::transfer(profile, tx_context::sender(ctx));
}

public fun upsert_links(profile: &mut LinkTreeProfile, urls: vector<String>) {
    profile.links = urls;
}

public fun set_theme(profile: &mut LinkTreeProfile, theme: String) {
    profile.theme = theme;
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
    } = profile;
    object::delete(id);
}
}
