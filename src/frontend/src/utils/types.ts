export interface Tag {
    id: number,
    shortId: number,
    registered: boolean,
    metadata?: string
}

export interface Metadata {
    name: string,
    description: string,
    image: string,
    attributes: {
        trait_type: string,
        value: string
    }[],
    author: string,
    signature: string
}

export interface TagExpanded {
    id: number,
    shortId: number,
    registered: boolean,
    metadata?: Metadata
}
