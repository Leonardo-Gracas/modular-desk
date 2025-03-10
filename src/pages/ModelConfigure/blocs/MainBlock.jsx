import { cloneDeep } from "lodash";
import React, { useState } from "react";
import TextExample from "../examples/TextExample";
import NumberExample from "../examples/NumberExample";

const MainBlock = ({ _fields }) => {
    return (
        <div className="mb-5 card-custom bg-beige p-4 rounded-3 border-brown">
            <h2 className="mb-4 text-brown border-bottom border-brown pb-2">📜 Bloco Principal</h2>
            <div className="row g-4">
                {_fields.map((field, index) => {
                    if (field.type === "text") {
                        return (
                            <div className="col-md-6" key={index}>
                                <div className="field-custom bg-light-brown-transparent p-3 rounded">
                                    <TextExample obj={field} index={index} />
                                </div>
                            </div>
                        );
                    }

                    if (field.type === "number") {
                        return (
                            <div className="col-md-6" key={index}>
                                <div className="field-custom bg-light-brown-transparent p-3 rounded">
                                    <NumberExample obj={field} index={index} />
                                </div>
                            </div>
                        );
                    }

                    return <p className="text-brown">Tipo de campo não suportado</p>;
                })}
            </div>
        </div>
    );
};

export default MainBlock;