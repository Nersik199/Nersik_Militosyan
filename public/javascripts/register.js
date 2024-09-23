const form = document.querySelector('#registration-form');
const successMessage = document.querySelector('#success-message');

form.addEventListener('submit', async event => {
	event.preventDefault();

	const formData = new FormData(form);

	document.querySelectorAll('.error').forEach(span => {
		span.textContent = '';
	});
	successMessage.textContent = '';

	try {
		const response = await axios.post('/users/registration', formData, {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		});

		const info = response.data.message;

		if (info) {
			successMessage.textContent = info;
			setTimeout(() => {
				location.href = '/users/login';
			}, 2000);
		} else {
			console.log('No message in response.');
		}
	} catch (error) {
		if (error.response && error.response.status === 409) {
			setTimeout(() => {
				const spanElement = document.createElement('p');
				spanElement.style.textAlign = 'center';
				spanElement.innerText = error.response.data.message;
				form.append(spanElement);
			}, 3000);
		}
		const fields = error.response.data.fields;
		if (fields) {
			Object.keys(fields).forEach(key => {
				const messages = fields[key];
				const errorSpan = document.querySelector(`#${key}-error`);
				if (errorSpan) {
					errorSpan.textContent = messages;
				}
			});
		} else {
			console.error('Error without response:', error.message);
		}
	}
});
