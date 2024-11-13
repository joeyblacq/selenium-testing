const CONTACT_FORM_URL = "http://99.79.77.144:3000/api/contact";
const CONTACT_FORM = document.getElementById('contact-form');
const CONTACT_FIELDS = ['fullname', 'email', 'phone', 'company_name', 'project_name', 'project_desc', 'department', 'message']
	.map(field => document.querySelector(`[name="${field}"]`));

CONTACT_FIELDS.forEach(field => {
	field.addEventListener('input', () => field.classList.remove('is-invalid'));
});

CONTACT_FORM.addEventListener("submit", async (e) => {
	e.preventDefault();

	const DATA = Object.fromEntries(CONTACT_FIELDS.map(field => [field.name, field.value]));

	try {
		const RESPONSE = await fetch(CONTACT_FORM_URL, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ ...DATA, file: null }),
		});
		const RESULT = await RESPONSE.json();
		$("#success-message").modal("show");
		$(".modal-body #postResult").val(Object.entries(RESULT).map(([key, value]) => `${key}: ${value}`).join('\n'));
		console.log("Success:", RESULT);
	} catch (error) {
		$("#failed-message").modal("show");
		console.error("Error:", error);
	}
});

const hash = window.location.hash;
if (hash) {
	jQuery(hash).show();
}