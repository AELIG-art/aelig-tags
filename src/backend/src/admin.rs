use candid::Principal;
use ic_cdk::api::is_controller;

#[ic_cdk::query]
fn is_admin(user: Principal) -> bool {
    is_controller(&user)
}