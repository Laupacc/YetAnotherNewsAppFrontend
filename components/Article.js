import { useDispatch, useSelector } from 'react-redux';
import { addBookmark, removeBookmark } from '../reducers/bookmarks';
import styles from '../styles/Article.module.css';
import { BiSolidBookmarkAltPlus, BiSolidBookmarkAltMinus } from "react-icons/bi";

function Article(props) {
	const dispatch = useDispatch();
	const user = useSelector((state) => state.user.value);

	// Bookmarks
	const handleBookmarkClick = () => {
		if (!user.token) {
			return;
		}

		fetch(`https://yet-another-news-app-backend.vercel.app/users/canBookmark/${user.token}`)
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
	let bookmarkIcon = <BiSolidBookmarkAltPlus style={iconStyle} className={styles.bookmarkIcon} size={30} />;
	if (props.isBookmarked) {
		iconStyle = { 'color': '#E9BE59' };
		bookmarkIcon = <BiSolidBookmarkAltMinus style={iconStyle} className={styles.bookmarkIcon} size={30} />;
	}


	return (<>
		<div className={styles.articles}>
			<a href={props.link} target='blank'>
				<img src={props.image_url} alt={props.title} className={styles.image} />
			</a>
			<div className={styles.text}>
				<div className={styles.articleHeader}>
					<a href={props.link} className={styles.title} target='blank'>
						<h3>{props.title}</h3>
					</a>
					<div onClick={() => handleBookmarkClick()}>
						{user.token && bookmarkIcon}
					</div>
				</div>
				<div className={styles.articleDescription}>
					<p>{props.description && props.description.length > 205 ? `${props.description.slice(0, 250)}...` : props.description}</p>
				</div>
				<div className={styles.footer}>
					<h4 className={styles.sourceID}>{props.source_id} - {props.pubDate}</h4>
				</div>
			</div>
		</div>
	</>
	);
}

export default Article;