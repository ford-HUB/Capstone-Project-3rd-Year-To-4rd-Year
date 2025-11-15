import React from 'react'

const DataDeletion = () => {
	return (
		<div style={{ maxWidth: 800, margin: '40px auto', padding: '0 16px', lineHeight: 1.6 }}>
			<h1 style={{ marginBottom: 16 }}>Data Deletion</h1>
			<p style={{ marginBottom: 12 }}>
				You can request deletion of your UCLM CARES account and associated personal data at any time.
			</p>
			<h3 style={{ margin: '20px 0 8px' }}>How to request deletion</h3>
			<ol style={{ paddingLeft: 18, margin: 0 }}>
				<li style={{ marginBottom: 8 }}>
					Send an email to <a href="mailto:uclmcaresdev1@gmail.com">uclmcaresdev1@gmail.com</a> with the subject:
					<span> "Data Deletion Request"</span>.
				</li>
				<li style={{ marginBottom: 8 }}>
					Include the following in your message:
					<ul style={{ paddingLeft: 18, marginTop: 8 }}>
						<li>Full name</li>
						<li>Registered email address</li>
						<li>Any participant/donor ID (if applicable)</li>
						<li>A brief confirmation that you want your data deleted</li>
					</ul>
				</li>
				<li>We may contact you to verify your identity before proceeding.</li>
			</ol>
			<h3 style={{ margin: '20px 0 8px' }}>What happens next</h3>
			<ul style={{ paddingLeft: 18, margin: 0 }}>
				<li style={{ marginBottom: 8 }}>
					We aim to process deletion requests promptly and will notify you once completed.
				</li>
				<li style={{ marginBottom: 8 }}>
					We will delete profile data and personal information associated with your account from active systems.
				</li>
				<li style={{ marginBottom: 8 }}>
					Certain records may be retained as required by law (e.g., financial/transaction records) or for security, audit,
					and compliance purposes. Non-identifiable, aggregated, or anonymized data may be retained.
				</li>
				<li>
					Data stored in backups will be removed during our normal backup retention cycle.
				</li>
			</ul>
			<h3 style={{ margin: '20px 0 8px' }}>Questions</h3>
			<p style={{ marginBottom: 12 }}>
				If you have questions or want to check the status of your request, please reply to your deletion request email or
				contact us at <a href="mailto:uclmcaresdev1@gmail.com">uclmcaresdev1@gmail.com</a>.
			</p>
		</div>
	)
}

export default DataDeletion


