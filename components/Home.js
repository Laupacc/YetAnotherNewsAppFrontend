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
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);

  useEffect(() => {
    fetchArticles();
  }, [selectedCategory, selectedCountry]);

  const fetchArticles = () => {
    let url = 'https://morning-news-backend-five.vercel.app/';
    if (selectedCategory) {
      url += `category/${selectedCategory}`;
    }
    if (selectedCountry) {
      url += `country/${selectedCountry}`;
    }
    if (selectedCountry && selectedCategory) {
      url += `country/${selectedCountry}/category/${selectedCategory}`;
    }
    if (!selectedCategory && !selectedCountry) {
      url += 'general';
    }

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
      <button onClick={() => handleCategoryChange("business")}>Business</button>
      <button onClick={() => handleCategoryChange("entertainment")}>Entertainment</button>
      <button onClick={() => handleCategoryChange("general")}>General</button>
      <button onClick={() => handleCategoryChange("health")}>Health</button>
      <button onClick={() => handleCategoryChange("science")}>Science</button>
      <button onClick={() => handleCategoryChange("sports")}>Sports</button>
      <button onClick={() => handleCategoryChange("technology")}>Technology</button>
      {topArticles}
      <div className={styles.articlesContainer}>
        {articles}
      </div>
    </div>
  );
}

export default Home;
