import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Head from 'next/head';
import Article from './Article';
import TopArticle from './TopArticle';
import styles from '../styles/Home.module.css';

function Home() {
  const bookmarks = useSelector((state) => state.bookmarks.value);

  const [articlesData, setArticlesData] = useState([]);
  const [topArticle, setTopArticle] = useState({});
  const [categories, setCategories] = useState([]);
  const [countries, setCountries] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('top');
  const [selectedCountry, setSelectedCountry] = useState('unitedstates');


  useEffect(() => {
    fetchArticles(selectedCountry, selectedCategory);
  }, [selectedCategory, selectedCountry]);


  const fetchArticles = (country, category) => {
    let url = `https://morning-news-backend-five.vercel.app/${country}/${category}`;
    fetch(url)
      .then(response => response.json())
      .then(data => {
        setTopArticle(data.articles[0]);
        setArticlesData(data.articles.filter((data, i) => i > 0));
        const uniqueCategories = [...new Set(data.articles.map(article => article.category))];
        setCategories(uniqueCategories);
        const uniqueCountries = [...new Set(data.articles.map(article => article.country))];
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
        <title>Morning News - Home</title>
      </Head>

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




      {topArticles}
      <div className={styles.articlesContainer}>
        {articles}
      </div>
    </div >
  );
}

export default Home;
