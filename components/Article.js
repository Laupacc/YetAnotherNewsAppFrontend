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

	// Hidden articles

	// const handleEyeClick = () => {
	// 	dispatch(hideArticle(props));
	// }


	return (<>
		<div className={styles.articles}>
			<div className={styles.articleHeader}>
				<Link href={props.url}>
					<a className={styles.title} target='blank'>
						<h3>{props.title}</h3>
					</a>
				</Link>
				<FontAwesomeIcon onClick={() => handleBookmarkClick()} icon={faBookmark} style={iconStyle} className={styles.bookmarkIcon} />
			</div>
			<h4 style={{ textAlign: "right" }}>- {props.source.name} / {props.author}</h4>
			<Link href={props.url}>
				<a target='blank'>
					<Image src={props.urlToImage} alt={props.title} width={600} height={314} />
				</a>
			</Link>
			<p>{props.description}</p>
			<div className={styles.divider}></div>
		</div>
	</>
	);
}

export default Article;