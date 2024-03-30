import { TagExpanded } from "./types";
import {GetCertificateResult, Tag} from "../declarations/backend/backend.did";
import {backend} from "../declarations/backend";

export const expandTag = async (tag: Tag) => {
    const certificate: GetCertificateResult = await backend.get_certificate(tag.id.toString(16));

    if ('Ok' in certificate) {
        return {
            ...tag,
            metadata: certificate.Ok.metadata[0],
            registered: certificate.Ok.registered
        };
    } else {
        return tag as TagExpanded;
    }
}
