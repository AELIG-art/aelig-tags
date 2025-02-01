use crate::ic_siwe_provider::get_caller_address;
use crate::tags::_get_tag;
use candid::Principal;
use ic_cdk::api::is_controller;

pub async fn is_authenticated(tag_id: String) -> bool {
    let caller_siwe_address_res = get_caller_address().await;
    match caller_siwe_address_res {
        Ok(address) => match _get_tag(tag_id) {
            Ok(tag) => tag.owner == address,
            Err(_) => false,
        },
        Err(_) => false,
    }
}

#[ic_cdk::query]
fn is_admin(user: Principal) -> bool {
    is_controller(&user)
}
