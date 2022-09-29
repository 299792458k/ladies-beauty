import React from "react";
import ReactLoading from "react-loading";
import { Section, Title, Article, list } from "./generic";

const Loading = () => (
    <Section >
        <Title>React Loading</Title>
        <Article key={list[6].prop}>
            <ReactLoading type={list[6].prop} color="var(--primary-color)" />
        </Article>
    </Section>
);

export default Loading;
