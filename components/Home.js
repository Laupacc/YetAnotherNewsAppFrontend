import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Head from 'next/head';
import Article from './Article';
import TopArticle from './TopArticle';
import styles from '../styles/Home.module.css';
import ArticleCanada from './ArticlesCanada';

function Home() {
  const bookmarks = useSelector((state) => state.bookmarks.value);
  // const hiddenArticles = useSelector((state) => state.hiddenArticles.value);

  const [articlesData, setArticlesData] = useState([]);
  const [topArticle, setTopArticle] = useState({});
  const [articlesCanadaData, setArticlesCanadaData] = useState([]);
  const [topArticleCanada, setTopArticleCanada] = useState({});


  useEffect(() => {
    fetch('https://morning-news-backend-five.vercel.app/articles')
      .then(response => response.json())
      .then(data => {
        setTopArticle(data.articles[0]);
        setArticlesData(data.articles.filter((data, i) => i > 0));
      });
  }, []);

  const articles = articlesData.map((data, i) => {
    const isBookmarked = bookmarks.some(bookmark => bookmark.title === data.title);
    return <Article key={i} {...data} isBookmarked={isBookmarked} />;
  });


  let topArticles;
  if (bookmarks.some(bookmark => bookmark.title === topArticle.title)) {
    topArticles = <TopArticle {...topArticle} isBookmarked={true} />
  } else {
    topArticles = <TopArticle {...topArticle} isBookmarked={false} />
  }


  useEffect(() => {
    fetch('https://morning-news-backend-five.vercel.app/canada')
      .then(response => response.json())
      .then(data => {
        // setTopArticleCanada(data.articles[0]);
        setArticlesData(data.articles.filter((data, i) => i > 0));
      });
  }
    , []);

  const articlesCanada = articlesCanadaData.map((data, i) => {
    const isBookmarked = bookmarks.some(bookmark => bookmark.title === data.title);
    return <ArticleCanada key={i} {...data} isBookmarked={isBookmarked} />;
  });



  return (
    <div>
      <Head>
        <title>Morning News - Home</title>
      </Head>
      {topArticles}
      <div className={styles.articlesContainer}>
        {articles}
        {articlesCanada}
      </div>
    </div>
  );
}

export default Home;