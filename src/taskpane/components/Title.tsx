import * as React from "react";

export interface Title {
    message: string;
}

export default class General extends React.Component<Title> {
    render() {
        const { children, message } = this.props;

        return (
            <main className="ms-welcome__main">
                <h2 className="ms-font-xl ms-fontWeight-semilight ms-fontColor-neutralPrimary ms-u-slideUpIn20">{message}</h2>
                {children}
            </main>
        );
    }
}
