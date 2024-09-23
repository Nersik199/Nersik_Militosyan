const logoutBtn = document.querySelector('.logout');
const navBar = document.querySelector('.navbar');
const usersProfile = async () => {
	const token = localStorage.getItem('token');
	// logoutBtn.addEventListener('click', logout);
	if (!token) {
		alert('No token found. Please login first.');
		location.href = '/users/login';
		return;
	}

	try {
		const response = await axios.get('/users/user/profile', {
			headers: {
				authorization: token,
			},
		});

		const user = response.data.user;
		const profileData = document.querySelector('#profile-data');
		if (user.avatar === null) {
			user.avatar = 'https://cdn-icons-png.flaticon.com/512/149/149071.png';
		}

		const [path] = user.avatar;
		// console.log(user);

		if (user) {
			navBar.innerHTML = `
							<div class="profile-img-container"><img src="/images/2024-09-09T18:23:45.725Z-002o68hrzso.jpg" alt="Profile picture"></div>
							<div class="profile-container">
								<img class="profile-img" src="${path.path}" alt="Profile picture">
							<div class="profile-info">
								<h2>${user.firstName} ${user.lastName}</h2>
								<p>${user.email}</p>
							</div>
							</div>
							
        `;
		} else {
			profileData.innerHTML = '<p class="error">Profile data not found.</p>';
		}
	} catch (error) {
		console.error(error);
		profileData.innerHTML =
			'<p class="error">Failed to load profile. Please try again later.</p>';
	}
};

const logout = () => {
	localStorage.removeItem('token');
	location.href = '/users/login';
};
usersProfile();
