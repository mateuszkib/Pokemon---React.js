import React, { useEffect, useState } from "react";
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

    const [people, setPeople] = useState(null);
    let alphabet = generateAlphabet();

    useEffect(() => {
        let data;
        axios
            .get(
                "https://cors-anywhere.herokuapp.com/https://swapi.dev/api/people"
            )
            .then((res) => {
                data = res.data.results;
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
                data = data.concat(...results);
                data.sort((a, b) =>
                    a.name < b.name ? -1 : a.name > b.name ? 1 : 0
                );
                setPeople(data);
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
                    <React.Fragment>
                        {alphabet.map((el, index) => (
                            <>
                                <TableRow key={index}>
                                    <TableCell key={index} colSpan="6">
                                        {el}
                                    </TableCell>
                                </TableRow>
                                {people &&
                                    people.map((item, index) =>
                                        item.name.charAt(0) === el ? (
                                            <TableRow key={index}>
                                                <TableCell>
                                                    {item.name}
                                                </TableCell>
                                                <TableCell>
                                                    {item.eye_color}
                                                </TableCell>
                                                <TableCell>
                                                    {item.gender}
                                                </TableCell>
                                                <TableCell>
                                                    {item.hair_color}
                                                </TableCell>
                                                <TableCell>
                                                    {item.height}
                                                </TableCell>
                                                <TableCell>
                                                    {item.mass}
                                                </TableCell>
                                            </TableRow>
                                        ) : null
                                    )}
                            </>
                        ))}
                    </React.Fragment>
                </TableBody>
            </Table>
        </div>
    );
}

export default App;
