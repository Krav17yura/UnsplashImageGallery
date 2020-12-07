import React, {useEffect, useState} from 'react'
import InfiniteScroll from "react-infinite-scroll-component";
import './App.css';

const accessKey = process.env.REACT_APP_UNSPLASH_ACCESS_KEY;


function App() {
    const [images, setImages] = useState([])
    const [page, setPage] = useState(1)
    const [inputValue, setInputValue] = useState('')


    const getPhotos = () => {
        let apiUrl = `https://api.unsplash.com/photos?`;
        if (inputValue) apiUrl = `https://api.unsplash.com/search/photos?query=${inputValue}`;
        apiUrl += `&page=${page}`;
        apiUrl += `&client_id=${accessKey}`;

        fetch(apiUrl)
            .then(res => res.json())
            .catch(e => console.log(e))
            .then((data) => {
                const imagesFromApi = data.results ?? data;

                if (page === 1) {
                    setImages(imagesFromApi);
                    return;
                }

                setImages((images) => [...images, ...imagesFromApi]);
            });
    }

    useEffect(() => {
        getPhotos()
    }, [page])

    const searchPhoto = (e) => {
        e.preventDefault();
         setPage(1);
         getPhotos()
    }

    if (!accessKey) {
        return (
            <a href='https://api.unsplash.com' className='error'> Required: Get Unsplash API Key First</a>
        )
    }

    return (
        <div className="app">
            <h1>Unsplash Image Gallery!</h1>
            <form onSubmit={searchPhoto}>
                <input type="text" placeholder="Search Unsplash..." value={inputValue}
                       onChange={e => setInputValue(e.target.value)} />
                <button>Search</button>
            </form>

            <InfiniteScroll
                next={() => {
                    setPage(page => page + 1)
                    getPhotos()
                }}
                hasMore={true}
                loader={<h4>Loading...</h4>}
                dataLength={images.length}>
                <div className="image-grid">
                    {images.map((image, index) => (
                        <a
                            className="image"
                            key={index}
                            href={image.links.html}
                            target='_blank'
                            rel='noopener noreferrer'
                        >
                            <img src={image.urls.regular} alt={image.alt_description}/>
                        </a>
                    ))}
                </div>
            </InfiniteScroll>
        </div>
    );
}

export default App;
