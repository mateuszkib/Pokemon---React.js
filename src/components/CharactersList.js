import React, { useEffect, useState } from "react";
import {
    Table,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
    CircularProgress,
    Box,
} from "@material-ui/core";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import axios from "axios";

const CharactersList = (props) => {
    const [people, setPeople] = useState(null);
    const [loading, setLoading] = useState(true);
    let alphabet = generateAlphabet();

    function generateAlphabet() {
        return [...Array(26)].map((_, y) => String.fromCharCode(y + 65));
    }

    const StyledTableHead = withStyles(() => ({
        root: {
            background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
        },
    }))(TableHead);

    const StyledTableCell = withStyles((theme) => ({
        root: {
            backgroundColor: "#F0F0F0",
        },
        body: {
            backgroundColor: "#A9A9A9",
            color: theme.palette.common.white,
            fontSize: "20px",
        },
        head: {
            color: "white",
        },
    }))(TableCell);

    const StyledTableRow = withStyles(() => ({
        root: {
            backgroundColor: "#F0F0F0",
        },
    }))(TableRow);

    const useStyles = makeStyles({
        table: {
            marginTop: "100px",
        },
    });

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
                let pagesLeft = Math.ceil(count / 10);

                for (let i = 2; i <= pagesLeft; i++) {
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
                setLoading(false);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    const classes = useStyles();
    return (
        <>
            {loading ? (
                <Box
                    height="100%"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                >
                    <CircularProgress color="secondary" size="5rem" />
                </Box>
            ) : (
                <Table className={classes.table}>
                    <StyledTableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Eyes color</TableCell>
                            <TableCell>Gender</TableCell>
                            <TableCell>Hair Color</TableCell>
                            <TableCell>Height</TableCell>
                            <TableCell>Mass</TableCell>
                        </TableRow>
                    </StyledTableHead>
                    <TableBody>
                        <React.Fragment>
                            {alphabet.map((el, index) => (
                                <>
                                    <TableRow key={index}>
                                        <StyledTableCell
                                            key={index}
                                            colSpan="6"
                                        >
                                            {el}
                                        </StyledTableCell>
                                    </TableRow>
                                    {people &&
                                        people.map((item, index) =>
                                            item.name.charAt(0) === el ? (
                                                <StyledTableRow key={index}>
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
                                                </StyledTableRow>
                                            ) : null
                                        )}
                                </>
                            ))}
                        </React.Fragment>
                    </TableBody>
                </Table>
            )}
        </>
    );
};

export default CharactersList;
