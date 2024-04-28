import React from "react";

const TopBar = (props: {
    isLogged:boolean
    principal?: string
}) => {
    const { isLogged, principal } = props;

    return <div>
        <h1 className="mt-5">Manage tags</h1>
        {
            isLogged ? <span className={"mt-3"}><b>Your principal:</b> {principal}</span> : null
        }
    </div>;
}

export default TopBar;
