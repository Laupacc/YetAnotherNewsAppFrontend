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
    if (selectedCountry && selectedCategory) {
      url += `${selectedCountry}/${selectedCategory}`;
    }
    if (selectedCountry && !selectedCategory) {
      url += `${selectedCountry}/general`;
    }
    if (!selectedCountry && !selectedCategory) {
      url += `unitedstates/general`;
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

  const handleCountryClick = (country) => {
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


      <div>
        {countries.map((country, index) => (
          <button key={index} onClick={() => handleCountryClick(country)}>{country.toUpperCase()}</button>
        ))}
      </div>
      {selectedCountry && (
        <div>
          {categories.map((category, index) => (
            <button key={index} onClick={() => handleCategoryChange(category)}>{category.toUpperCase()}</button>
          ))}
        </div>
      )}

      {topArticles}
      <div className={styles.articlesContainer}>
        {articles}
      </div>
    </div>
  );
}

export default Home;
