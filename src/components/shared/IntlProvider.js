import React from 'react';
import {connect} from 'react-redux';
import {IntlProvider as BaseIntlProvider} from 'react-intl';

import {Languages} from 'const/languages';

const IntlProvider = ({lang, children}) => (
	<BaseIntlProvider key={lang} locale={lang} messages={Languages[lang]}>
		{children}
	</BaseIntlProvider>
);

function mapStateToProps(state) {
	return {
		lang: state.user.language,
	};
}

export default connect(mapStateToProps)(IntlProvider);
