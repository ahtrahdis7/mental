import React, { useState, useCallback } from 'react'
import { Box, TextField } from '@material-ui/core';
import debounce from 'lodash.debounce';

function Home(){
    const [query, setQuery] = useState("calm");
    // const [dbValue, saveToDb] = useState('');
    const [pics, setPics] = useState("https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?ixid=MnwyNDUwMzh8MHwxfHNlYXJjaHwzfHxjYWxtfGVufDB8fHx8MTYyNTY3ODQ5MA&ixlib=rb-1.2.1");
    var number = 1;
    const debouncedSave = useCallback(
		debounce(nextValue => fetchQuery(nextValue, number), 2000),
		[], // will be created only once initially
	);

    const handleChange = (event) => {
        const { value: nextValue } = event.target;
        setQuery(nextValue);
        // Even though handleChange is created on each render and executed
		// it references the same debouncedSave that was created initially
		debouncedSave(nextValue);
        fetchQuery(query, number);
        
    };

    const fetchQuery = function(query, page = 1){
        number++;
        number = number % 100;
        fetch(`https://api.unsplash.com/search/photos?page=${page}&per_page=1&query=${query}&client_id=dI5dfzVEG3qziDy_Acn1ui9QT77i2tCWAoPgoldB0-Y`)
        .then(response => {
            if (response.ok) {
                return response;
            } else {
                var error = new Error('Error ' + response.status + ': ' + response.statusText);
                error.response = response;
                throw error;
            }
        },error => {
            var errmess = new Error(error.message);
            throw errmess;
        })
        .then(res => res.json())
        .then(res => {
            if(res.results.length > 0) setPics(res.results[0].urls.raw)
        })
    }
    fetchQuery(query, number);

    return (
        <div>
            <div style={div_style}>
                <TextField 
                onChange={handleChange} 
                style={text_style} 
                value={query} id="outlined-basic" 
                variant="outlined" margin="dense"/>
            </div>
            <img src={pics} style={{
                width: '100%',
                height: '100%',
            }}/>
        </div>
    )
}

const text_style = {
    opacity: 0.8,
    width: '25ch',
    height: '1cm',
    backgroundColor: 'white',
    opacity: 0.5,
    borderRadius: 5
}

const div_style = {
    position: 'absolute',
    margin: 20,
    padding: 20,
    borderRadius: 20,
    x: '50%',
    y: '50%',
    // width: 250,
    // height: 100,
    // backgroundColor: '#fafafa',
    opacity: 0.5,
}

export default Home;