import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Head from 'next/head';
import Article from './Article';
import TopArticle from './TopArticle';
import styles from '../styles/Home.module.css';
import { FcSearch } from "react-icons/fc";


function Home() {
  const bookmarks = useSelector((state) => state.bookmarks.value);

  const [articlesData, setArticlesData] = useState([]);
  const [topArticle, setTopArticle] = useState({});
  const [categories, setCategories] = useState([]);
  const [countries, setCountries] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('top');
  const [selectedCountry, setSelectedCountry] = useState('unitedstates');

  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetch(`https://morning-news-backend-five.vercel.app/search?q=${searchTerm}`)
      .then(response => response.json())
      .then(data => {
        setSearchResults(data.articles);
      })
      .catch(error => {
        console.error("Error searching:", error);
      });
  };

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };


  useEffect(() => {
    fetchArticles(selectedCountry, selectedCategory);
  }, [selectedCategory, selectedCountry]);


  const fetchArticles = (country, category) => {
    let url = `https://morning-news-backend-five.vercel.app/${country}/${category}`;
    fetch(url)
      .then(response => response.json())
      .then(data => {
        const uniqueArticles = [];
        const uniqueTitles = new Set();


        data.articles.forEach(article => {
          if (!uniqueTitles.has(article.title)) {
            uniqueArticles.push(article);
            uniqueTitles.add(article.title);
          }
        });

        // Set state with unique articles
        setTopArticle(uniqueArticles[0]);
        setArticlesData(uniqueArticles.slice(1)); // Skip the first article, which is set as the top article
        const uniqueCategories = [...new Set(uniqueArticles.map(article => article.category))];
        setCategories(uniqueCategories);
        const uniqueCountries = [...new Set(uniqueArticles.map(article => article.country))];
        setCountries(uniqueCountries);
      });
  };


  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const handleCountryChange = (country) => {
    setSelectedCountry(country);
  };


  const articles = articlesData.map((data, i) => {
    const isBookmarked = bookmarks.some(bookmark => bookmark.title === data.title);
    return <Article key={i} {...data} isBookmarked={isBookmarked} />;
  });

  const topArticles = (
    <TopArticle {...topArticle} isBookmarked={bookmarks.some(bookmark => bookmark.title === topArticle.title)} />
  );

  return (
    <div>
      <Head>
        <title>Yet another news app / Home</title>
      </Head>

      <form className={styles.form} onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleChange}
          className={styles.searchInput}
        />
        <button type="submit" className={styles.searchBtn}><FcSearch size={24} /></button>
      </form>

      <div className={styles.countries}>
        <button className={`${styles.buttonCountry} ${selectedCountry === 'unitedstates' && styles.selectedCountry}`} onClick={() => handleCountryChange('unitedstates')}>United States</button>
        <button className={`${styles.buttonCountry} ${selectedCountry === 'canada' && styles.selectedCountry}`} onClick={() => handleCountryChange('canada')}>Canada</button>
        <button className={`${styles.buttonCountry} ${selectedCountry === 'unitedkingdom' && styles.selectedCountry}`} onClick={() => handleCountryChange('unitedkingdom')}>United Kingdom</button>
        <button className={`${styles.buttonCountry} ${selectedCountry === 'france' && styles.selectedCountry}`} onClick={() => handleCountryChange('france')}>France</button>
      </div>


      <div className={styles.categories}>
        <button className={`${styles.button} ${selectedCategory === 'top' && styles.selected}`} onClick={() => handleCategoryChange('top')}>Top</button>
        <button className={`${styles.button} ${selectedCategory === 'business' && styles.selected}`} onClick={() => handleCategoryChange('business')}>Business</button>
        <button className={`${styles.button} ${selectedCategory === 'entertainment' && styles.selected}`} onClick={() => handleCategoryChange('entertainment')}>Entertainment</button>
        <button className={`${styles.button} ${selectedCategory === 'health' && styles.selected}`} onClick={() => handleCategoryChange('health')}>Health</button>
        <button className={`${styles.button} ${selectedCategory === 'science' && styles.selected}`} onClick={() => handleCategoryChange('science')}>Science</button>
        <button className={`${styles.button} ${selectedCategory === 'sports' && styles.selected}`} onClick={() => handleCategoryChange('sports')}>Sports</button>
        <button className={`${styles.button} ${selectedCategory === 'technology' && styles.selected}`} onClick={() => handleCategoryChange('technology')}>Technology</button>
      </div>

      {
        searchResults.length > 0 ? (
          <div className={styles.articlesContainer}>
            {searchResults.map((data, i) => {
              const isBookmarked = bookmarks.some(bookmark => bookmark.title === data.title);
              return <Article key={i} {...data} isBookmarked={isBookmarked} />;
            })}
          </div>
        ) : (
          <>
            {topArticles}
            <div className={styles.articlesContainer}>
              {articles}
            </div>
          </>
        )
      }

    </div >
  );
}

export default Home;
