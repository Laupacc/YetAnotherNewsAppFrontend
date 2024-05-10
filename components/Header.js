import styles from '../styles/Header.module.css';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login, logout } from '../reducers/user';
import { removeAllBookmark, updateBookmark } from '../reducers/bookmarks';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FaUserAstronaut } from "react-icons/fa6";
import Moment from 'react-moment';
import Link from 'next/link';
import { BiSolidBookmarkAlt } from "react-icons/bi";
import { HiOutlineLogout } from "react-icons/hi";
import { RiArticleLine } from "react-icons/ri";
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';


function Header() {
	const dispatch = useDispatch();
	const user = useSelector((state) => state.user.value);
	const bookmarks = useSelector((state) => state.bookmarks.value);

	const [date, setDate] = useState('2050-11-22T23:59:59');
	const [signUpUsername, setSignUpUsername] = useState('');
	const [signUpPassword, setSignUpPassword] = useState('');
	const [signInUsername, setSignInUsername] = useState('');
	const [signInPassword, setSignInPassword] = useState('');
	const [anchorEl, setAnchorEl] = useState(null);
	const [openModal, setOpenModal] = useState(false);


	useEffect(() => {
		setDate(new Date());
	}, []);

	const handleRegister = () => {
		fetch('https://morning-news-backend-five.vercel.app/users/signup', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ username: signUpUsername, password: signUpPassword }),
		}).then(response => response.json())
			.then(data => {
				if (data.result) {
					dispatch(login({ username: signUpUsername, token: data.token }));
					setSignUpUsername('');
					setSignUpPassword('');
					setOpenModal(false)
				}
			});
	};

	const handleConnection = () => {
		fetch('https://morning-news-backend-five.vercel.app/users/signin', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ username: signInUsername, password: signInPassword }),
		}).then(response => response.json())
			.then(data => {
				if (data.result) {
					dispatch(login({ username: signInUsername, token: data.token }));
					setSignInUsername('');
					setSignInPassword('');
					setOpenModal(false);
					dispatch(updateBookmark(data.bookmarks));
				}
			});
	};

	const handleOpenModal = () => setOpenModal(true);

	const handleCloseModal = () => setOpenModal(false);

	const handlePopOpen = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handlePopClose = () => {
		setAnchorEl(null);
	};

	const handleLogout = () => {
		dispatch(logout());
		dispatch(removeAllBookmark());
		setAnchorEl(null);
	};

	const open = Boolean(anchorEl);
	const id = open ? 'simple-popover' : undefined;


	let modalContent;
	if (!user.isConnected) {
		modalContent = (
			<div className={styles.registerContainer}>
				<div className={styles.registerSection}>
					<p className={styles.sign}>Sign-up</p>
					<input className={styles.inputSign} type="text" placeholder="Username" id="signUpUsername" onChange={(e) => setSignUpUsername(e.target.value)} value={signUpUsername} />
					<input className={styles.inputSign} type="password" placeholder="Password" id="signUpPassword" onChange={(e) => setSignUpPassword(e.target.value)} value={signUpPassword} />
					<button className={styles.loginBtn} id="register" onClick={() => handleRegister()}>Register</button>
				</div>
				<div className={styles.registerSection}>
					<p className={styles.sign}>Sign-in</p>
					<input className={styles.inputSign} type="text" placeholder="Username" id="signInUsername" onChange={(e) => setSignInUsername(e.target.value)} value={signInUsername} />
					<input className={styles.inputSign} type="password" placeholder="Password" id="signInPassword" onChange={(e) => setSignInPassword(e.target.value)} value={signInPassword} />
					<button className={styles.loginBtn} id="connection" onClick={() => handleConnection()}>Connect</button>
				</div>
			</div>
		);
	}

	let userSection;
	if (user.token) {
		userSection = (
			<div className={styles.logoutSection}>
				<div className={styles.welcome}>Welcome back, {user.username}</div>
				<div>
					<HiOutlineLogout size={30} className={styles.logoutIcon} onClick={handlePopOpen} />
					<Popover
						id={id}
						open={open}
						anchorEl={anchorEl}
						onClose={handlePopClose}
						anchorOrigin={{
							vertical: 'bottom',
							horizontal: 'left',
						}}
					>
						<Typography sx={{ p: 3 }}>Are you sure you want to logout?</Typography>
						<div style={{ display: 'flex', justifyContent: 'center' }}>
							<button className={styles.popBtn} onClick={() => handleLogout()}>Yep, I'm sure</button>
						</div>
					</Popover>
				</div>

			</div>
		);
	} else {
		userSection = (
			<div>
				<FaUserAstronaut onClick={handleOpenModal} className={styles.iconUser} size={30} />
			</div>
		);
	}

	return (
		<header className={styles.header}>
			<div className={styles.title}>Yet Another News App</div>
			<div className={styles.logoContainer}>
				<Moment className={styles.date} date={date} format="MMM Do YYYY" />
				{userSection}
			</div>

			<div className={styles.linkContainer}>
				<div className={styles.linkIcons}>
					<Link href="/"><span>Articles</span></Link>
					<Link href="/"><RiArticleLine size={30} /></Link>
				</div>
				<div className={styles.linkIcons}>
					<Link href="/bookmarks"><span>Bookmarks</span></Link>
					<Link href="/bookmarks"><BiSolidBookmarkAlt size={30} /></Link>
				</div>
			</div>

			{openModal &&
				<div>
					<Modal
						open={openModal}
						onClose={handleCloseModal}
						aria-labelledby="Sign-up / Sign-in"
						aria-describedby="Sign-up / Sign-in"
					>
						<Box className={styles.modal}>
							<FontAwesomeIcon onClick={handleCloseModal} className={styles.iconX} icon={faXmark} />
							{modalContent}
						</Box>
					</Modal>
				</div>}
		</header >
	);
}

export default Header;