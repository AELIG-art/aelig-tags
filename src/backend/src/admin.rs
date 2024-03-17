use std::cell::RefCell;
use candid::Principal;
use ic_cdk::api;

thread_local! {
    static ADMIN: RefCell<Principal> = RefCell::new(
        Principal::anonymous()
    );
}

#[ic_cdk::init]
fn init_admin() {
    set_admin_to_caller();
}

#[ic_cdk::post_upgrade]
fn set_admin() {
    set_admin_to_caller();
}

fn set_admin_to_caller() {
    ADMIN.with(|admin| {
        let caller = api::caller();
        *admin.borrow_mut() = caller;
    });
}

#[ic_cdk::query]
pub fn get_admin() -> Principal {
    ADMIN.with(|admin| admin.borrow().clone())
}