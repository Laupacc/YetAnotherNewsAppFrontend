import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login, logout } from '../reducers/user';
import { removeAllBookmark } from '../reducers/bookmarks';
import styles from '../styles/Header.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faXmark } from '@fortawesome/free-solid-svg-icons';
import Moment from 'react-moment';
import { Modal } from 'antd';
import Link from 'next/link';
import { BiSolidBookmarkAlt } from "react-icons/bi";
import { HiOutlineLogout } from "react-icons/hi";
import { RiArticleLine } from "react-icons/ri";
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';



function Header() {
	const dispatch = useDispatch();
	const user = useSelector((state) => state.user.value);

	const [date, setDate] = useState('2050-11-22T23:59:59');
	const [isModalVisible, setIsModalVisible] = useState(false); ``
	const [signUpUsername, setSignUpUsername] = useState('');
	const [signUpPassword, setSignUpPassword] = useState('');
	const [signInUsername, setSignInUsername] = useState('');
	const [signInPassword, setSignInPassword] = useState('');
	const [anchorEl, setAnchorEl] = useState(null);


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
					setIsModalVisible(false)
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
					setIsModalVisible(false)
				}
			});
	};

	const handleLogout = () => {
		dispatch(logout());
		dispatch(removeAllBookmark());
	};

	const showModal = () => {
		setIsModalVisible(!isModalVisible);
	};

	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const open = Boolean(anchorEl);
	const id = open ? 'simple-popover' : undefined;


	let modalContent;
	if (!user.isConnected) {
		modalContent = (
			<div className={styles.registerContainer}>
				<div className={styles.registerSection}>
					<p>Sign-up</p>
					<input type="text" placeholder="Username" id="signUpUsername" onChange={(e) => setSignUpUsername(e.target.value)} value={signUpUsername} />
					<input type="password" placeholder="Password" id="signUpPassword" onChange={(e) => setSignUpPassword(e.target.value)} value={signUpPassword} />
					<button className={styles.loginBtn} id="register" onClick={() => handleRegister()}>Register</button>
				</div>
				<div className={styles.registerSection}>
					<p>Sign-in</p>
					<input type="text" placeholder="Username" id="signInUsername" onChange={(e) => setSignInUsername(e.target.value)} value={signInUsername} />
					<input type="password" placeholder="Password" id="signInPassword" onChange={(e) => setSignInPassword(e.target.value)} value={signInPassword} />
					<button className={styles.loginBtn} id="connection" onClick={() => handleConnection()}>Connect</button>
				</div>
			</div>
		);
	}

	let userSection;
	if (user.token) {
		userSection = (
			<div className={styles.logoutSection}>
				<div className={styles.welcome}>Welcome back, {user.username.charAt(0).toUpperCase() + user.username.slice(1).toLowerCase()}</div>
				<div>
					<HiOutlineLogout size={30} className={styles.logoutIcon} onClick={handleClick} />
					<Popover
						id={id}
						open={open}
						anchorEl={anchorEl}
						onClose={handleClose}
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
		if (isModalVisible) {
			userSection =
				<div className={styles.headerIcons}>
					<FontAwesomeIcon onClick={showModal} className={styles.userSection} icon={faXmark} />
				</div>
		} else {
			userSection =
				<div className={styles.headerIcons}>
					<FontAwesomeIcon onClick={showModal} className={styles.userSection} icon={faUser} />
				</div>
		}
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

			{isModalVisible && <div id="react-modals">
				<Modal getContainer="#react-modals" className={styles.modal} visible={isModalVisible} closable={false} footer={null}>
					{modalContent}
				</Modal>
			</div>}
		</header >
	);
}

export default Header;