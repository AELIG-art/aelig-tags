use std::cell::RefCell;
use std::collections::HashMap;
use crate::types::{Certificate, Error};

thread_local! {
    static CERTIFICATES: RefCell<HashMap<String, Certificate>> = RefCell::new(
        HashMap::new()
    );
}

#[ic_cdk::query]
pub fn get_certificate(tag_id: String) -> Result<Certificate, Error> {
    CERTIFICATES.with(|map| {
        match map.borrow().get(&tag_id) {
            Some(certificate) => {
                return if certificate.registered {
                    Ok(certificate.clone())
                } else {
                    Err(Error::CertificateNotFound {
                        msg: format!("Certificate with id {} does not exist", tag_id)
                    })
                }
            },
            None => Err(Error::CertificateNotFound {
                msg: format!("Certificate with id {} does not exist", tag_id)
            })
        }
    })
}