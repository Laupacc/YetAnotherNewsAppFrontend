import { useSelector } from 'react-redux';
import Head from 'next/head';
import styles from '../styles/Bookmarks.module.css';
import Article from './Article';
import { PiArrowFatLinesUpDuotone } from "react-icons/pi";

function Bookmarks() {
	const user = useSelector((state) => state.user.value);
	const bookmarks = useSelector((state) => state.bookmarks.value);

	if (!user.token) {
		return (
			<div className={styles.container}>
				<h1 className={styles.title}>Please sign in to see your bookmarks</h1>
			</div>
		);
	}

	let articles = <h1 className={styles.title}>You haven't bookmarked any article yet</h1>;
	if (bookmarks.length > 0) {
		articles = bookmarks.map((data, i) => {
			return <Article key={i} {...data} isBookmarked />;
		});
	}

	const scrollToTop = () => {
		window.scrollTo({
			top: 0,
			behavior: "smooth"
		});
	};

	return (
		<div>
			<Head>
				<title>Yet Another News App / Bookmarks</title>
			</Head>
			<div className={styles.container}>
				{/* <h2 className={styles.title}>Bookmarks</h2> */}
				<div className={styles.articlesContainer}>
					{articles}
				</div>
			</div>
			<PiArrowFatLinesUpDuotone onClick={scrollToTop} className={styles.backToTopBtn} size={40} color='brown' />
		</div>

	);
}

export default Bookmarks;
