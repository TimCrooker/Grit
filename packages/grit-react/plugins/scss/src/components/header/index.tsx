import React from "react";
import "./index.scss";

import { Logo } from "@/components";

export const Header: React.FC = () => {
    return (
        <div className="header" <% if (testing === 'testing-library') { %> data-testid="container" <% } %> >
            <Logo />
        </div>
    );
};
