import React from "react";

import "./index.css";
import data from "meta.json";
import { Card } from "@/components/css";

export const Cards: React.FC = () => {
    return (
        <div className="cards">
            {(data?.plugins ?? []).map((plugin: {name: string, description: string}) => (
                <div 
                    key={`key-${plugin.name}`} 
                    className="cardWrapper"
                    <%_ if (testing === 'testing-library') { _%>   
                    data-testid="container"
                    <%_ } _%>
                >
                    <Card title={plugin.name}>{plugin.description}</Card>
                </div>
            ))}
        </div>
    );
};
