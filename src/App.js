import React, { useEffect } from "react";
import "./App.css";
import {
    Table,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
} from "@material-ui/core";
import axios from "axios";

function App() {
    function generateAlphabet() {
        return [...Array(26)].map((_, y) => String.fromCharCode(y + 65));
    }

    let alphabet = generateAlphabet();

    useEffect(() => {
        let people;
        axios
            .get(
                "https://cors-anywhere.herokuapp.com/https://swapi.dev/api/people"
            )
            .then((res) => {
                people = res.data.results;
                let count = res.data.count;
                let promises = [];
                let pages = Math.ceil(count / 10);

                for (let i = 2; i <= pages; i++) {
                    promises.push(
                        axios.get(
                            `https://cors-anywhere.herokuapp.com/https://swapi.dev/api/people?page=${i}`
                        )
                    );
                }

                return Promise.all(promises);
            })
            .then((response) => {
                let results = response.map((el) => el.data.results);
                people = people.concat(...results);
                console.log(people);
            })
            .catch((err) => {
                console.log(err);
            });
    });

    return (
        <div className="App">
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Eyes color</TableCell>
                        <TableCell>Gender</TableCell>
                        <TableCell>Hair Color</TableCell>
                        <TableCell>Height</TableCell>
                        <TableCell>Mass</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {alphabet.map((el, index) => (
                        <TableRow key={index}>
                            <TableCell colSpan="6">{el}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}

export default App;
