use crate::ic_siwe_provider::get_caller_address;
use crate::tags::get_tag;

pub async fn is_authenticated(tag_id: String) -> bool {
    let caller_siwe_address_res = get_caller_address().await;
    match caller_siwe_address_res {
        Ok(address) => {
            match get_tag(tag_id) {
                Ok(tag) => {
                    tag.owner == address
                },
                Err(_) => false
            }
        }
        Err(_) => false
    }
}