import React from "react";

const MetadataInfo = (props: {
    name: string|undefined,
    description: string|undefined
}) => {
    const {name, description} = props;

    return <div>
        <h4>Name</h4>
        <p>{name}</p>
        <h4>Description</h4>
        <p>{description}</p>
    </div>;
}

export default MetadataInfo;