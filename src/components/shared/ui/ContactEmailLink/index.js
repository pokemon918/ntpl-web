import React from 'react';

import {appConstants} from 'const';

const ContactEmailLink = () => (
	<a href={`mailto:${appConstants.CONTACT_EMAIL_ADDRESS}`}>{appConstants.CONTACT_EMAIL_ADDRESS}</a>
);

export default ContactEmailLink;
