import React from "react";
import { Container } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import Navbar from "./components/Navbar";
import CharactersList from "./components/CharactersList";

function App() {
    const useStyles = makeStyles({
        container: {
            height: "100vh",
        },
    });

    const classes = useStyles();

    return (
        <div className="App">
            <Container className={classes.container}>
                <Navbar />
                <CharactersList />
            </Container>
        </div>
    );
}

export default App;
