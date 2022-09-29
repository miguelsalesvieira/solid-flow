/* @refresh reload */
import { For, render } from "solid-js/web";
import { Router, Routes, Route } from "@solidjs/router";
import { Component } from "solid-js";
import styles from "./styles.module.css";

import Simple from "./Simple";
import Actions from "./Actions";
import Increment from "./Increment";
import Timer from "./Timer";

const routes: { label: string; path: string; component: Component }[] = [
    { label: "Simple", path: "simple", component: Simple },
    { label: "Actions", path: "actions", component: Actions },
    { label: "Increment", path: "increment", component: Increment },
    { label: "Timer", path: "timer", component: Timer },
];

interface HeaderProps {
    routes: { label: string; path: string }[];
}

const HeaderBar: Component<HeaderProps> = (props: HeaderProps) => {
    return (
        <nav class={styles.main}>
            <For each={props.routes}>
                {(route: { label: string; path: string }) => {
                    return (
                        <a class={styles.route} href={`/${route.path}`}>
                            {route.label}
                        </a>
                    );
                }}
            </For>
        </nav>
    );
};

render(
    () => (
        <Router>
            <HeaderBar routes={routes} />
            <Routes>
                <For each={routes}>
                    {(item: { label: string; path: string; component: Component }) => {
                        return <Route path={item.path} component={item.component} />;
                    }}
                </For>
            </Routes>
        </Router>
    ),
    document.getElementById("root") as HTMLElement
);
