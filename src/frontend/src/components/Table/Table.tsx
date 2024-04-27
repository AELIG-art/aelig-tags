import React, {ReactNode} from "react";
import { Table as BsTable } from "react-bootstrap";
import "./styles.Table.css";

const Table = (props: {
    headers: string[],
    children: ReactNode
}) => {
    const {headers, children} = props;

    return <BsTable className={"mt-4"}>
        <thead>
        <tr>
            {
                headers.map((header, index) => <th
                    className="header"
                    key={index}
                >
                    {header}
                </th>)
            }
        </tr>
        </thead>
        <tbody>
        {
            children
        }
        </tbody>
    </BsTable>;
}

export default Table;