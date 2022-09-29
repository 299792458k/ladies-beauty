import React from "react";
import ReactLoading from "react-loading";
import { Section, Title, Article, list } from "./generic";

const Processing = () => (
    <Section >
        <Title>React Loading</Title>
        <Article key={list[0].prop}>
            <ReactLoading type={list[0].prop} color="var(--primary-color)" />
        </Article>
    </Section>
);

export default Processing;
