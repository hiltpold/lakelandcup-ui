import { FunctionalComponent, h } from "preact";
import { Route, Router } from "preact-router";
import { useContext, useEffect, useState } from "preact/hooks";
import style from "./style.module.css";

const Fantasy: FunctionalComponent = () => {
    useEffect(() => {
        console.log("<Fantasy>");
    }, []);

    return (
        <div className={`container`}>
            <div className="columns">
                <div
                    className={`column col-4 col-mx-auto col-xs-12 col-sm-12 col-md-6 col-lg-4 col-xl-4 ${style.fantasy}`}
                >
                    <ul class="tab tab-block" style={"margin-bottom:0.0rem"}>
                        <li class="tab-item">
                            <a className="text-tiny" href="/fantasy/prospects">
                                Prospects
                            </a>
                        </li>
                        <li class="tab-item">
                            <a className="text-tiny" href="/fantasy/franchises">
                                Franchises
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};
export default Fantasy;
