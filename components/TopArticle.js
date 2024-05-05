import { useDispatch, useSelector } from 'react-redux';
import { addBookmark, removeBookmark } from '../reducers/bookmarks';
import styles from '../styles/TopArticle.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookmark } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';


function TopArticle(props) {

	const dispatch = useDispatch();
	const user = useSelector((state) => state.user.value);

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

	return (
		<>
			<div className={styles.topContainer}>
				<a href={props.link} target='blank'>
					<img src={props.image_url} className={styles.image} alt={props.title} />
				</a>
				<div className={styles.topText}>
					<div className={styles.articleHeader}>
						<a href={props.link} className={styles.topTitle} target='blank'>
							<h2>{props.title}</h2>
						</a>
						<FontAwesomeIcon onClick={() => handleBookmarkClick()} icon={faBookmark} style={iconStyle} className={styles.bookmarkIcon} />
					</div>
					<p>{props.description}</p>
					<h4 style={{ textAlign: "right" }}>{props.creator}</h4>
				</div>
			</div>
		</>
	);
}

export default TopArticle;