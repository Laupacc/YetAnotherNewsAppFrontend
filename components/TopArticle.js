import { useDispatch, useSelector } from 'react-redux';
import { addBookmark, removeBookmark } from '../reducers/bookmarks';
import styles from '../styles/TopArticle.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookmark } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import { BiSolidBookmarkAltPlus, BiSolidBookmarkAltMinus } from "react-icons/bi";


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
	let bookmarkIcon = <BiSolidBookmarkAltPlus style={iconStyle} className={styles.bookmarkIcon} size={30} />;
	if (props.isBookmarked) {
		iconStyle = { 'color': '#E9BE59' };
		bookmarkIcon = <BiSolidBookmarkAltMinus style={iconStyle} className={styles.bookmarkIcon} size={30} />;
	}


	return (
		<>
			<div className={styles.topContainer}>
				<div className={styles.articles}>
					<a href={props.link} target='blank'>
						<img src={props.image_url} className={styles.image} alt={props.title} />
					</a>
					<div className={styles.text}>
						<div className={styles.articleHeader}>
							<a href={props.link} className={styles.title} target='blank'>
								<h2>{props.title}</h2>
							</a>
							<div onClick={() => handleBookmarkClick()}>
								{bookmarkIcon}
							</div>
						</div>
						<div className={styles.articleDescription}>
							<p>{props.description && props.description.length > 205 ? `${props.description.slice(0, 250)}...` : props.description}</p>
						</div>
						<div className={styles.footer}>
							<h4>{props.source_id.charAt(0).toUpperCase() + props.source_id.slice(1).toLowerCase() || ''} - {props.pubDate}</h4>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

export default TopArticle;