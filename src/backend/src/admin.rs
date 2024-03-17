use std::cell::RefCell;
use candid::Principal;
use ic_cdk::api;

thread_local! {
    static ADMIN: RefCell<Principal> = RefCell::new(
        Principal::anonymous()
    );
}

#[ic_cdk::init]
fn init() {
    ADMIN.with(|admin| {
        let caller = api::caller();
        *admin.borrow_mut() = caller;
    });
}

pub fn get_admin() -> Principal {
    ADMIN.with(|admin| admin.borrow().clone())
}