import React from "react";
import "./styles.Tag.css";

const MetadataInfo = (props: {
    name: string|undefined,
    description: string|undefined
}) => {
    const {name, description} = props;

    return <div>
        <h4>Name</h4>
        <p>{name}</p>
        <h4>Description</h4>
        <p className="description">{description}</p>
    </div>;
}

export default MetadataInfo;