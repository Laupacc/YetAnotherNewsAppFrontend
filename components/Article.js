import { useDispatch, useSelector } from 'react-redux';
import { addBookmark, removeBookmark } from '../reducers/bookmarks';
import { hideArticle, unhideArticle } from '../reducers/hiddenArticles';
import Image from 'next/image';
import styles from '../styles/Article.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookmark, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';

function Article(props) {
	const dispatch = useDispatch();
	const user = useSelector((state) => state.user.value);

	// Bookmarks
	const handleBookmarkClick = () => {
		if (!user.token) {
			return;
		}

		fetch(`https://morning-news-backend-five.vercel.app/users/canBookmark/${user.token}`)
			.then(response => response.json())
			.then(data => {
				if (data.result && data.canBookmark) {
					if (props.isBookmarked) {
						dispatch(removeBookmark(props));
					} else {
						dispatch(addBookmark(props));
					}
				}
			});
	}

	let iconStyle = {};
	if (props.isBookmarked) {
		iconStyle = { 'color': '#E9BE59' };
	}


	return (<>
		<div className={styles.articles}>
			<div className={styles.articleHeader}>
				<a href={props.url} className={styles.title} target='blank'>
					<h3>{props.title}</h3>
				</a>
				<FontAwesomeIcon onClick={() => handleBookmarkClick()} icon={faBookmark} style={iconStyle} className={styles.bookmarkIcon} />
			</div>
			<a href={props.url} target='blank'>
				<img src={props.urlToImage} alt={props.title} className={styles.image} />
			</a>
			<div className={styles.articleDescription}>
				<p>{props.description}</p>
				<h4 style={{ textAlign: "right" }}>{props.author} - {props.source.name}</h4>
			</div>
		</div>
	</>
	);
}

export default Article;